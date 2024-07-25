// controllers/noticeController.js
import { Notice } from '../models/notice.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllNotices = async (req, res) => {
    const notices = await Notice.findActive().populate('postedBy', 'name');
    return res
        .status(200)
        .json(new ApiResponse(200, notices, "Notices retrieved successfully"));
};

export const getNoticeById = async (req, res) => {
    const notice = await Notice.findById(req.params.id).populate('postedBy', 'name');
    if (!notice) {
        throw new ApiError(404, "Notice not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notice, "Notice retrieved successfully"));
};

export const createNotice = async (req, res) => {
    // Check if the user is an admin
    if (!req.admin) {
        throw new ApiError(403, "Only admins can create notices");
    }

    const { title, content, category, attachments } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const newNotice = new Notice({
        title,
        content,
        category,
        attachments,
        postedBy: req.admin._id
    });

    await newNotice.save();

    return res
        .status(201)
        .json(new ApiResponse(201, newNotice, "Notice created successfully"));
};

export const updateNotice = async (req, res) => {
    // Check if the user is an admin
    if (!req.admin) {
        throw new ApiError(403, "Only admins can update notices");
    }

    const { title, content, category, attachments, isActive } = req.body;

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
        throw new ApiError(404, "Notice not found");
    }

    if (title) notice.title = title;
    if (content) notice.content = content;
    if (category) notice.category = category;
    if (attachments) notice.attachments = attachments;
    if (isActive !== undefined) notice.isActive = isActive;

    await notice.save();

    return res
        .status(200)
        .json(new ApiResponse(200, notice, "Notice updated successfully"));
};

export const deleteNotice = async (req, res) => {
    // Check if the user is an admin
    if (!req.admin) {
        throw new ApiError(403, "Only admins can delete notices");
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
        throw new ApiError(404, "Notice not found");
    }

    await Notice.findByIdAndDelete(req.params.id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Notice deleted successfully"));
};

export const getRecentNotices = async (req, res) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentNotices = await Notice.find({
        datePosted: { $gte: oneWeekAgo },
        isActive: true
    }).sort({ datePosted: -1 }).populate('postedBy', 'name');

    return res
        .status(200)
        .json(new ApiResponse(200, recentNotices, "Recent notices retrieved successfully"));
};

export const getNoticesByCategory = async (req, res) => {
    const { category } = req.params;

    const notices = await Notice.find({
        category,
        isActive: true
    }).sort({ datePosted: -1 }).populate('postedBy', 'name');

    return res
        .status(200)
        .json(new ApiResponse(200, notices, `Notices in category ${category} retrieved successfully`));
};