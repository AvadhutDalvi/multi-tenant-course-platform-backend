const jwt=require("jsonwebtoken")
// const {user_jwt_pass}=require("../config.js")

function usermiddleware(req,res,next)
{
    const token=req.headers.token;
    const decoded=jwt.verify(token,process.env.user_jwt_pass);

    if(decoded)
    {
        req.userId=decoded._id;
        next();
    }
    else{
        res.status(403).json({
            message:"user is invalid..."
        })
    }
}

module.exports={
    usermiddleware:usermiddleware
}