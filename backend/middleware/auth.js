const jwt = require("jsonwebtoken");
const { coursemodel, purchasemodel, lecturemodel, progressmodel, channelmodel } = require("../db");

user_jwt_pass=process.env.user_jwt_pass;
admin_jwt_pass=process.env.admin_jwt_pass;

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, user_jwt_pass);

        req.user = {
            id: decoded.id,
            role: decoded.role,
            name:decoded.name 
        };

        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

function roleMiddleware(requiredRole) {
    return function (req, res, next) {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                message: "Access denied"
            });
        }
        next();
    };
}

async function requireCourseOwner(req, res, next) {
  const { courseId } = req.params;

  const course = await coursemodel.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const channel = await channelmodel.findById(course.channel);
  if (!channel || channel.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  req.course = course;
  req.channel = channel;
  next();
}

async function requireLectureOwner(req, res, next) {
  const { lectureId } = req.params;

  const lecture = await lecturemodel.findById(lectureId);
  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  const course = await coursemodel.findById(lecture.course);
  const channel = course ? await channelmodel.findById(course.channel) : null;

  if (!channel || channel.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  req.lecture = lecture;
  req.course = course;
  req.channel = channel;
  next();
}

async function requireCourseEnrollment(req, res, next) {
  const progress = await progressmodel.findOne({
    student: req.user.id,
    course: req.params.courseId
  });

  if (!progress) {
    return res.status(403).json({ message: "Not enrolled in this course" });
  }

  req.progress = progress;
  next();
}

module.exports = {
    authMiddleware,
    roleMiddleware,
    requireCourseOwner,
    requireLectureOwner,
    requireCourseEnrollment
};
