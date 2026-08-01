import cloudinary from "../cloudinary.js";
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

export async function updateLectureToCloudinary(req, res, next) {

    try {

        const videoFiles = req.files?.video;
        const thumbnailFiles = req.files?.thumbnail;
        const materialFiles = req.files?.materials || [];
        const practiceSheetFiles = req.files?.practiceSheet;

        let videoData = null;
        let thumbnailData = null;
        let materialsData = [];
        let practiceSheetData = null;

        // 🔥 VIDEO
        if (videoFiles?.[0]) {

            let tempPath = null;

            try {

                const videoFile = videoFiles[0];

                tempPath = path.join(
                    os.tmpdir(),
                    `video-${Date.now()}`
                );

                await fs.writeFile(
                    tempPath,
                    videoFile.buffer
                );

                const result = await cloudinary.uploader.upload(
                    tempPath,
                    {
                        resource_type: "video",
                        folder: "lectures/videos",
                    }
                );

                videoData = {
                    url: result.secure_url,
                    public_id: result.public_id,
                };

            } finally {

                if (tempPath) {
                    await fs.unlink(tempPath).catch(() => { });
                }

            }

        }

        // 🔥 THUMBNAIL
        if (thumbnailFiles?.[0]) {

            let tempPath = null;

            try {

                const thumbFile = thumbnailFiles[0];

                tempPath = path.join(
                    os.tmpdir(),
                    `thumb-${Date.now()}`
                );

                await fs.writeFile(
                    tempPath,
                    thumbFile.buffer
                );

                const result = await cloudinary.uploader.upload(
                    tempPath,
                    {
                        resource_type: "image",
                        folder: "lectures/thumbnails",
                    }
                );

                thumbnailData = {
                    url: result.secure_url,
                    public_id: result.public_id,
                };

            } finally {

                if (tempPath) {
                    await fs.unlink(tempPath).catch(() => { });
                }

            }

        }

        // 📄 MATERIALS
        if (materialFiles.length > 0) {

            for (const materialFile of materialFiles) {

                let tempPath = null;

                try {

                    tempPath = path.join(
                        os.tmpdir(),
                        `material-${crypto.randomUUID()}`
                    );

                    await fs.writeFile(
                        tempPath,
                        materialFile.buffer
                    );

                    const result = await cloudinary.uploader.upload(
                        tempPath,
                        {
                            resource_type: "raw",
                            folder: "lectures/materials",
                        }
                    );

                    materialsData.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });

                } finally {

                    if (tempPath) {
                        await fs.unlink(tempPath).catch(() => { });
                    }

                }

            }

        }
        
        //  practivesheet
        if (practiceSheetFiles?.[0]) {
            
            let tempPath = null;
            
            try {

                const practiceFile = practiceSheetFiles[0];

                tempPath = path.join(
                    os.tmpdir(),
                    `practice-${crypto.randomUUID()}`
                );

                await fs.writeFile(
                    tempPath,
                    practiceFile.buffer
                );

                const result = await cloudinary.uploader.upload(
                    tempPath,
                    {
                        resource_type: "raw",
                        folder: "lectures/practice",
                    }
                );

                practiceSheetData = {
                    url: result.secure_url,
                    public_id: result.public_id,
                };

            } finally {

                if (tempPath) {
                    await fs.unlink(tempPath).catch(() => { });
                }

            }

        }

        req.uploadedFiles = {
            video: videoData,
            thumbnail: thumbnailData,
            materials: materialsData,
            practiceSheet: practiceSheetData,
        };
        return next();

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

}