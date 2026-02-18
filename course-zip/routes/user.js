
const { Router } = require("express")

const UserRouter = Router();
const { usermodel, purchasemodel } = require("../db");
const { z } = require("zod");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
const user_jwt_pass="user@321"


UserRouter.post("/signup", async function (req, res) {
     const firstname = req.body.firstname;
    const password = req.body.password;
    const email = req.body.email;
    const lastname= req.body.lastname;

    //check the input is in corret format
    const userValidSchema = z.object({
        email: z.string().email().min(5).max(50),
        password: z.string().min(8),
        firstname: z.string().min(2).max(50),
        lastname: z.string().min(2).max(50)
    })

    const parsedata = userValidSchema.safeParse(req.body);

    if (!parsedata.success) {
        res.json({
            message: "the input is invalid"
        })
        return;
    }

    //encrypt the password
    const encryptepassword = await bcrypt.hash(password, 10);

    
        await usermodel.create({
            email: email,
            password: encryptepassword,
            firstname: firstname,
            lastname: lastname
        })
   

    res.json({
        message: "user signup successfully"
    })

})

UserRouter.post("/login", async function (req, res) {

    const { email,password}=req.body;

    const user=await usermodel.findOne({
        email:email
    })

    if(!user)
    {
        res.status(404).json({
            message:"user not found.."
        })
        return;
    }
    else{

        try{
        const check=await bcrypt.compare(password,user.password);
        if(!check)
        {
            res.send("password incorrect....");
            return;
        }
        }catch(err)
        {
            console.log("error in the bcrypt compare");
            return;
        }


        const token=jwt.sign({
            id:user._id.toString()
        },user_jwt_pass)

        res.json({
            token:token
        });
    }
})

    



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