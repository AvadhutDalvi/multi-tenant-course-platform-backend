const { coursemodel, channelmodel, lecturemodel } = require("../db");
const { deleteCloudinaryAssets } = require("../utils/deleteCloudinaryAssets");

async function updateLecture(req, res) {
    let lectureSaved = false;
    try {

        const lecture = req.lecture;

        let oldVideo = null;
        let oldThumbnail = null;
        let oldPracticeSheet = null;

        // Update logic 

        if (req.body.title !== undefined) {
            lecture.title = req.body.title;
        }

        if (req.body.description !== undefined) {
            lecture.description = req.body.description;
        }

        if (req.body.duration !== undefined) {
            lecture.duration = req.body.duration;
        }

        if (req.body.order !== undefined) {
            lecture.order = Number(req.body.order);
        }

        if (req.body.status !== undefined) {
            lecture.status = req.body.status;
        }

        // 🔥 Update Video
        if (req.uploadedFiles?.video) {

            oldVideo = lecture.video;

            lecture.video = req.uploadedFiles.video;
        }

        // 🔥 Update Thumbnail
        if (req.uploadedFiles?.thumbnail) {

            oldThumbnail = lecture.thumbnail;

            lecture.thumbnail = req.uploadedFiles.thumbnail;
        }

        // if (req.body.isPreview !== undefined) {
        //     lecture.isPreview = req.body.isPreview === "true";
        // }

        // if (req.body.releaseDate !== undefined) {
        //     lecture.releaseDate = req.body.releaseDate;
        // }

        //-------------------------------Update Materials------------------------------

        function parseJsonField(value, fieldName) {
            try {
                return JSON.parse(value || "[]");
            } catch {
                const error = new Error(`Invalid JSON in ${fieldName}`);
                error.statusCode = 400;
                throw error;
            }
        }

        //1. Delete OLD/removed materials
        const deletedMaterialIds = parseJsonField(
            req.body.deletedMaterialIds,
            "deletedMaterialIds"
        );

        const materialsToDelete = [];

        for (const materialId of deletedMaterialIds) {

            const material = lecture.materials.id(materialId);

            if (!material) continue;

            if (material.public_id) {
                materialsToDelete.push({
                    public_id: material.public_id,
                    resource_type: "raw",
                });
            }

            // Remove from the lecture document (in memory)
            material.deleteOne();
        }

        // Delete Cloudinary assets
        await deleteCloudinaryAssets({
            materials: materialsToDelete,
        });


        //2. update existing materials titles
        const existingMaterials = parseJsonField(
            req.body.existingMaterials,
            "existingMaterials"
        );

        for (const updatedMaterial of existingMaterials) {

            const material = lecture.materials.id(
                updatedMaterial._id
            );

            if (!material) continue;

            material.title = updatedMaterial.title;
        }

        //3. add new maetrials 
        const newMaterials = parseJsonField(
            req.body.newMaterials,
            "newMaterials"
        );

        const uploadedMaterials =
            req.uploadedFiles?.materials || [];

        if (newMaterials.length !== uploadedMaterials.length) {
            const error = new Error(
                "Materials metadata and uploaded files do not match."
            );

            error.statusCode = 400;

            throw error;
        }

        for (let i = 0; i < newMaterials.length; i++) {

            lecture.materials.push({

                title: newMaterials[i].title,

                url: uploadedMaterials[i].url,

                public_id: uploadedMaterials[i].public_id,

            });

        }


        // --------------------------------update PracticeSheet-------------------------------

        // Keep reference to old practice sheet


        if (req.uploadedFiles?.practiceSheet) {

            oldPracticeSheet = lecture.practiceSheet;

            // Replace with newly uploaded practice sheet
            lecture.practiceSheet = req.uploadedFiles.practiceSheet;
        }


        await lecture.save();
        lectureSaved = true;
        //----------------------------delete old assets--------------------------------------
        // Delete old video after successful save
        if (oldVideo?.public_id) {

            await deleteCloudinaryAssets({
                video: oldVideo,
            });

        }

        // Delete old thumbnail after successful save
        if (oldThumbnail?.public_id) {

            await deleteCloudinaryAssets({
                thumbnail: oldThumbnail,
            });

        }



        // Delete old practice sheet after successful save
        if (oldPracticeSheet?.public_id) {

            await deleteCloudinaryAssets({
                practiceSheet: {
                    public_id: oldPracticeSheet.public_id,
                    resource_type: "raw",
                },
            });

        }

        return res.status(200).json({
            message: "Lecture updated successfully",
            lecture,
        });

    } catch (err) {



        if (!lectureSaved && req.uploadedFiles) {

            try {
                await deleteCloudinaryAssets(req.uploadedFiles);
            } catch (rollbackError) {
                console.error("Rollback failed:", rollbackError);
            }

        }



        return res.status(err.statusCode || 500).json({
            message: err.message,
        });

    }
}

module.exports = { updateLecture };