const {  lecturemodel } = require("../db");

async function publishLecture(req, res) {
    try {

        const { lectureId } = req.params;

        const lecture = await lecturemodel.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found",
            });
        }

        lecture.status = "published";

        await lecture.save();

        return res.status(200).json({
            message: "Lecture published successfully",
            lecture,
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }
}

module.exports = {
    publishLecture,
};