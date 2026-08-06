import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'email',
    },
    read: {
        type: Boolean,
        default: false,
    },
    metadata: {
        type: Object,
        default: {},
    },
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);