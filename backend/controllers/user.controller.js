import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Notification } from "../models/notification.model.js";

const cookieOptions = {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
};

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        
        let profilePhotoUrl = "";
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "image"
            });
            profilePhotoUrl = cloudResponse.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
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
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, cookieOptions).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { ...cookieOptions, maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            bio,
            collegeName,
            branch,
            specialization,
            yearOfStudy,
            currentCgpa,
            backlogInPast,
            currentBacklog,
            skills,
            achievements,
            github,
            linkedin,
            leetcode,
            portfolio,
            emailNotificationsEnabled,
            reminderBeforeHours,
            projects,
        } = req.body;

        const profilePhotoFile = req.files?.profilePhoto?.[0];
        const resumeFile = req.files?.resume?.[0];

        let profilePhotoResponse = null;
        let resumeResponse = null;

        if (profilePhotoFile) {
            const profilePhotoUri = getDataUri(profilePhotoFile);
            profilePhotoResponse = await cloudinary.uploader.upload(profilePhotoUri.content, {
                resource_type: "image"
            });
        }

        if (resumeFile) {
            const resumeUri = getDataUri(resumeFile);
            resumeResponse = await cloudinary.uploader.upload(resumeUri.content, {
                resource_type: "auto"
            });
        }



        const parseList = (value) => {
            if (!value) return [];
            return value
                .split(/[\n,]/)
                .map((item) => item.trim())
                .filter(Boolean);
        };

        const parseNumber = (value) => {
            if (value === undefined || value === null || value === "") return undefined;
            const parsedValue = Number(value);
            return Number.isNaN(parsedValue) ? undefined : parsedValue;
        };

        const parseBoolean = (value) => {
            if (value === true || value === false) return value;
            if (value === "true") return true;
            if (value === "false") return false;
            return undefined;
        };

        const skillsArray = parseList(skills);
        const achievementsArray = parseList(achievements);
        const projectsArray = parseList(projects);
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        user.profile = user.profile || {};
        // updating data
        if(fullname) user.fullname = fullname
        if(email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({
                    message: "Email is already in use by another account.",
                    success: false
                });
            }
            user.email = email;
        }
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(collegeName) user.profile.collegeName = collegeName
        if(branch) user.profile.branch = branch
        if(specialization) user.profile.specialization = specialization
        if(yearOfStudy !== undefined && yearOfStudy !== "") user.profile.yearOfStudy = parseNumber(yearOfStudy)
        if(currentCgpa !== undefined && currentCgpa !== "") user.profile.currentCgpa = parseNumber(currentCgpa)
        if(backlogInPast !== undefined && backlogInPast !== "") user.profile.backlogInPast = parseNumber(backlogInPast)
        if(currentBacklog !== undefined && currentBacklog !== "") user.profile.currentBacklog = parseNumber(currentBacklog)
        if(skills) user.profile.skills = skillsArray
        if(achievements) user.profile.achievements = achievementsArray
        if(projects) user.profile.projects = projectsArray
        if(github) user.profile.github = github
        if(linkedin) user.profile.linkedin = linkedin
        if(leetcode) user.profile.leetcode = leetcode
        if(portfolio) user.profile.portfolio = portfolio
        const parsedEmailNotificationsEnabled = parseBoolean(emailNotificationsEnabled);
        if (parsedEmailNotificationsEnabled !== undefined) user.profile.emailNotificationsEnabled = parsedEmailNotificationsEnabled;
        if (reminderBeforeHours !== undefined && reminderBeforeHours !== "") user.profile.reminderBeforeHours = parseNumber(reminderBeforeHours);
      
        if (profilePhotoResponse) {
            user.profile.profilePhoto = profilePhotoResponse.secure_url;
        }

        if (resumeResponse) {
            user.profile.resume = resumeResponse.secure_url; // save the cloudinary url
            user.profile.resumeOriginalName = resumeFile.originalname; // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        return res.status(200).json({
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message,
        });
    }
}

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.id })
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await Notification.countDocuments({ user: req.id, read: false });

        return res.status(200).json({
            notifications,
            unreadCount,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message,
        });
    }
}

export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found.",
                success: false,
            });
        }

        return res.status(200).json({
            notification,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message,
        });
    }
}

export const markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.id, read: false }, { read: true });
        return res.status(200).json({
            message: "Notifications cleared.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message,
        });
    }
}

export const toggleSaveJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        const isSaved = user.profile.savedJobs.includes(jobId);
        
        if (isSaved) {
            // Unsave
            user.profile.savedJobs = user.profile.savedJobs.filter(id => id.toString() !== jobId);
        } else {
            // Save
            user.profile.savedJobs.push(jobId);
        }

        await user.save();

        return res.status(200).json({
            message: isSaved ? "Job removed from saved jobs" : "Job saved successfully",
            success: true,
            savedJobs: user.profile.savedJobs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message,
        });
    }
}