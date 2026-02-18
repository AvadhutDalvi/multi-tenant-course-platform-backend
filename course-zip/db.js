const mongoose=require("mongoose")

const schema=mongoose.Schema;
const ObjectId=mongoose.Types.ObjectId;


const userschema=new schema({
    email: {type: String, unique:true},
    password: String,
    firstname: String,
    lastname: String
});

const adminschema=new schema({
    email: {type: String, unique:true},
    password: String,
    firstname: String,
    lastname: String
});

const courseschema=new schema({
    title: String,
    description: String,
    price: String,
    imageURL: String,
    creatorId: ObjectId
});

const purchaseschema=new schema({
    
    userId: ObjectId,
    courseId: ObjectId
});


const usermodel=mongoose.model("users",userschema);
const adminmodel=mongoose.model("admins",adminschema);
const coursemodel=mongoose.model("courses",courseschema);
const purchasemodel=mongoose.model("purchases",purchaseschema);

module.exports={
    usermodel,
    adminmodel,
    coursemodel,
    purchasemodel
}


