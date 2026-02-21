const { Router } = require("express");
const ChannelRouter = Router();
const ChannelsListRouter = Router();
const { channelmodel, coursemodel } = require("../db");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");

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

// POST /channel – create channel (educator only, one per educator)
ChannelRouter.post(
    "/",
    authMiddleware,
    roleMiddleware("educator"),
    async (req, res) => {
        try {
            const existing = await channelmodel.findOne({ owner: req.user.id });
            if (existing) {
                return res.status(400).json({
                    message: "You already have a channel. Only one channel per educator is allowed."
                });
            }

            const { name, description, logo, slug: bodySlug } = req.body;
            if (!name || typeof name !== "string" || !name.trim()) {
                return res.status(400).json({ message: "Channel name is required" });
            }

            const baseSlug = bodySlug && typeof bodySlug === "string" && bodySlug.trim()
                ? slugify(bodySlug)
                : slugify(name);
            const slug = await ensureUniqueSlug(baseSlug);

            const channel = await channelmodel.create({
                name: name.trim(),
                slug,
                description: description != null ? String(description).trim() : undefined,
                logo: logo != null ? String(logo).trim() : undefined,
                owner: req.user.id
            });

            res.status(201).json({
                message: "Channel created successfully",
                channel: {
                    _id: channel._id,
                    name: channel.name,
                    slug: channel.slug,
                    description: channel.description,
                    logo: channel.logo,
                    owner: channel.owner,
                    createdAt: channel.createdAt
                }
            });
        } catch (err) {
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
                .find({ channel: channel._id })
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
                .find({ channel: channel._id })
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

// GET /channels – list all channels (mount this router at /channels)
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

module.exports = {
    ChannelRouter,
    ChannelsListRouter
};
