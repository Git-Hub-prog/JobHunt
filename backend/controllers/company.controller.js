import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;
        let logoResponse = null;

        if (file) {
            const logoUri = getDataUri(file);
            logoResponse = await cloudinary.uploader.upload(logoUri.content, {
                resource_type: "image"
            });
        }

        const updateData = {
            name,
            description,
            website,
            location,
            ...(logoResponse && { logo: logoResponse.secure_url })
        };

        const company = await Company.findOneAndUpdate(
            { _id: req.params.id, userId: req.id },
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const submitCompanyVerification = async (req, res) => {
    try {
        const { businessEmail, registrationNumber } = req.body;
        const file = req.file;

        if (!businessEmail || !registrationNumber || !file) {
            return res.status(400).json({
                message: "Business email, registration number, and verification document are required.",
                success: false
            });
        }

        const company = await Company.findOne({ _id: req.params.id, userId: req.id });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        const documentUri = getDataUri(file);
        const documentResponse = await cloudinary.uploader.upload(documentUri.content, {
            resource_type: "auto"
        });

        company.verificationStatus = "pending";
        company.verification = {
            businessEmail,
            registrationNumber,
            documentUrl: documentResponse.secure_url,
            documentOriginalName: file.originalname,
            submittedAt: new Date(),
            reviewedAt: undefined,
            rejectionReason: ""
        };

        await company.save();

        return res.status(200).json({
            message: "Company verification submitted for review.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const reviewCompanyVerification = async (req, res) => {
    try {
        const { status, rejectionReason = "" } = req.body;

        if (!["verified", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Verification status must be verified or rejected.",
                success: false
            });
        }

        const reviewer = await User.findById(req.id);

        if (!reviewer || reviewer.role !== "admin") {
            return res.status(403).json({
                message: "Only admins can review company verification.",
                success: false
            });
        }

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        if (company.verificationStatus !== "pending") {
            return res.status(400).json({
                message: "Only pending verification requests can be reviewed.",
                success: false
            });
        }

        company.verificationStatus = status;
        company.verification.reviewedAt = new Date();
        company.verification.rejectionReason = status === "rejected" ? rejectionReason : "";

        await company.save();

        return res.status(200).json({
            message: `Company verification ${status}.`,
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
