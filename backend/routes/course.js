
const { Router } = require("express");
const CourseRouter = Router();
const { coursemodel, purchasemodel, lecturemodel, progressmodel  } = require("../db");
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

//crete / add lecture
CourseRouter.post(
    "/:courseId/lecture",
    authMiddleware,
    roleMiddleware("educator"),
    async function (req, res) {

        const { courseId } = req.params;
        const { title, videoUrl } = req.body;

        // 1️⃣ Check course exists and belongs to educator
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

        res.json({
            message: "Lecture added successfully",
            lectureId: lecture._id
        });
    }
);

//enrooled
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

//all
CourseRouter.get("/all", async function (req, res) {
    const courses = await coursemodel.find({});
    res.json({ courses });
});






module.exports = {

    CourseRouter: CourseRouter
}
