const { Router } = require("express");
const mongoose = require("mongoose");
const CourseRouter = Router();
const { coursemodel, purchasemodel, lecturemodel, progressmodel } = require("../db");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");

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

            // 1️⃣ Verify course ownership
            const course = await coursemodel.findOne({
                _id: courseId,
                educator: req.user.id
            });

            if (!course) {
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

            const course = await coursemodel.findOne({
                _id: courseId,
                educator: req.user.id
            });
            if (!course) {
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

            const course = await coursemodel.findOne({
                _id: courseId,
                educator: req.user.id
            });
            if (!course) {
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

        const purchases = await purchasemodel.find({
            student: req.user.id
        }).populate("course");

        const enrolledCourses = purchases.map(p => p.course);

        res.json({
            courses: enrolledCourses
        });
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





//create
CourseRouter.post(
    "/create",
    authMiddleware,
    roleMiddleware("educator"),
    async function (req, res) {

        const { title, description, price, imageURL } = req.body;

        try {
            const course = await coursemodel.create({
                title,
                description,
                price,
                imageURL,
                educator: req.user.id
            });

            res.json({
                message: "Course created successfully",
                courseId: course._id
            });
        } catch (err) {
            res.status(500).json({
                message: "Error creating course"
            });
        }
    }
);

//get the cousrses created by the educator
CourseRouter.get(
  "/creator",
  authMiddleware,
  roleMiddleware("educator"),
  async function (req, res) {
    try {
        
      const courses = await coursemodel.find({
        educator: req.user.id
      });

      res.json({
        courses
      });

    } catch (error) {
      res.status(500).json({
        message: "Error fetching educator courses"
      });
    }
  }
);

CourseRouter.get("/:courseId", authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        console.log("Schema paths:");
        console.log(Object.keys(coursemodel.schema.paths));
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
