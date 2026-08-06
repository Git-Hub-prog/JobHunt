import React from 'react'
import AppliedJobTable from '../AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import Navbar from '../shared/Navbar'

const AppliedJobsPage = () => {
    useGetAppliedJobs();

    return (
        <div>
            <Navbar />
            <div className='max-w-5xl mx-auto my-6 px-4 md:px-0'>
                <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                    <h1 className='font-bold text-xl mb-5'>Applied Jobs</h1>
                    <AppliedJobTable />
                </div>
            </div>
        </div>
    )
}

export default AppliedJobsPage
