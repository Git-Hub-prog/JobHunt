import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../utils/db.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

dotenv.config();

const recruiterData = {
    fullname: "Aarav Mehta",
    email: "aarav.mehta@jobhunt.dev",
    phoneNumber: 9876543210,
    password: "JobHunt@123",
    role: "recruiter"
};

const seedRows = [
    {
        companyName: "HarborStack Labs",
        location: "Mumbai",
        logo: "https://ui-avatars.com/api/?name=HarborStack+Labs&background=6A38C2&color=fff&bold=true",
        title: "Frontend Developer",
        description: "Build responsive product surfaces for a high-growth web platform.",
        requirements: ["React", "JavaScript", "Tailwind CSS"],
        salary: 30000,
        experienceLevel: 1,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "Monsoon Dev Works",
        location: "Mumbai",
        logo: "https://ui-avatars.com/api/?name=Monsoon+Dev+Works&background=F97316&color=fff&bold=true",
        title: "Backend Developer",
        description: "Ship APIs and service logic for a client operations platform.",
        requirements: ["Node.js", "Express", "MongoDB"],
        salary: 70000,
        experienceLevel: 2,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "Crimson Pixel",
        location: "Mumbai",
        logo: "https://ui-avatars.com/api/?name=Crimson+Pixel&background=EC4899&color=fff&bold=true",
        title: "Full Stack Developer",
        description: "Own user-facing features from UI through database writes.",
        requirements: ["React", "Node.js", "MongoDB"],
        salary: 150000,
        experienceLevel: 3,
        jobType: "Full-time",
        position: 3
    },
    {
        companyName: "Dockline Systems",
        location: "Mumbai",
        logo: "https://ui-avatars.com/api/?name=Dockline+Systems&background=111827&color=fff&bold=true",
        title: "Backend Developer",
        description: "Maintain reliable services for enterprise data workflows.",
        requirements: ["Node.js", "Redis", "MongoDB"],
        salary: 90000,
        experienceLevel: 2,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "Westbay Commerce",
        location: "Mumbai",
        logo: "https://ui-avatars.com/api/?name=Westbay+Commerce&background=0F766E&color=fff&bold=true",
        title: "Full Stack Developer",
        description: "Build ecommerce features across frontend and backend layers.",
        requirements: ["React", "Node.js", "MongoDB"],
        salary: 250000,
        experienceLevel: 4,
        jobType: "Full-time",
        position: 3
    },
    {
        companyName: "Silicon Tide",
        location: "Bangalore",
        logo: "https://ui-avatars.com/api/?name=Silicon+Tide&background=2563EB&color=fff&bold=true",
        title: "Frontend Developer",
        description: "Design polished interfaces for product analytics dashboards.",
        requirements: ["React", "TypeScript", "CSS"],
        salary: 40000,
        experienceLevel: 1,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "BluePeak Studio",
        location: "Bangalore",
        logo: "https://ui-avatars.com/api/?name=BluePeak+Studio&background=F59E0B&color=fff&bold=true",
        title: "Backend Developer",
        description: "Support scalable APIs for a mobile-first product suite.",
        requirements: ["Node.js", "Express", "PostgreSQL"],
        salary: 50000,
        experienceLevel: 2,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "Orbit Nest",
        location: "Bangalore",
        logo: "https://ui-avatars.com/api/?name=Orbit+Nest&background=14B8A6&color=fff&bold=true",
        title: "Backend Developer",
        description: "Work on internal services and deployment integrations.",
        requirements: ["Node.js", "MongoDB", "Docker"],
        salary: 95000,
        experienceLevel: 2,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "GreenLoop Apps",
        location: "Bangalore",
        logo: "https://ui-avatars.com/api/?name=GreenLoop+Apps&background=8B5CF6&color=fff&bold=true",
        title: "Full Stack Developer",
        description: "Own product features from frontend components to APIs.",
        requirements: ["React", "Node.js", "MongoDB"],
        salary: 120000,
        experienceLevel: 3,
        jobType: "Full-time",
        position: 3
    },
    {
        companyName: "NovaFrame Tech",
        location: "Bangalore",
        logo: "https://ui-avatars.com/api/?name=NovaFrame+Tech&background=D946EF&color=fff&bold=true",
        title: "Full Stack Developer",
        description: "Deliver fast, polished features for a modern SaaS product.",
        requirements: ["React", "Node.js", "MongoDB"],
        salary: 350000,
        experienceLevel: 4,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "Deccan Wire",
        location: "Pune",
        logo: "https://ui-avatars.com/api/?name=Deccan+Wire&background=EA580C&color=fff&bold=true",
        title: "Frontend Developer",
        description: "Create clear reporting views and internal product screens.",
        requirements: ["React", "Charts", "Tailwind CSS"],
        salary: 38000,
        experienceLevel: 1,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "PuneGrid",
        location: "Pune",
        logo: "https://ui-avatars.com/api/?name=PuneGrid&background=1D4ED8&color=fff&bold=true",
        title: "Backend Developer",
        description: "Maintain services that power reporting and workflow automation.",
        requirements: ["Node.js", "Express", "MongoDB"],
        salary: 60000,
        experienceLevel: 2,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "Saffron Stack",
        location: "Pune",
        logo: "https://ui-avatars.com/api/?name=Saffron+Stack&background=DC2626&color=fff&bold=true",
        title: "Full Stack Developer",
        description: "Work across UI and service layers on a business product suite.",
        requirements: ["React", "Node.js", "MongoDB"],
        salary: 80000,
        experienceLevel: 2,
        jobType: "Full-time",
        position: 3
    },
    {
        companyName: "Charminar Cloud",
        location: "Hyderabad",
        logo: "https://ui-avatars.com/api/?name=Charminar+Cloud&background=059669&color=fff&bold=true",
        title: "Backend Developer",
        description: "Build and scale APIs for a cloud operations product.",
        requirements: ["Node.js", "AWS", "MongoDB"],
        salary: 45000,
        experienceLevel: 2,
        jobType: "Full-time",
        position: 2
    },
    {
        companyName: "Ramoji Digital",
        location: "Hyderabad",
        logo: "https://ui-avatars.com/api/?name=Ramoji+Digital&background=7C3AED&color=fff&bold=true",
        title: "Full Stack Developer",
        description: "Ship customer-facing features for a digital platform.",
        requirements: ["React", "Node.js", "MongoDB"],
        salary: 220000,
        experienceLevel: 3,
        jobType: "Full-time",
        position: 2
    }
];

const seed = async () => {
    await connectDB();

    await Job.deleteMany({});
    await Company.deleteMany({});

    const hashedPassword = await bcrypt.hash(recruiterData.password, 10);

    const recruiter = await User.findOneAndUpdate(
        { email: recruiterData.email },
        {
            ...recruiterData,
            password: hashedPassword
        },
        { new: true, upsert: true }
    );

    const createdJobs = [];

    for (const row of seedRows) {
        const company = await Company.create({
            name: row.companyName,
            description: `${row.companyName} hires ${row.title.toLowerCase()} talent for ${row.location} teams.`,
            website: `https://${row.companyName.replace(/\s+/g, "").toLowerCase()}.dev`,
            location: row.location,
            logo: row.logo,
            userId: recruiter._id
        });

        const job = await Job.findOneAndUpdate(
            {
                title: row.title,
                company: company._id,
                created_by: recruiter._id
            },
            {
                title: row.title,
                description: row.description,
                requirements: row.requirements,
                salary: row.salary,
                experienceLevel: row.experienceLevel,
                location: row.location,
                jobType: row.jobType,
                position: row.position,
                company: company._id,
                created_by: recruiter._id
            },
            { new: true, upsert: true }
        );

        createdJobs.push(job.title);
    }

    console.log(`Seeded ${createdJobs.length} jobs for ${seedRows.length} companies.`);
    console.log(`Recruiter login: ${recruiterData.email} / ${recruiterData.password}`);
    process.exit(0);
};

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});