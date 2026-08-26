import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage } from './ui/avatar'
import { formatSalaryInLPA } from '@/utils/formatSalary'
import { ShieldCheck } from 'lucide-react'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    const isCompanyVerified = job?.company?.verificationStatus === "verified";
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
            <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10 border border-gray-100'>
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                </Avatar>
                <div>
                <div className='flex items-center gap-2'>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    {isCompanyVerified && (
                        <Badge variant='outline' className='gap-1 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700'>
                            <ShieldCheck className='h-3.5 w-3.5' />
                            Verified
                        </Badge>
                    )}
                </div>
                <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{formatSalaryInLPA(job?.salary)}LPA</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards
