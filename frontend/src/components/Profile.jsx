import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Link } from 'react-router-dom'
import { BriefcaseBusiness, Contact, GraduationCap, Link as LinkIcon, Mail, Pen, School, Sparkles, SquareCode } from 'lucide-react'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const profileCompletion = (() => {
        if (!user?.profile) return 0;

        const checks = [
            user.fullname,
            user.email,
            user.phoneNumber,
            user.profile.profilePhoto,
            user.profile.bio,
            user.profile.collegeName,
            user.profile.branch,
            user.profile.specialization,
            user.profile.yearOfStudy,
            user.profile.currentCgpa,
            user.profile.skills?.length,
            user.profile.projects?.length,
            user.profile.achievements?.length,
            user.profile.github,
            user.profile.linkedin,
            user.profile.leetcode,
            user.profile.portfolio,
            user.profile.resume,
        ];

        const filled = checks.filter(Boolean).length;
        return Math.round((filled / checks.length) * 100);
    })();

    return (
        <div>
            <Navbar />
            <div className='max-w-5xl mx-auto my-5 p-4 md:p-0'>
                <div className='bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm'>
                    <div className='flex flex-col md:flex-row md:justify-between gap-6'>
                        <div className='flex items-start gap-4'>
                            <Avatar className="h-24 w-24 ring-2 ring-gray-100 shadow-sm">
                                <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                <AvatarFallback className="bg-[#6A38C2] text-white text-2xl font-semibold">
                                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className='space-y-2'>
                                <div>
                                    <h1 className='font-semibold text-2xl'>{user?.fullname}</h1>
                                    <p className='text-gray-600'>{user?.profile?.bio || 'Add a short professional summary'}</p>
                                </div>
                                <div className='flex flex-wrap gap-2 text-xs text-gray-500'>
                                    {user?.profile?.branch && <Badge variant="outline">{user.profile.branch}</Badge>}
                                    {user?.profile?.specialization && <Badge variant="outline">{user.profile.specialization}</Badge>}
                                    {user?.profile?.yearOfStudy && <Badge variant="outline">Year {user.profile.yearOfStudy}</Badge>}
                                    {user?.profile?.currentCgpa && <Badge variant="outline">CGPA {user.profile.currentCgpa}</Badge>}
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} className="self-start" variant="outline"><Pen className='mr-2 h-4 w-4' /> Edit Profile</Button>
                    </div>

                    <div className='mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4'>
                        <div className='flex items-center justify-between mb-2'>
                            <h2 className='font-semibold'>Profile Completion</h2>
                            <span className='text-sm font-medium text-[#6A38C2]'>{profileCompletion}%</span>
                        </div>
                        <div className='h-2 rounded-full bg-gray-200 overflow-hidden'>
                            <div className='h-full rounded-full bg-gradient-to-r from-[#6A38C2] to-[#F83002]' style={{ width: `${profileCompletion}%` }} />
                        </div>
                        <p className='mt-2 text-xs text-gray-500'>Complete your academic and career fields to increase recruiter trust and job matching quality.</p>
                    </div>

                    <div className='mt-8 grid gap-4 md:grid-cols-2'>
                        <div className='rounded-xl border border-gray-100 p-4'>
                            <h2 className='flex items-center gap-2 font-semibold mb-3'><GraduationCap className='h-4 w-4' /> Academic Snapshot</h2>
                            <div className='space-y-2 text-sm text-gray-700'>
                                <div className='flex gap-2'><School className='h-4 w-4 mt-0.5 text-gray-500' /><span>{user?.profile?.collegeName || 'College not added'}</span></div>
                                <div className='flex gap-2'><BriefcaseBusiness className='h-4 w-4 mt-0.5 text-gray-500' /><span>{user?.profile?.branch || 'Branch not added'}</span></div>
                                <div className='flex gap-2'><SquareCode className='h-4 w-4 mt-0.5 text-gray-500' /><span>{user?.profile?.specialization || 'Specialization not added'}</span></div>
                                <div className='flex gap-2'><Sparkles className='h-4 w-4 mt-0.5 text-gray-500' /><span>{user?.profile?.yearOfStudy ? `Year ${user.profile.yearOfStudy}` : 'Year not added'}</span></div>
                                <div className='flex gap-2'><Sparkles className='h-4 w-4 mt-0.5 text-gray-500' /><span>{user?.profile?.currentCgpa ? `CGPA ${user.profile.currentCgpa}` : 'CGPA not added'}</span></div>
                                <div className='flex gap-2'><Contact className='h-4 w-4 mt-0.5 text-gray-500' /><span>Past backlogs: {user?.profile?.backlogInPast ?? 0} | Active backlogs: {user?.profile?.currentBacklog ?? 0}</span></div>
                            </div>
                        </div>

                        <div className='rounded-xl border border-gray-100 p-4'>
                            <h2 className='flex items-center gap-2 font-semibold mb-3'><LinkIcon className='h-4 w-4' /> Contact & Links</h2>
                            <div className='space-y-2 text-sm text-gray-700'>
                                <div className='flex items-center gap-3'><Mail className='h-4 w-4 text-gray-500' /><span>{user?.email}</span></div>
                                <div className='flex items-center gap-3'><Contact className='h-4 w-4 text-gray-500' /><span>{user?.phoneNumber}</span></div>
                                <div className='flex items-center gap-3'><LinkIcon className='h-4 w-4 text-gray-500' /><span>{user?.profile?.github || 'GitHub not added'}</span></div>
                                <div className='flex items-center gap-3'><LinkIcon className='h-4 w-4 text-gray-500' /><span>{user?.profile?.linkedin || 'LinkedIn not added'}</span></div>
                                <div className='flex items-center gap-3'><LinkIcon className='h-4 w-4 text-gray-500' /><span>{user?.profile?.leetcode || 'LeetCode not added'}</span></div>
                                <div className='flex items-center gap-3'><LinkIcon className='h-4 w-4 text-gray-500' /><span>{user?.profile?.portfolio || 'Portfolio not added'}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 grid gap-6 md:grid-cols-2'>
                        <div>
                            <h2 className='font-semibold mb-3'>Skills</h2>
                            <div className='flex flex-wrap gap-2'>
                                {user?.profile?.skills?.length ? user.profile.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span className='text-sm text-gray-500'>NA</span>}
                            </div>
                        </div>
                        <div>
                            <h2 className='font-semibold mb-3'>Achievements</h2>
                            <div className='flex flex-wrap gap-2'>
                                {user?.profile?.achievements?.length ? user.profile.achievements.map((item, index) => <Badge key={index} variant="outline">{item}</Badge>) : <span className='text-sm text-gray-500'>NA</span>}
                            </div>
                        </div>
                        <div>
                            <h2 className='font-semibold mb-3'>Projects</h2>
                            <div className='flex flex-wrap gap-2'>
                                {user?.profile?.projects?.length ? user.profile.projects.map((item, index) => <Badge key={index} variant="secondary">{item}</Badge>) : <span className='text-sm text-gray-500'>NA</span>}
                            </div>
                        </div>
                        <div className='grid w-full gap-1.5'>
                            <Label className="text-md font-bold">Resume</Label>
                            {user?.profile?.resume ? <a target='blank' rel='noreferrer' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>}
                        </div>
                    </div>
                </div>

                {user?.role === 'recruiter' && (
                    <div className='max-w-4xl mx-auto bg-white rounded-2xl p-8 mb-5 border border-gray-200 mt-6'>
                        <h1 className='font-bold text-lg mb-5'>Recruiter Actions</h1>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='border p-5 rounded-xl shadow-sm'>
                                <h2 className='font-semibold mb-2'>Manage Companies</h2>
                                <p className='text-sm text-gray-500 mb-4'>View and update the companies you have registered.</p>
                                <Button asChild variant='outline' className='w-full'><Link to="/admin/companies">Open Companies</Link></Button>
                            </div>
                            <div className='border p-5 rounded-xl shadow-sm'>
                                <h2 className='font-semibold mb-2'>Manage Jobs</h2>
                                <p className='text-sm text-gray-500 mb-4'>Review applications and post new job openings.</p>
                                <Button asChild variant='outline' className='w-full'><Link to="/admin/jobs">Open Jobs</Link></Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
