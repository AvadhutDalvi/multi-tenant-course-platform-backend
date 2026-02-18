require('dotenv').config()
console.log(process.env.MONGO_URL);
const express=require("express")
const {CourseRouter}=require("./routes/course")
const {UserRouter}=require("./routes/user")
const {adminRouter}=require("./routes/admin")
const mongoose=require("mongoose")


const app=express();
app.use(express.json());

app.use("/user",UserRouter)
app.use("/admin",adminRouter)
app.use("/course",CourseRouter)



async function main(){

   await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000);
    console.log("database connected....")
}

main()