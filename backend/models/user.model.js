import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        collegeName:{type:String},
        branch:{type:String},
        specialization:{type:String},
        yearOfStudy:{type:Number},
        currentCgpa:{type:Number},
        backlogInPast:{type:Number, default:0},
        currentBacklog:{type:Number, default:0},
        achievements:[{type:String}],
        skills:[{type:String}],
        projects:[{type:String}],
        github:{type:String},
        linkedin:{type:String},
        leetcode:{type:String},
        portfolio:{type:String},
        emailNotificationsEnabled:{type:Boolean, default:true},
        reminderBeforeHours:{type:Number, default:2},
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        },
        savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
    },
},{timestamps:true});
export const User = mongoose.model('User', userSchema);