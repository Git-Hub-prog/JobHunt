import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String, 
    },
    website:{
        type:String 
    },
    location:{
        type:String 
    },
    logo:{
        type:String // URL to company logo
    },
    verificationStatus:{
        type:String,
        enum:["unsubmitted", "pending", "verified", "rejected"],
        default:"unsubmitted"
    },
    verification:{
        businessEmail:{type:String},
        registrationNumber:{type:String},
        documentUrl:{type:String},
        documentOriginalName:{type:String},
        submittedAt:{type:Date},
        reviewedAt:{type:Date},
        rejectionReason:{type:String}
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})
export const Company = mongoose.model("Company", companySchema);
