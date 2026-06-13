 const { coursemodel, channelmodel, lecturemodel } = require("../db");
 
 async function createLecture(req, res){
  try {
    const { courseId } = req.params;

    const {
      title,
      description,
      module,
      order,
      status,
      duration
    } = req.body;

    // 🔥 1. BASIC VALIDATION
    if (!title?.trim()) {
      return res.status(400).json({
        message: "Lecture title is required"
      });
    }

    if (!module?.trim()) {
      return res.status(400).json({
        message: "Module is required"
      });
    }

    // order optional → auto assign if not provided
    let lectureOrder = Number(order);

    // 🔥 2. VERIFY COURSE + OWNERSHIP
    const course = await coursemodel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const channel = await channelmodel.findById(course.channel);
    if (!channel || channel.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot add lecture to this course"
      });
    }

    // 🔥 3. GET UPLOADED FILES FROM MIDDLEWARE
    const {
      video,
      thumbnail,
      materials,
      practiceSheet
    } = req.uploadedFiles || {};

    if (!video) {
      return res.status(400).json({
        message: "Video upload failed or missing"
      });
    }

    // 🔥 4. AUTO ORDER (if not provided)
    if (!lectureOrder || lectureOrder < 1) {
      const count = await lecturemodel.countDocuments({ course: courseId });
      lectureOrder = count + 1;
    }

    // 🔥 5. CLEAN DATA PREPARATION
    const lectureData = {
      title: title.trim(),
      description: description?.trim() || "",
      module: module.trim(),
      order: lectureOrder,
      status: status || "draft",
      duration: duration || "",

      course: courseId,

      video,
      thumbnail: thumbnail || undefined,
      materials: materials || [],
      practiceSheet: practiceSheet || undefined,
    };

    // 🔥 6. CREATE LECTURE
    const lecture = await lecturemodel.create(lectureData);

    // 🔥 7. LINK TO COURSE
    course.lectures.push(lecture._id);
    await course.save();

    // 🔥 8. RETURN UPDATED LECTURES
    const lectures = await lecturemodel
      .find({ course: courseId })
      .sort({ order: 1 })
      .lean();

    return res.status(201).json({
      message: "Lecture added successfully",
      lecture,
      lectures
    });

  } catch (error) {
    console.error("createLecture:", error);

    return res.status(500).json({
      message: "Failed to create lecture",
      error: error.message
    });
  }
}

module.exports = { createLecture };