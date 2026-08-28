JobHunt – MERN Job Portal

A full-stack job portal built using the MERN stack that connects job seekers and recruiters. 
Job seekers can create profiles, upload resumes, search and apply for jobs, while recruiters can manage companies, post jobs, review applicants, and update application statuses.

🚀 Features
👨‍💻 Job Seeker
Create and update a personal profile
Add skills and bio
Upload resume and profile image
Search and filter available jobs
View detailed job information
Apply for jobs
Track application status
Save jobs

🏢 Recruiter
Register and manage companies
Create and manage job postings
View applicants for posted jobs
Review applicant resumes
Update application status
Manage company information
Company verification workflow

🔐 Authentication & Security
JWT-based authentication
HTTP-only cookies for storing authentication tokens
Password hashing using bcryptjs
Role-based authorization
Protected frontend routes
Protected backend APIs

📁 File Management
Multer for handling file uploads
Cloudinary for resume and profile-image storage
Only file URLs are stored in MongoDB

⚙️ Automation
Node-cron for background tasks
Nodemailer for interview reminder emails
Automated reminders based on application status

🛠️ Tech Stack
Frontend
React.js
Vite
Redux Toolkit
Tailwind CSS
Shadcn UI
Axios

Backend
Node.js
Express.js
REST APIs
JWT
bcryptjs
Multer
Node-cron
Nodemailer

Database
MongoDB
Mongoose
Cloud & Deployment

Cloudinary
Render

The project uses React/Vite/Redux Toolkit on the frontend, Node.js/Express.js on the backend, 
MongoDB/Mongoose for data, and Cloudinary/Multer/Node-cron as supporting services.

🏗️ Project Architecture

The application follows a Client-Server Architecture with an MVC pattern on the backend.

                  ┌──────────────────────┐
                  │      React.js        │
                  │     Frontend         │
                  │ Redux Toolkit + UI   │
                  └──────────┬───────────┘
                             │
                          Axios
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Express.js API    │
                  │       Routes         │
                  └──────────┬───────────┘
                             │
                         Middleware
                             │
                             ▼
                  ┌──────────────────────┐
                  │     Controllers      │
                  │   Business Logic     │
                  └──────────┬───────────┘
                             │
                         Mongoose
                             │
                             ▼
                  ┌──────────────────────┐
                  │      MongoDB         │
                  │      Database        │
                  └──────────────────────┘

       Cloudinary ◄──── File Uploads
       Node-cron  ────► Background Tasks
       Nodemailer ────► Email Reminders


🔄 Application Flow
User opens the React application.
User registers or logs in.
Backend validates the credentials.
JWT is generated and stored in an HTTP-only cookie.
Protected APIs verify the JWT before processing requests.
Job seekers can search and apply for jobs.
Recruiters can create jobs and view applicants.
Application information is stored in MongoDB.
Redux Toolkit updates the frontend state.
Background jobs can send interview reminders automatically.
Node-cron for background tasks
Nodemailer for interview reminder emails
Automated reminders based on application status

📊 Database Structure

The main database collections are:

User

Stores:

Full name
Email
Password
Role
Profile information
Resume information

Company

Stores:

Company name
Logo
Location
Recruiter reference

Job

Stores:

Job title
Description
Salary
Requirements
Company reference
Recruiter reference

Application

Stores:

Job reference
Applicant reference
Application status

🔌 REST API

The project contains 25 REST API endpoints divided into five main groups:

Module	APIs
User	9
Company	6
Job	4
Application	4
Message	2
Total 25

🔒 Security

The application uses multiple security mechanisms:

Password hashing with bcryptjs
JWT authentication
HTTP-only cookies
Authentication middleware
Role-based route protection
Environment variables for sensitive credentials

📂 File Upload Flow
React Form
    │
    ▼
Multipart/Form Data
    │
    ▼
Multer
    │
    ▼
File Processing
    │
    ▼
Cloudinary
    │
    ▼
Secure File URL
    │
    ▼
MongoDB

🧪 API Testing

APIs were tested using:

Postman
Thunder Client

⚠️ Error Handling

The backend uses try-catch blocks to handle errors and return appropriate HTTP responses.

Common status codes:

Code	Meaning
200	Successful request
201	Resource created
400	Bad request
401	Unauthorized
404	Resource not found
500	Server error

🌐 Deployment

The application is deployed using Render. The backend can serve the compiled React frontend as a unified web service. 
Environment variables such as MongoDB credentials, JWT secret, and Cloudinary credentials are configured through the deployment environment.
