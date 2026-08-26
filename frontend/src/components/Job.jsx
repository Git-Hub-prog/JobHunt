import React from 'react'
import { Button } from './ui/button'
import { Bookmark, ShieldCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { formatSalaryInLPA } from '@/utils/formatSalary'
import { useDispatch } from 'react-redux'
import { toggleSavedJob } from '@/redux/jobSlice'
import { toast } from 'sonner'

import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'

const Job = ({ job, isSaved = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const saveHandler = async () => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/save-job/${job?._id}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(toggleSavedJob(job?._id));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    }

    const daysAgo = daysAgoFunction(job?.createdAt);
    const companyInitial = job?.company?.name?.charAt(0)?.toUpperCase() || 'J';
    const isCompanyVerified = job?.company?.verificationStatus === "verified";

    return (
        <div className='flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#6A38C2]/30 hover:shadow-lg'>
            <div className='flex items-center justify-between gap-3'>
                <p className='text-sm text-gray-500'>{daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}</p>
                <Button
                    type='button'
                    variant='outline'
                    className={`rounded-full ${isSaved ? 'border-[#6A38C2] bg-[#F4EEFF] text-[#6A38C2]' : ''}`}
                    size='icon'
                    onClick={saveHandler}
                    aria-label={isSaved ? 'Remove saved job' : 'Save job'}
                >
                    <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-[#6A38C2]' : ''}`} />
                </Button>
            </div>

            <div className='my-4 flex items-center gap-3'>
                <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white'>
                    <Avatar className='h-10 w-10 rounded-lg'>
                        <AvatarImage src={job?.company?.logo} />
                        <AvatarFallback className='rounded-lg bg-[#F4EEFF] text-[#6A38C2] font-semibold'>{companyInitial}</AvatarFallback>
                    </Avatar>
                </div>
                <div className='min-w-0'>
                    <div className='flex min-w-0 items-center gap-2'>
                        <h1 className='truncate font-semibold text-lg'>{job?.company?.name}</h1>
                        {isCompanyVerified && (
                            <Badge variant='outline' className='shrink-0 gap-1 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700'>
                                <ShieldCheck className='h-3.5 w-3.5' />
                                Verified
                            </Badge>
                        )}
                    </div>
                    <p className='truncate text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>

            <div className='flex-1'>
                <h2 className='line-clamp-1 font-bold text-xl'>{job?.title}</h2>
                <p className='mt-2 line-clamp-3 text-sm leading-6 text-gray-600'>{job?.description}</p>
            </div>

            <div className='mt-4 flex flex-wrap items-center gap-2'>
                <Badge className='rounded-full border-blue-100 bg-blue-50 text-blue-700 font-bold' variant='outline'>{job?.position} Positions</Badge>
                <Badge className='rounded-full border-orange-100 bg-orange-50 text-[#F83002] font-bold' variant='outline'>{job?.jobType}</Badge>
                <Badge className='rounded-full border-purple-100 bg-purple-50 text-[#7209b7] font-bold' variant='outline'>{formatSalaryInLPA(job?.salary)}LPA</Badge>
            </div>

            <div className='mt-5 flex items-center gap-3'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant='outline' className='flex-1'>Details</Button>
                <Button
                    type='button'
                    onClick={saveHandler}
                    className={`flex-1 ${isSaved ? 'bg-gray-900 hover:bg-gray-800' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                >
                    {isSaved ? 'Saved' : 'Save For Later'}
                </Button>
            </div>
        </div>
    )
}

export default Job
