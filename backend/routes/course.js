const { Router } = require("express");
const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const CourseRouter = Router();
const { coursemodel, purchasemodel, lecturemodel, progressmodel, channelmodel } = require("../db");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const cloudinary = require("../cloudinary");
const { uploadLectureFiles } = require("../middleware/upload");

// Consolidated LMS data for a course
async function learnCourse(req, res) {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        // 1️⃣ Verify enrollment via progress document
        const progress = await progressmodel.findOne({
            student: studentId,
            course: courseId
        });

        if (!progress) {
            return res.status(403).json({
                message: "Not enrolled in this course"
            });
        }

        // 2️⃣ Fetch course
        const courseDoc = await coursemodel.findById(courseId).lean();
        if (!courseDoc) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Optionally attach channel name + slug
        let course = courseDoc;
        if (courseDoc.channel) {
            const chan = await channelmodel
                .findById(courseDoc.channel)
                .select("name slug")
                .lean();

            if (chan) {
                course = {
                    ...courseDoc,
                    channel: {
                        _id: chan._id,
                        name: chan.name,
                        slug: chan.slug
                    }
                };
            }
        }

        // 3️⃣ Fetch lectures for this course
        const lectures = await lecturemodel
            .find({ course: courseId })
            .sort({ order: 1 })
            .lean();

        const totalLectures = lectures.length;

        // 4️⃣ Determine current lecture
        const completedSet = new Set(
            (progress.completedLectures || []).map((id) => String(id))
        );

        let currentLecture = null;
        if (lectures.length > 0) {
            currentLecture =
                lectures.find((lec) => !completedSet.has(String(lec._id))) ||
                lectures[lectures.length - 1];
        }

        // 5️⃣ Recalculate stats safely
        const completedCount = lectures.filter((lec) =>
            completedSet.has(String(lec._id))
        ).length;

        const percentage =
            totalLectures === 0
                ? 0
                : Math.round((completedCount / totalLectures) * 100);

        return res.json({
            course,
            lectures,
            progress: {
                completedLectures: progress.completedLectures || [],
                percentage
            },
            currentLecture,
            stats: {
                totalLectures,
                completedCount
            }
        });
    } catch (err) {
        console.error("Error in learnCourse:", err);
        return res.status(500).json({
            message: "Failed to load course learn data"
        });
    }
}

//progress
CourseRouter.get(
    "/:courseId/progress",
    authMiddleware,
    roleMiddleware("student"),
    async function (req, res) {

        const { courseId } = req.params;

        const progress = await progressmodel.findOne({
            student: req.user.id,
            course: courseId
        });

        if (!progress) {
            return res.status(403).json({
                message: "Not enrolled in this course"
            });
        }

        const totalLectures = await lecturemodel.countDocuments({
            course: courseId
        });

        const updatedPercentage =
            (progress.completedLectures.length / totalLectures) * 100;

        res.json({
            completedLectures: progress.completedLectures.length,
            totalLectures,
            percentage: updatedPercentage
        });
    }
);

// consolidated LMS data for a course
CourseRouter.get(
    "/:courseId/learn",
    authMiddleware,
    roleMiddleware("student"),
    learnCourse
);

//mark lecture complete
CourseRouter.post(
    "/:courseId/lecture/:lectureId/complete",
    authMiddleware,
    roleMiddleware("student"),
    async function (req, res) {

        const { courseId, lectureId } = req.params;

        // 1️⃣ Find progress
        const progress = await progressmodel.findOne({
            student: req.user.id,
            course: courseId
        });

        if (!progress) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        // 2️⃣ Prevent duplicate completion
        if (progress.completedLectures.includes(lectureId)) {
            return res.json({
                message: "Lecture already completed"
            });
        }

        // 3️⃣ Add lecture to completed list
        progress.completedLectures.push(lectureId);

        // 4️⃣ Recalculate percentage
        const totalLectures = await lecturemodel.countDocuments({
            course: courseId
        });

        progress.percentage =
            (progress.completedLectures.length / totalLectures) * 100;

        await progress.save();

        res.json({
            message: "Lecture marked as complete",
            percentage: progress.percentage
        });
    }
);

