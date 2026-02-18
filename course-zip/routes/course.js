const { Router } = require("express")
const CourseRouter = Router()
const {coursemodel,purchasemodel}=require("../db")


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
