const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const progressSchema = new Schema({
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
    completedLectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lectures"
        }
    ],
    percentage: {
        type: Number,
        default: 0
    }
});


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

const channelSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    logo: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

channelSchema.pre("save", function () {
    if (this.slug) this.slug = this.slug.trim().toLowerCase();
});

const courseschema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageURL: String,
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "channels",
        required: true
    },
    lectures: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "lectures"
        }],
        default: []
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

const lectureschema = new Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
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

const progressmodel = mongoose.model("progress", progressSchema);
const lecturemodel = mongoose.model("lectures", lectureschema);
const usermodel = mongoose.model("users", userschema);
const channelmodel = mongoose.model("channels", channelSchema);
const coursemodel = mongoose.model("courses", courseschema);
const purchasemodel = mongoose.model("purchases", purchaseschema);

module.exports = {
    usermodel,
    channelmodel,
    coursemodel,
    purchasemodel,
    lecturemodel,
    progressmodel
};