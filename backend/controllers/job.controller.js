import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

const salaryFilterMap = {
    "0-40k": { $lte: 40000 },
    "40k-1lakh": { $gt: 40000, $lte: 100000 },
    "42-1lakh": { $gt: 40000, $lte: 100000 },
    "1lakh to 5lakh": { $gte: 100000, $lte: 500000 },
};

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary,
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create job.",
            success: false,
            error: error.message
        });
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = (req.query.keyword || "").trim();
        const normalizedKeyword = keyword.toLowerCase();

        let query = {};

        if (salaryFilterMap[normalizedKeyword]) {
            query = {
                salary: salaryFilterMap[normalizedKeyword]
            };
        } else if (keyword) {
            const matchedCompanies = await Company.find({
                name: { $regex: keyword, $options: "i" }
            }).select("_id");

            query = {
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { location: { $regex: keyword, $options: "i" } },
                    { jobType: { $regex: keyword, $options: "i" } },
                    ...(matchedCompanies.length > 0 ? [{ company: { $in: matchedCompanies.map((company) => company._id) } }] : []),
                ]
            };
        }

        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
