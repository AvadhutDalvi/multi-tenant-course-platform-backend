const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });



const cloudinary = require("./cloudinary");

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );

    console.log("Upload Success:", result.secure_url);
  } catch (err) {
    console.error("Upload Failed:", err);
  }
}

testUpload();