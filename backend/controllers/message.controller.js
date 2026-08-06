import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Message content is required.",
                success: false
            });
        }

        const newMessage = await Message.create({
            sender: senderId,
            content
        });

        // Populate sender info before returning
        const populatedMessage = await Message.findById(newMessage._id).populate({
            path: "sender",
            select: "fullname profile.profilePhoto role"
        });

        return res.status(201).json({
            message: "Message sent successfully.",
            success: true,
            newMessage: populatedMessage
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .sort({ createdAt: 1 })
            .populate({
                path: "sender",
                select: "fullname profile.profilePhoto role"
            });

        return res.status(200).json({
            messages,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
}
