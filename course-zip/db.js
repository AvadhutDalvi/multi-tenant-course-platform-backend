const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userschema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    role: {
        type: String,
        enum: ["student", "educator", "admin"],
        default: "student"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const courseschema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageURL: String,
    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const purchaseschema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const usermodel = mongoose.model("users", userschema);
const coursemodel = mongoose.model("courses", courseschema);
const purchasemodel = mongoose.model("purchases", purchaseschema);

module.exports = {
    usermodel,
    coursemodel,
    purchasemodel
};