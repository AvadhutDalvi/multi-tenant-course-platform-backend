import cloudinary from "../cloudinary.js";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function uploadLectureToCloudinary(req, res, next) {



    try {
        const videoFiles = req.files?.video;
        const thumbnailFiles = req.files?.thumbnail;
        const videoUrl = req.body.videoUrl;
        const thumbnailUrl = req.body.thumbnailUrl;
        const practiceSheetTitle = req.body.practiceSheetTitle;

        // 🔥 VIDEO (HANDLE FILE OR URL)
        let videoData = null;

        if ((!videoFiles || !videoFiles[0]) && !videoUrl) {
            return res.status(400).json({
                message: "Video file or URL is required"
            });
        }

        if (videoFiles && videoFiles[0]) {
            let tempPath = null;

            try {
                const videoFile = videoFiles[0];


                tempPath = path.join(os.tmpdir(), `video-${Date.now()}`);
                await fs.writeFile(tempPath, videoFile.buffer);

                const videoResult = await cloudinary.uploader.upload(tempPath, {
                    resource_type: "video",
                    folder: "lectures/videos",
                });



                videoData = {
                    url: videoResult.secure_url,
                    public_id: videoResult.public_id,
                };
            }
            finally {

                if (tempPath) {
                    await fs.unlink(tempPath).catch(() => { });
                }
            }

        } else if (videoUrl) {
            // 🔥 URL CASE
            videoData = {
                url: videoUrl,
                public_id: null,
            };
        }



        // 🔥 THUMBNAIL
        let thumbnailData = null;

        if (thumbnailFiles?.[0]) {
            let tempPath = null;

            try {
                const thumbFile = thumbnailFiles[0];
                tempPath = path.join(os.tmpdir(), `thumb-${Date.now()}`);
                await fs.writeFile(tempPath, thumbFile.buffer);

                const thumbResult = await cloudinary.uploader.upload(tempPath, {
                    resource_type: "image",
                    folder: "lectures/thumbnails",
                });



                thumbnailData = {
                    url: thumbResult.secure_url,
                    public_id: thumbResult.public_id,
                };
            }
            finally {

                if (tempPath) {
                    await fs.unlink(tempPath).catch(() => { });
                }
            }

        } else if (thumbnailUrl) {
            thumbnailData = {
                url: thumbnailUrl,
                public_id: null,
            };
        }



        // 🔥 MATERIALS
        const materials = [];

        // 🔥 MATERIALS METADATA
        const materialsMeta=null;

        try {

             materialsMeta = JSON.parse(req.body.materialsMeta || "[]");

        } catch {

            const error = new Error(
                "Invalid materials metadata."
            );

            error.statusCode = 400;

            throw error;
        }

        if (req.files?.materials) {
            for (const [index, file] of req.files.materials.entries()) {
                let tempPath = null;

                try {
                    tempPath = path.join(os.tmpdir(), `mat-${Date.now()}`);
                    await fs.writeFile(tempPath, file.buffer);

                    const result = await cloudinary.uploader.upload(tempPath, {
                        folder: "lectures/materials",
                    });



                    materials.push({
                        title: materialsMeta[index]?.title || file.originalname,
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
                finally {

                    if (tempPath) {
                        await fs.unlink(tempPath).catch(() => { });
                    }
                }
            }
        }


        // 🔥 PRACTICE SHEET
        let practiceSheet = null;


        if (req.files?.practiceSheet?.[0]) {
            let tempPath = null;

            try {
                const file = req.files.practiceSheet[0];
                tempPath = path.join(os.tmpdir(), `ps-${Date.now()}`);
                await fs.writeFile(tempPath, file.buffer);

                const result = await cloudinary.uploader.upload(tempPath, {
                    folder: "lectures/practice",
                });



                practiceSheet = {
                    title: practiceSheetTitle || file.originalname,
                    url: result.secure_url,
                    public_id: result.public_id,
                };
            }
            finally {

                if (tempPath) {
                    await fs.unlink(tempPath).catch(() => { });
                }
            }
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

        return res.status(500).json({ message: err.message });
    }
}