import cloudinary from "../cloudinary.js";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function uploadLectureToCloudinary(req, res, next) {
    let tempVideoPath = null;
    let tempThumbPath = null;

    try {
        const videoFiles = req.files?.video;
        const thumbnailFiles = req.files?.thumbnail;
        const videoUrl = req.body.videoUrl;

        if ((!videoFiles || !videoFiles[0]) && !videoUrl) {
            return res.status(400).json({
                message: "Video file or URL is required"
            });
        }


        // 🔥 VIDEO (HANDLE FILE OR URL)
        let videoData = null;

        if (videoFiles && videoFiles[0]) {
            const videoFile = videoFiles[0];

            tempVideoPath = path.join(os.tmpdir(), `video-${Date.now()}`);
            await fs.writeFile(tempVideoPath, videoFile.buffer);

            const videoResult = await cloudinary.uploader.upload(tempVideoPath, {
                resource_type: "video",
                folder: "lectures/videos",
            });

            await fs.unlink(tempVideoPath).catch(() => { });
            tempVideoPath = null;

            videoData = {
                url: videoResult.secure_url,
                public_id: videoResult.public_id,
            };

        } else if (videoUrl) {
            // 🔥 URL CASE
            videoData = {
                url: videoUrl,
                public_id: null,
            };
        }

        // 🔥 THUMBNAIL
        const thumbnailUrl = req.body.thumbnailUrl;
        let thumbnailData = null;

        if (thumbnailFiles?.[0]) {
            const thumbFile = thumbnailFiles[0];
            tempThumbPath = path.join(os.tmpdir(), `thumb-${Date.now()}`);
            await fs.writeFile(tempThumbPath, thumbFile.buffer);

            const thumbResult = await cloudinary.uploader.upload(tempThumbPath, {
                resource_type: "image",
                folder: "lectures/thumbnails",
            });

            await fs.unlink(tempThumbPath).catch(() => { });
            tempThumbPath = null;

            thumbnailData = {
                url: thumbResult.secure_url,
                public_id: thumbResult.public_id,
            };

        } else if (thumbnailUrl) {
            thumbnailData = {
                url: thumbnailUrl,
                public_id: null,
            };
        }

        // 🔥 MATERIALS
        const materials = [];
        if (req.files?.materials) {
            for (let file of req.files.materials) {
                const tempPath = path.join(os.tmpdir(), `mat-${Date.now()}`);
                await fs.writeFile(tempPath, file.buffer);

                const result = await cloudinary.uploader.upload(tempPath, {
                    folder: "lectures/materials",
                });

                await fs.unlink(tempPath).catch(() => { });

                materials.push({
                    title: file.originalname,
                    url: result.secure_url,
                });
            }
        }

        // 🔥 PRACTICE SHEET
        let practiceSheet = null;
        if (req.files?.practiceSheet?.[0]) {
            const file = req.files.practiceSheet[0];
            const tempPath = path.join(os.tmpdir(), `ps-${Date.now()}`);
            await fs.writeFile(tempPath, file.buffer);

            const result = await cloudinary.uploader.upload(tempPath, {
                folder: "lectures/practice",
            });

            await fs.unlink(tempPath).catch(() => { });

            practiceSheet = {
                title: file.originalname,
                url: result.secure_url,
            };
        }

        // 🔥 PASS TO NEXT
        req.uploadedFiles = {
            video: videoData,
            thumbnail: thumbnailData,
            materials,
            practiceSheet,
        };

        next();

    } catch (err) {
        if (tempVideoPath) fs.unlink(tempVideoPath).catch(() => { });
        if (tempThumbPath) fs.unlink(tempThumbPath).catch(() => { });
        res.status(500).json({ message: err.message });
    }
}