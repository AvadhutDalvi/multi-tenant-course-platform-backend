
const { Router } = require("express")

const UserRouter = Router();
const { usermodel, purchasemodel } = require("../db");
const { z } = require("zod");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");



admin_jwt_pass=process.env.admin_jwt_pass;
user_jwt_pass=process.env.user_jwt_pass;


UserRouter.post("/signup", async function (req, res) {
    const { firstname, lastname, email, password, role } = req.body;

    const userValidSchema = z.object({
        email: z.string().email().min(5).max(50),
        password: z.string().min(8),
        firstname: z.string().min(2).max(50),
        lastname: z.string().min(2).max(50),
        role: z.enum(["student", "educator"]).optional()
    });

    const parsedata = userValidSchema.safeParse(req.body);

    if (!parsedata.success) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        await usermodel.create({
            email,
            password: encryptedPassword,
            firstname,
            lastname,
            role: role || "student"
        });

        res.json({
            message: "User signup successful"
        });

    } catch (err) {
        res.status(500).json({
            message: "Error creating user"
        });
    }
});


UserRouter.post("/login", async function (req, res) {

    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
        return res.status(403).json({
            message: "Incorrect password"
        });
    }
    
    //console.log(user.firstname);
    const token = jwt.sign({
        id: user._id.toString(),
        role: user.role,
        name: user.firstname
    }, user_jwt_pass,
    {
        expiresIn: "7d"
    });

    res.json({
        token
    });
});

    



UserRouter.post("/purchase_course", async function (req, res) {

    const userId=req.body.userId;

    const courses=await purchasemodel.find({
        userId: userId
    })

    res.json({userId})
})



module.exports = {
    UserRouter: UserRouter,
    user_jwt_pass:user_jwt_pass
}

