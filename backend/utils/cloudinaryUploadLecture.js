import cloudinary from "../cloudinary.js";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function uploadLectureToCloudinary(req, res) {
    let tempVideoPath = null;
    let tempThumbPath = null;
    try {
        const { courseId } = req.params;
        const title = req.body.title != null ? String(req.body.title).trim() : "";
        const description = req.body.description != null ? String(req.body.description).trim() : "";
        const moduleName = req.body.module != null ? String(req.body.module).trim() : "";
        const videoFiles = req.files && req.files.video;
        const thumbnailFiles = req.files && req.files.thumbnail;

        if (!title) {
            return res.status(400).json({ message: "Lecture title is required" });
        }
        if (!videoFiles || !videoFiles[0]) {
            return res.status(400).json({ message: "Video file is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await coursemodel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const channel = await channelmodel.findById(course.channel);
        if (!channel || channel.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "You cannot add lectures to this course" });
        }

        const videoFile = videoFiles[0];
        tempVideoPath = path.join(os.tmpdir(), `lecture-video-${Date.now()}-${videoFile.originalname}`);
        await fs.writeFile(tempVideoPath, videoFile.buffer);

        const videoResult = await cloudinary.uploader.upload(tempVideoPath, {
            resource_type: "video",
            folder: "lectures/videos",
        });
        await fs.unlink(tempVideoPath).catch(() => {});
        tempVideoPath = null;

        let thumbnailResult = null;
        if (thumbnailFiles && thumbnailFiles[0]) {
            const thumbFile = thumbnailFiles[0];
            tempThumbPath = path.join(os.tmpdir(), `lecture-thumb-${Date.now()}-${thumbFile.originalname}`);
            await fs.writeFile(tempThumbPath, thumbFile.buffer);
            thumbnailResult = await cloudinary.uploader.upload(tempThumbPath, {
                resource_type: "image",
                folder: "lectures/thumbnails",
            });
            await fs.unlink(tempThumbPath).catch(() => {});
            tempThumbPath = null;
        }

        const order =
            (await lecturemodel.countDocuments({ course: courseId })) + 1;

        const lectureData = {
            title,
            description: description || undefined,
            module: moduleName || "Default",
            order,
            course: courseId,
            videoUrl: videoResult.secure_url,
            video: {
                url: videoResult.secure_url,
                public_id: videoResult.public_id,
            },
        };
        if (thumbnailResult) {
            lectureData.thumbnail = {
                url: thumbnailResult.secure_url,
                public_id: thumbnailResult.public_id,
            };
        }

        const lecture = await lecturemodel.create(lectureData);
        course.lectures.push(lecture._id);
        await course.save();

        const created = await lecturemodel.findById(lecture._id).lean();
        res.status(201).json(created);
    } catch (err) {
        if (tempVideoPath) fs.unlink(tempVideoPath).catch(() => {});
        if (tempThumbPath) fs.unlink(tempThumbPath).catch(() => {});
        console.error("uploadLectureToCloudinary:", err);
        res.status(500).json({
            message: err.message || "Failed to upload lecture",
        });
    }
}

