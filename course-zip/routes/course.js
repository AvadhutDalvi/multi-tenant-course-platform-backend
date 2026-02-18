
const { Router } = require("express");
const CourseRouter = Router();
const { coursemodel } = require("../db");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");

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

CourseRouter.get("/all", async function (req, res) {
    const courses = await coursemodel.find({});
    res.json({ courses });
});


CourseRouter.get("/SeePurchses", function (req, res) {

})

CourseRouter.post("/Purchse", async function (req, res) {
   const userId=req.body.userId;
   const courseId=req.body.courseId;

   await purchasemodel.create(
    {
        userId,
        courseId
    })

    res.json({
        message:"you succesfully baught the course"
    })
   
})

CourseRouter.get("/preview", async function (req, res) {

    const courses=await coursemodel.find({});

    res.json({
        courses
    })
})


module.exports = {

    CourseRouter: CourseRouter
}
