import React, { useMemo } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const normalize = (value) => (value || '').toString().toLowerCase();

const getSalaryValue = (salary) => {
    const numericSalary = Number(salary);
    return Number.isNaN(numericSalary) ? 0 : numericSalary;
}

const matchesSalary = (salary, bucket) => {
    if (!bucket) return true;

    const value = getSalaryValue(salary);
    if (bucket === '0-40k') return value <= 40000;
    if (bucket === '40k-1lakh') return value > 40000 && value <= 100000;
    if (bucket === '1lakh to 5lakh') return value > 100000 && value <= 500000;
    return true;
}

const jobSearchText = (job) => [
    job?.title,
    job?.description,
    job?.jobType,
    job?.location,
    job?.company?.name,
    ...(job?.requirements || []),
].join(' ').toLowerCase();

const Jobs = () => {
    useGetAllJobs();
    const { allJobs = [], jobFilters = {}, savedJobIds = [] } = useSelector(store => store.job);

    const filteredJobs = useMemo(() => {
        return allJobs.filter((job) => {
            const text = jobSearchText(job);
            const keyword = normalize(jobFilters.keyword);
            const location = normalize(jobFilters.location);
            const role = normalize(jobFilters.role);
            const jobType = normalize(jobFilters.jobType);

            const keywordMatch = !keyword || text.includes(keyword);
            const locationMatch = !location || normalize(job?.location).includes(location);
            const roleMatch = !role || text.includes(role.replace(' developer', '')) || text.includes(role);
            const jobTypeMatch = !jobType || normalize(job?.jobType).includes(jobType.replace(' ', '')) || normalize(job?.jobType).includes(jobType);
            const salaryMatch = matchesSalary(job?.salary, jobFilters.salary);

            return keywordMatch && locationMatch && roleMatch && jobTypeMatch && salaryMatch;
        })
    }, [allJobs, jobFilters]);

    return (
        <div className='min-h-screen bg-gray-50/60'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 md:px-0 py-6'>
                <div className='mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold'>Explore Jobs</h1>
                        <p className='text-sm text-gray-500'>Find roles, save openings, and compare the best matches.</p>
                    </div>
                    <div className='rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm'>
                        {filteredJobs.length} of {allJobs.length} jobs
                    </div>
                </div>

                <div className='flex flex-col gap-5 lg:flex-row'>
                    <div className='lg:w-72 lg:shrink-0'>
                        <FilterCard />
                    </div>
                    <div className='flex-1 min-w-0'>
                        {filteredJobs.length <= 0 ? (
                            <div className='rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm'>
                                <h2 className='font-semibold text-lg'>No jobs found</h2>
                                <p className='mt-2 text-sm text-gray-500'>Try changing or clearing your filters.</p>
                            </div>
                        ) : (
                            <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                                {filteredJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -16 }}
                                        transition={{ duration: 0.25 }}
                                        key={job?._id}
                                    >
                                        <Job job={job} isSaved={savedJobIds.includes(job?._id)} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs
