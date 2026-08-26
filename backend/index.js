import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import cron from "node-cron";
import path from "path";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import messageRoute from "./routes/message.route.js";
import { sendInterviewReminders } from "./controllers/application.controller.js";

// Load environment variables
dotenv.config();

// Use Cloudflare and Google DNS for MongoDB Atlas SRV lookup
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const _dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(_dirname, "../frontend/dist")));
app.get('*', (req,res)=>{
    res.sendFile(path.resolve(_dirname, "../frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, async () => {
    await connectDB();
    cron.schedule("* * * * *", async () => {
        try {
            await sendInterviewReminders();
        } catch (error) {
            console.log("Interview reminder job failed", error);
        }
    });
    console.log(`Server running at port ${PORT}`);
});
