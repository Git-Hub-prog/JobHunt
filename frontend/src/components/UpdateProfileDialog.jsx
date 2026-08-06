import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        collegeName: user?.profile?.collegeName || "",
        branch: user?.profile?.branch || "",
        specialization: user?.profile?.specialization || "",
        yearOfStudy: user?.profile?.yearOfStudy || "",
        currentCgpa: user?.profile?.currentCgpa || "",
        backlogInPast: user?.profile?.backlogInPast ?? 0,
        currentBacklog: user?.profile?.currentBacklog ?? 0,
        skills: user?.profile?.skills?.join(", ") || "",
        achievements: user?.profile?.achievements?.join(", ") || "",
        projects: user?.profile?.projects?.join(", ") || "",
        github: user?.profile?.github || "",
        linkedin: user?.profile?.linkedin || "",
        leetcode: user?.profile?.leetcode || "",
        portfolio: user?.profile?.portfolio || "",
        profilePhoto: null,
        resume: null
    });
    const dispatch = useDispatch();

    useEffect(() => {
        setInput({
            fullname: user?.fullname || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            bio: user?.profile?.bio || "",
            collegeName: user?.profile?.collegeName || "",
            branch: user?.profile?.branch || "",
            specialization: user?.profile?.specialization || "",
            yearOfStudy: user?.profile?.yearOfStudy || "",
            currentCgpa: user?.profile?.currentCgpa || "",
            backlogInPast: user?.profile?.backlogInPast ?? 0,
            currentBacklog: user?.profile?.currentBacklog ?? 0,
            skills: user?.profile?.skills?.join(", ") || "",
            achievements: user?.profile?.achievements?.join(", ") || "",
            projects: user?.profile?.projects?.join(", ") || "",
            github: user?.profile?.github || "",
            linkedin: user?.profile?.linkedin || "",
            leetcode: user?.profile?.leetcode || "",
            portfolio: user?.profile?.portfolio || "",
            profilePhoto: null,
            resume: null
        });
    }, [user, open]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const profilePhotoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, profilePhoto: file })
    }

    const resumeChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, resume: file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("collegeName", input.collegeName);
        formData.append("branch", input.branch);
        formData.append("specialization", input.specialization);
        formData.append("yearOfStudy", input.yearOfStudy);
        formData.append("currentCgpa", input.currentCgpa);
        formData.append("backlogInPast", input.backlogInPast);
        formData.append("currentBacklog", input.currentBacklog);
        formData.append("skills", input.skills);
        formData.append("achievements", input.achievements);
        formData.append("projects", input.projects);
        formData.append("github", input.github);
        formData.append("linkedin", input.linkedin);
        formData.append("leetcode", input.leetcode);
        formData.append("portfolio", input.portfolio);
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        if (input.resume) {
            formData.append("resume", input.resume);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
        setOpen(false);
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-6 py-4'>
                            <div className='space-y-3'>
                                <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-500'>Basic Information</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input id="name" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="number" className="text-right">Number</Label>
                                        <Input id="number" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="bio" className="text-right">Bio</Label>
                                        <textarea id="bio" name="bio" value={input.bio} onChange={changeEventHandler} className="col-span-3 min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Short professional summary" />
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-500'>Academic Profile</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="collegeName" className="text-right">College</Label>
                                        <Input id="collegeName" name="collegeName" value={input.collegeName} onChange={changeEventHandler} className="col-span-3" placeholder="Your college name" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="branch" className="text-right">Branch</Label>
                                        <Input id="branch" name="branch" value={input.branch} onChange={changeEventHandler} className="col-span-3" placeholder="CSE / IT / ECE" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="specialization" className="text-right">Specialization</Label>
                                        <Input id="specialization" name="specialization" value={input.specialization} onChange={changeEventHandler} className="col-span-3" placeholder="Full Stack, AI/ML, Data Science" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="yearOfStudy" className="text-right">Year</Label>
                                        <Input id="yearOfStudy" name="yearOfStudy" type="number" min="1" max="5" value={input.yearOfStudy} onChange={changeEventHandler} className="col-span-3" placeholder="4" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="currentCgpa" className="text-right">CGPA</Label>
                                        <Input id="currentCgpa" name="currentCgpa" type="number" min="0" max="10" step="0.01" value={input.currentCgpa} onChange={changeEventHandler} className="col-span-3" placeholder="8.4" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="backlogInPast" className="text-right">Past Backlogs</Label>
                                        <Input id="backlogInPast" name="backlogInPast" type="number" min="0" value={input.backlogInPast} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="currentBacklog" className="text-right">Current Backlogs</Label>
                                        <Input id="currentBacklog" name="currentBacklog" type="number" min="0" value={input.currentBacklog} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-500'>Career Profile</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='grid grid-cols-4 items-center gap-4 md:col-span-2'>
                                        <Label htmlFor="skills" className="text-right">Skills</Label>
                                        <Input id="skills" name="skills" value={input.skills} onChange={changeEventHandler} className="col-span-3" placeholder="React, Node.js, MongoDB, DSA" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4 md:col-span-2'>
                                        <Label htmlFor="achievements" className="text-right">Achievements</Label>
                                        <textarea id="achievements" name="achievements" value={input.achievements} onChange={changeEventHandler} className="col-span-3 min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Hackathon wins, certifications, ranks - separate by comma or new line" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4 md:col-span-2'>
                                        <Label htmlFor="projects" className="text-right">Projects</Label>
                                        <textarea id="projects" name="projects" value={input.projects} onChange={changeEventHandler} className="col-span-3 min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Project names or short descriptions - separate by comma or new line" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="github" className="text-right">GitHub</Label>
                                        <Input id="github" name="github" value={input.github} onChange={changeEventHandler} className="col-span-3" placeholder="https://github.com/username" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="linkedin" className="text-right">LinkedIn</Label>
                                        <Input id="linkedin" name="linkedin" value={input.linkedin} onChange={changeEventHandler} className="col-span-3" placeholder="https://linkedin.com/in/username" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="leetcode" className="text-right">LeetCode</Label>
                                        <Input id="leetcode" name="leetcode" value={input.leetcode} onChange={changeEventHandler} className="col-span-3" placeholder="https://leetcode.com/username" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="portfolio" className="text-right">Portfolio</Label>
                                        <Input id="portfolio" name="portfolio" value={input.portfolio} onChange={changeEventHandler} className="col-span-3" placeholder="https://your-portfolio.com" />
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-500'>Documents</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="profilePhoto" className="text-right">Profile Photo</Label>
                                        <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={profilePhotoChangeHandler} className="col-span-3" />
                                    </div>
                                    {user?.role === 'student' && (
                                        <div className='grid grid-cols-4 items-center gap-4'>
                                            <Label htmlFor="file" className="text-right">Resume</Label>
                                            <Input id="file" name="resume" type="file" accept="application/pdf" onChange={resumeChangeHandler} className="col-span-3" />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                        <DialogFooter>
                            {loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog