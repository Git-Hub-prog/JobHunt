import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { sendMail } from "../utils/mailer.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const { status, interviewAt } = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        const job = await Job.findById(application.job).populate("company");
        const applicant = await User.findById(application.applicant);
        if (!job || !applicant) {
            return res.status(404).json({
                message: "Related job or applicant not found.",
                success: false,
            });
        }

        // update the status
        application.status = status.toLowerCase();
        if (interviewAt) {
            application.interviewAt = new Date(interviewAt);
            application.reminderSentAt = undefined;
        }
        await application.save();

        const companyName = job.company?.name || "the hiring team";
        const interviewText = application.interviewAt ? ` Interview time: ${application.interviewAt.toLocaleString()}.` : "";

        const notificationHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                <h2>Your application status has been updated</h2>
                <p>Hello ${applicant.fullname},</p>
                <p>Your application for <strong>${job.title}</strong> at <strong>${companyName}</strong> is now <strong>${application.status}</strong>.${interviewText}</p>
                <p>Open JobHunt to review the latest updates.</p>
            </div>
        `;

        if (applicant.profile?.emailNotificationsEnabled !== false) {
            await sendMail({
                to: applicant.email,
                subject: `JobHunt update: ${job.title} application ${application.status}`,
                text: `Your application for ${job.title} at ${companyName} is now ${application.status}.${interviewText}`,
                html: notificationHtml,
            });
        }

        await Notification.create({
            user: applicant._id,
            title: `Application ${application.status}`,
            message: `${job.title} at ${companyName} is now ${application.status}.`,
            link: 'https://mail.google.com/mail/u/0/#inbox',
            type: 'email',
            metadata: {
                jobId: job._id,
                applicationId: application._id,
                interviewAt: application.interviewAt || null,
            },
        });

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

export const sendInterviewReminders = async () => {
    const now = new Date();
    const applications = await Application.find({
        status: "accepted",
        interviewAt: { $ne: null },
        reminderSentAt: null,
    })
        .populate({
            path: "job",
            populate: { path: "company" },
        })
        .populate("applicant");

    for (const application of applications) {
        const applicant = application.applicant;
        const interviewAt = new Date(application.interviewAt);
        const reminderWindow = new Date(interviewAt.getTime() - 2 * 60 * 60 * 1000);
        const reminderHours = applicant?.profile?.reminderBeforeHours ?? 2;
        const reminderTime = new Date(interviewAt.getTime() - reminderHours * 60 * 60 * 1000);
        const lowerBound = new Date(now.getTime() - 60 * 1000);
        const upperBound = new Date(now.getTime() + 60 * 1000);
        const targetTime = reminderHours === 2 ? reminderWindow : reminderTime;

        if (targetTime >= lowerBound && targetTime <= upperBound) {
            const companyName = application.job?.company?.name || "the hiring team";
            if (applicant?.profile?.emailNotificationsEnabled !== false) {
                await sendMail({
                    to: applicant.email,
                    subject: `Reminder: Interview for ${application.job?.title || "your application"}`,
                    text: `Reminder: your interview for ${application.job?.title || "the role"} at ${companyName} is scheduled at ${interviewAt.toLocaleString()}.`,
                    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;"><h2>Interview reminder</h2><p>Your interview for <strong>${application.job?.title || "the role"}</strong> at <strong>${companyName}</strong> is scheduled at <strong>${interviewAt.toLocaleString()}</strong>.</p></div>`,
                });
            }

            await Notification.create({
                user: applicant._id,
                title: `Interview reminder for ${application.job?.title || 'your application'}`,
                message: `Your interview at ${companyName} is scheduled at ${interviewAt.toLocaleString()}.`,
                link: 'https://mail.google.com/mail/u/0/#inbox',
                type: 'reminder',
                metadata: {
                    jobId: application.job?._id,
                    applicationId: application._id,
                    interviewAt,
                },
            });
            application.reminderSentAt = now;
            await application.save();
        }
    }
};