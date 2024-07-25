// models/notice.model.js
import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    attachments: [{
        type: String,  // URL or path to the attachment
        trim: true
    }],
    category: {
        type: String,
        enum: ['General', 'Important', 'Urgent', 'Event'],
        default: 'General'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
noticeSchema.index({ datePosted: -1 });
noticeSchema.index({ category: 1 });

// Virtual for formatted date
noticeSchema.virtual('formattedDate').get(function () {
    return this.datePosted.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Method to check if the notice is recent (within last 7 days)
noticeSchema.methods.isRecent = function () {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.datePosted >= oneWeekAgo;
};

// Static method to find active notices
noticeSchema.statics.findActive = function () {
    return this.find({ isActive: true }).sort({ datePosted: -1 });
};

export const Notice = mongoose.model("Notice", noticeSchema);