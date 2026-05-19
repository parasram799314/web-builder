// src/controllers/uploadController.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

/**
 * POST /api/upload/logo
 * Protected - upload a logo image to Cloudinary
 * Returns the public download URL
 */
async function uploadLogo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Use a Promise to handle the stream upload
    const uploadStream = () => {
      console.log("Starting Cloudinary stream upload for user:", req.user.uid);
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `logos/${req.user.uid}`,
            public_id: `logo_${Date.now()}`,
            resource_type: "auto",
            timeout: 60000, // 60 seconds timeout
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary callback error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result.secure_url);
              resolve(result);
            }
          }
        );

        stream.on("error", (err) => {
          console.error("Stream error:", err);
          reject(err);
        });

        stream.end(req.file.buffer);
      });
    };

    const result = await uploadStream();

    return res.json({ 
      success: true, 
      url: result.secure_url 
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ error: "Failed to upload logo to Cloudinary" });
  }
}

module.exports = { upload, uploadLogo };
