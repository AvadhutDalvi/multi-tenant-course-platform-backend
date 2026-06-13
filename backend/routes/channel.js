const { Router } = require("express");
const ChannelRouter = Router();
const ChannelsListRouter = Router();
const { channelmodel, coursemodel } = require("../db");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const {uploadToCloudinary}=require("../utils/cloudinaryUpload")
const { uploadChannelImages } =require ("../middleware/upload.js");

function slugify(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "channel";
}

async function ensureUniqueSlug(baseSlug) {
    let slug = baseSlug;
    let counter = 1;
    while (await channelmodel.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}




// post /channel - create the channel
ChannelRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("educator"),
  uploadChannelImages, // 👈 multer middleware
  async (req, res) => {
    try {
      // 🔒 Check if channel already exists
      const existing = await channelmodel.findOne({ owner: req.user.id });
      if (existing) {
        return res.status(400).json({
          message: "You already have a channel. Only one channel per educator is allowed."
        });
      }

      // 🧾 Extract body
      const { name, description, slug: bodySlug } = req.body;

      // ✅ Validation
      if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Channel name is required" });
      }

      // 🔗 Slug logic (unchanged)
      const baseSlug =
        bodySlug && typeof bodySlug === "string" && bodySlug.trim()
          ? slugify(bodySlug)
          : slugify(name);

      const slug = await ensureUniqueSlug(baseSlug);

      // 🖼️ Default images
      let logo = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
      let banner = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

      // ☁️ Upload logo (if provided)
      if (req.files?.logo && req.files.logo[0]) {
        const result = await uploadToCloudinary(req.files.logo[0], "channels/logo");
        logo = result.url;
      }

      // ☁️ Upload banner (if provided)
      if (req.files?.banner && req.files.banner[0]) {
        const result = await uploadToCloudinary(req.files.banner[0], "channels/banner");
        banner = result.url;
      }

      // 💾 Create channel
      const channel = await channelmodel.create({
        name: name.trim(),
        slug,
        description:
          description != null ? String(description).trim() : undefined,
        logo,
        banner,
        owner: req.user.id
      });

      // 📤 Response
      res.status(201).json({
        message: "Channel created successfully",
        channel: {
          _id: channel._id,
          name: channel.name,
          slug: channel.slug,
          description: channel.description,
          logo: channel.logo,
          banner: channel.banner,
          owner: channel.owner,
          createdAt: channel.createdAt
        }
      });

    } catch (err) {
      console.error("Create Channel Error:", err);

      res.status(500).json({
        message: err.message || "Failed to create channel"
      });
    }
  }
);

// GET /channel/me – logged-in educator's channel
ChannelRouter.get(
    "/me",
    authMiddleware,
    roleMiddleware("educator"),
    async (req, res) => {
        try {
            const channel = await channelmodel.findOne({ owner: req.user.id }).lean();
            if (!channel) {
                return res.status(404).json({
                    message: "You do not have a channel yet. Create one first."
                });
            }
            res.json({ channel });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Failed to fetch channel"
            });
        }
    }
);

// GET /channel/:slug/courses – courses of that channel (before :slug so it matches first)
ChannelRouter.get(
    "/:slug/courses",
    async (req, res) => {
        try {
            const slug = req.params.slug.trim().toLowerCase();
            const channel = await channelmodel.findOne({ slug }).lean();
            if (!channel) {
                return res.status(404).json({ message: "Channel not found" });
            }
            const courses = await coursemodel
                .find({ channel: channel._id,status: "published"  })
                .lean();
            res.json({ courses });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Failed to fetch courses"
            });
        }
    }
);

// GET /channel/:slug – channel by slug with courses (manual query, no populate)
ChannelRouter.get(
    "/:slug",
    async (req, res) => {
        try {
            const slug = req.params.slug.trim().toLowerCase();
            const channel = await channelmodel.findOne({ slug }).lean();
            if (!channel) {
                return res.status(404).json({ message: "Channel not found" });
            }
            const courses = await coursemodel
                .find({ channel: channel._id ,status: "published" })
                .lean();
            res.json({
                channel: {
                    ...channel,
                    courses
                }
            });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Failed to fetch channel"
            });
        }
    }
);

// GET /channels – list & search channels (mounted at /channels)
ChannelsListRouter.get(
    "/",
    async (req, res) => {
        try {
            const channels = await channelmodel.find({}).lean().select("-__v");
            res.json({ channels });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Failed to fetch channels"
            });
        }
    }
);

// GET /channels/search?q= – search channels by name (public)
ChannelsListRouter.get("/search", async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.json({ channels: [] });
        }

        const channels = await channelmodel.find({
            name: { $regex: q, $options: "i" }
        }).select("name slug description logo");

        res.json({ channels });

    } catch (error) {
        res.status(500).json({
            message: "Error searching channels"
        });
    }
});
module.exports = {
    ChannelRouter,
    ChannelsListRouter
};
