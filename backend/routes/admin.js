const { Router } = require("express")

const adminRouter = Router();
const { adminmodel, coursemodel } = require("../db")
const { authMiddleware, roleMiddleware } = require("../middleware/auth.js")
const { z } = require("zod");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");


user_jwt_pass=process.env.user_jwt_pass;
admin_jwt_pass=process.env.admin_jwt_pass;

adminRouter.post("/signup", async function (req, res) {

    const { firstname, lastname, email, password } = req.body;

    //check the input is in corret format
    const adminValidSchema = z.object({
        email: z.string().email().min(5).max(50),
        password: z.string().min(8),
        firstname: z.string().min(2).max(50),
        lastname: z.string().min(2).max(50)
    })

    const parsedata = adminValidSchema.safeParse(req.body);

    if (!parsedata.success) {
        res.json({
            message: "the input is invalid"
        })
        return;
    }

    //encrypt the password
    const encryptepassword = await bcrypt.hash(password, 10);


    await adminmodel.create({
        email: email,
        password: encryptepassword,
        firstname: firstname,
        lastname: lastname
    })


    res.json({
        message: "user signup successfully"
    })
})

adminRouter.post("/login", async function (req, res) {

    const { email, password } = req.body;

    const user = await adminmodel.findOne({
        email: email
    })

    if (!user) {
        res.status(404).json({
            message: "user not found.."
        })
        return;
    }
    else {
        try {
            const check = await bcrypt.compare(password, user.password);
            if (!check) {
                res.json({
                    message: "password incorrect...."
                });
                return;
            }
        } catch (err) {
            console.log("error in the bcrypt compare");
            return;
        }

        const token = jwt.sign({
            id: user._id.toString()
        }, admin_jwt_pass)

        res.json({
            token: token
        });
    }
})

adminRouter.post("/course",
    authMiddleware,
    roleMiddleware("admin"),
    async function (req, res) {
        const creatorId = req.userId;

        const { title, description, price, imageURL } = req.body;

        const course = await coursemodel.create({
            title: title,
            description: description,
            price: price,
            imageURL: imageURL,
            creatorId: creatorId
        })

        res.json({
            message: "course created....",
            courseId: course._id
        })

})



adminRouter.put("/course",
    authMiddleware,
    roleMiddleware("admin")
    , async function (req, res) {

        const creatorId = req.userId;

        const { title, description, price, imageURL, courseId } = req.body;

        const course = await coursemodel.updateOne({
            _id: courseId,
            creatorId: creatorId
        }, {
            title: title,
            description: description,
            price: price,
            imageURL: imageURL,

        })

        res.json({
            message: "course updated....",
            courseId: course._id
        })


})

adminRouter.post("/course/bulk",
    authMiddleware,
    roleMiddleware("admin"),
    async function (req, res) {
        const creatorId = req.userId;

        const courses = await coursemodel.find({
            creatorId: creatorId
        })

        res.json(courses);
})

module.exports = {
    adminRouter: adminRouter
}