// upload lecture video to Cloudinary (educator only)
async function uploadLectureToCloudinary(req, res) {
    let tempVideoPath = null;
    let tempThumbPath = null;
    try {
        const { courseId } = req.params;
        const title = req.body.title != null ? String(req.body.title).trim() : "";
        const description = req.body.description != null ? String(req.body.description).trim() : "";
        const moduleName = req.body.module != null ? String(req.body.module).trim() : "";
        const videoFiles = req.files && req.files.video;
        const thumbnailFiles = req.files && req.files.thumbnail;

        if (!title) {
            return res.status(400).json({ message: "Lecture title is required" });
        }
        if (!videoFiles || !videoFiles[0]) {
            return res.status(400).json({ message: "Video file is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await coursemodel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const channel = await channelmodel.findById(course.channel);
        if (!channel || channel.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "You cannot add lectures to this course" });
        }

        const videoFile = videoFiles[0];
        tempVideoPath = path.join(os.tmpdir(), `lecture-video-${Date.now()}-${videoFile.originalname}`);
        await fs.writeFile(tempVideoPath, videoFile.buffer);

        const videoResult = await cloudinary.uploader.upload(tempVideoPath, {
            resource_type: "video",
            folder: "lectures/videos",
        });
        await fs.unlink(tempVideoPath).catch(() => {});
        tempVideoPath = null;

        let thumbnailResult = null;
        if (thumbnailFiles && thumbnailFiles[0]) {
            const thumbFile = thumbnailFiles[0];
            tempThumbPath = path.join(os.tmpdir(), `lecture-thumb-${Date.now()}-${thumbFile.originalname}`);
            await fs.writeFile(tempThumbPath, thumbFile.buffer);
            thumbnailResult = await cloudinary.uploader.upload(tempThumbPath, {
                resource_type: "image",
                folder: "lectures/thumbnails",
            });
            await fs.unlink(tempThumbPath).catch(() => {});
            tempThumbPath = null;
        }

        const order =
            (await lecturemodel.countDocuments({ course: courseId })) + 1;

        const lectureData = {
            title,
            description: description || undefined,
            module: moduleName || "Default",
            order,
            course: courseId,
            videoUrl: videoResult.secure_url,
            video: {
                url: videoResult.secure_url,
                public_id: videoResult.public_id,
            },
        };
        if (thumbnailResult) {
            lectureData.thumbnail = {
                url: thumbnailResult.secure_url,
                public_id: thumbnailResult.public_id,
            };
        }

        const lecture = await lecturemodel.create(lectureData);
        course.lectures.push(lecture._id);
        await course.save();

        const created = await lecturemodel.findById(lecture._id).lean();
        res.status(201).json(created);
    } catch (err) {
        if (tempVideoPath) fs.unlink(tempVideoPath).catch(() => {});
        if (tempThumbPath) fs.unlink(tempThumbPath).catch(() => {});
        console.error("uploadLectureToCloudinary:", err);
        res.status(500).json({
            message: err.message || "Failed to upload lecture",
        });
    }
}

CourseRouter.post(
    "/:courseId/lecture/upload",
    authMiddleware,
    roleMiddleware("educator"),
    uploadLectureFiles,
    uploadLectureToCloudinary
);

// add lecture (educator only, ownership validated)
CourseRouter.post(
    "/:courseId/lecture",
    authMiddleware,
    roleMiddleware("educator"),
    async function (req, res) {

        try {
            const { courseId } = req.params;
            const { title, videoUrl } = req.body;

            if (!title || typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    message: "Lecture title is required"
                });
            }

            // 1️⃣ Verify course ownership (via channel)
            const course = await coursemodel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            const channel = await channelmodel.findById(course.channel);
            if (!channel || channel.owner.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "You cannot add lecture to this course"
                });
            }

            // 2️⃣ Create lecture
            const lecture = await lecturemodel.create({
                title,
                videoUrl,
                course: courseId
            });

            // add lecture to course lectures array
            course.lectures.push(lecture._id);

            await course.save();

            // 3️⃣ Return updated lectures (fetch without populate to avoid strictPopulate issues)
            const lectures = await lecturemodel
                .find({ course: courseId })
                .sort({ createdAt: 1 })
                .lean();

            res.json({
                message: "Lecture added successfully",
                lectures
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// update lecture (educator only, course + lecture ownership validated)
CourseRouter.put(
    "/:courseId/lecture/:lectureId",
    authMiddleware,
    roleMiddleware("educator"),
    async function (req, res) {
        try {
            const { courseId, lectureId } = req.params;
            const { title, videoUrl } = req.body;

            if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(lectureId)) {
                return res.status(400).json({ message: "Invalid course or lecture ID" });
            }

            const course = await coursemodel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            const channel = await channelmodel.findById(course.channel);
            if (!channel || channel.owner.toString() !== req.user.id) {
                return res.status(403).json({ message: "You cannot edit lectures in this course" });
            }

            const lecture = await lecturemodel.findOne({
                _id: lectureId,
                course: courseId
            });
            if (!lecture) {
                return res.status(404).json({ message: "Lecture not found" });
            }

            if (title !== undefined) {
                if (typeof title !== "string" || !title.trim()) {
                    return res.status(400).json({ message: "Lecture title is required" });
                }
                lecture.title = title.trim();
            }
            if (videoUrl !== undefined && typeof videoUrl === "string") {
                lecture.videoUrl = videoUrl.trim() || lecture.videoUrl;
            }

            await lecture.save();

            const lectures = await lecturemodel
                .find({ course: courseId })
                .sort({ createdAt: 1 })
                .lean();

            res.json({ message: "Lecture updated", lectures });
        } catch (error) {
            res.status(500).json({ message: error.message || "Failed to update lecture" });
        }
    }
);

// delete lecture (educator only, course + lecture ownership validated)
CourseRouter.delete(
    "/:courseId/lecture/:lectureId",
    authMiddleware,
    roleMiddleware("educator"),
    async function (req, res) {
        try {
            const { courseId, lectureId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(lectureId)) {
                return res.status(400).json({ message: "Invalid course or lecture ID" });
            }

            const course = await coursemodel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            const channel = await channelmodel.findById(course.channel);
            if (!channel || channel.owner.toString() !== req.user.id) {
                return res.status(403).json({ message: "You cannot delete lectures from this course" });
            }

            const lecture = await lecturemodel.findOne({
                _id: lectureId,
                course: courseId
            });
            if (!lecture) {
                return res.status(404).json({ message: "Lecture not found" });
            }

            await lecturemodel.findByIdAndDelete(lectureId);
            course.lectures = course.lectures.filter(
                (id) => id.toString() !== lectureId
            );
            await course.save();

            const lectures = await lecturemodel
                .find({ course: courseId })
                .sort({ createdAt: 1 })
                .lean();

            res.json({ message: "Lecture deleted", lectures });
        } catch (error) {
            res.status(500).json({ message: error.message || "Failed to delete lecture" });
        }
    }
);

//enrolled
CourseRouter.get(
  "/enrolled",
  authMiddleware,
  roleMiddleware("student"),
  async function (req, res) {
    try {
      const userId = req.user.id;

      // 1. Get purchased courses
      const purchases = await purchasemodel.find({
        student: userId
      }).populate("course");

      // 2. Get progress data
      const progressData = await progressmodel.find({
        student: userId
      });

      // 3. Convert progress to map (fast lookup)
      const progressMap = new Map();

      progressData.forEach(p => {
        progressMap.set(p.course.toString(), p);
      });

      // 4. Merge everything
      const enrolledCourses = await Promise.all(
        purchases.map(async (p) => {
          const course = p.course;

          const progress = progressMap.get(course._id.toString());

          // count lectures
          const totalLectures = await lecturemodel.countDocuments({
            course: course._id
          });

          return {
            _id: course._id,
            title: course.title,
            description: course.description,
            price: course.price,
            instructor: course.owner,
            // 🔥 NEW DATA
            progress: progress?.percentage || 0,
            completedLectures: progress?.completedLectures.length || 0,
            totalLectures: totalLectures,

            
          };
        })
      );

      res.json({
        courses: enrolledCourses
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to fetch enrolled courses"
      });
    }
  }
);

//purchase
CourseRouter.post(
    "/purchase",
    authMiddleware,
    roleMiddleware("student"),
    async function (req, res) {

        const { courseId } = req.body;

        try {
            // 1️⃣ Check course exists
            const course = await coursemodel.findById(courseId);

            if (!course) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            // 2️⃣ Check duplicate purchase
            const existingPurchase = await purchasemodel.findOne({
                student: req.user.id,
                course: courseId
            });

            if (existingPurchase) {
                return res.status(400).json({
                    message: "Course already purchased"
                });
            }

            // 3️⃣ Create purchase
            await purchasemodel.create({
                student: req.user.id,
                course: courseId
            });

            await progressmodel.create({
                student: req.user.id,
                course: courseId,
                completedLectures: [],
                percentage: 0
            });

            res.json({
                message: "Course purchased successfully"
            });

        } catch (err) {
            res.status(500).json({
                message: "Error purchasing course"
            });
        }
    }
);





// create course (educator must have a channel first)
CourseRouter.post(
    "/create",
    authMiddleware,
    roleMiddleware("educator"),
    async function (req, res) {
        const { title, description, price, imageURL } = req.body;

        try {
            const channel = await channelmodel.findOne({ owner: req.user.id });
            if (!channel) {
                return res.status(400).json({
                    message: "You must create a channel before creating courses"
                });
            }

            const course = await coursemodel.create({
                title,
                description,
                price,
                imageURL,
                channel: channel._id
            });

            res.json({
                message: "Course created successfully",
                courseId: course._id
            });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Error creating course"
            });
        }
    }
);

