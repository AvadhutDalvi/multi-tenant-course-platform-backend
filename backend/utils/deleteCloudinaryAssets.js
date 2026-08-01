import cloudinary from "../cloudinary.js";

async function safeDestroy(publicId, options = {}) {

    if (!publicId) return;

    try {

        await cloudinary.uploader.destroy(publicId, options);
    }
    catch (err) {

        console.error(
            `Failed to delete Cloudinary asset: ${publicId}`,
            err
        );
    }
}

export async function deleteCloudinaryAssets(uploadedFiles) {

    const {
        video,
        thumbnail,
        materials,
        practiceSheet,
    } = uploadedFiles || {};

    //delete video
    await safeDestroy(video?.public_id, {
        resource_type: "video",
    });

    //delete thumbnail
    await safeDestroy(thumbnail?.public_id);

    //delete materials
    for (const material of materials || []) {
        await safeDestroy(material?.public_id, {
            resource_type: material.resource_type || "raw",
        });
    }

    //delete pratice
    await safeDestroy(practiceSheet?.public_id, {
        resource_type: "raw",
    });

}

