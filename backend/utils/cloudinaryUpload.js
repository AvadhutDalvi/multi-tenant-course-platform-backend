import cloudinary from "../cloudinary.js";

/**
 * Upload a single file (image/video) from multer memory buffer to Cloudinary
 */
export const uploadToCloudinary = async (file, folder = "general") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Convert buffer → base64
    const b64 = Buffer.from(file.buffer).toString("base64");

    // Create data URI
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: "auto", // handles image/video automatically
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};