// get courses created by the educator (via their channel)
CourseRouter.get(
  "/creator",
  authMiddleware,
  roleMiddleware("educator"),
  async function (req, res) {
    try {
      const channel = await channelmodel.findOne({
        owner: req.user.id
      });

      if (!channel) {
        return res.json({ courses: [] });
      }

      const courses = await coursemodel.find({
        channel: channel._id
      });

      const enrichedCourses = await Promise.all(
        courses.map(async (course) => {
          const students = await purchasemodel.countDocuments({
            course: course._id
          });

          const revenue = students * course.price;

          return {
            _id: course._id,
            title: course.title,
            description: course.description,
            price: course.price,

            status: course.status || "draft",
            students,
            revenue,
            rating: 4.5 // placeholder for now
          };
        })
      );

      res.json({ courses: enrichedCourses });

    } catch (error) {
      res.status(500).json({
        message: error.message || "Error fetching educator courses"
      });
    }
  }
);

CourseRouter.get("/:courseId", authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await coursemodel.findById(courseId).lean();
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Fetch lectures separately (no populate — avoids strictPopulate error)
        const lectures = await lecturemodel
            .find({ course: courseId })
            .sort({ createdAt: 1 })
            .lean();

        res.json({
            course: {
                ...course,
                lectures
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//all
CourseRouter.get("/all", async function (req, res) {
    const courses = await coursemodel.find({});
    res.json({ courses });
});






module.exports = {

    CourseRouter: CourseRouter
}
