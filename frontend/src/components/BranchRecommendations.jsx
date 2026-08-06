import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const branchKeywords = {
    cse: ['computer science', 'software', 'developer', 'full stack', 'frontend', 'backend', 'react', 'node', 'java', 'python', 'web', 'data', 'ai', 'ml', 'dsa'],
    cs: ['computer science', 'software', 'developer', 'full stack', 'frontend', 'backend', 'react', 'node', 'java', 'python', 'web', 'data', 'ai', 'ml', 'dsa'],
    it: ['information technology', 'software', 'developer', 'full stack', 'frontend', 'backend', 'react', 'node', 'java', 'python', 'web', 'data', 'ai', 'ml', 'dsa'],
    ece: ['electronics and communication', 'embedded', 'hardware', 'firmware', 'vlsi', 'iot', 'telecom', 'electronics', 'network', 'signal'],
    ee: ['electrical', 'power', 'control', 'automation', 'embedded', 'iot'],
    eee: ['electrical and electronics', 'electrical', 'power', 'control', 'automation', 'embedded', 'iot'],
    mech: ['mechanical', 'design', 'manufacturing', 'production', 'cad', 'automotive', 'solidworks', 'ansys'],
    civil: ['civil', 'construction', 'site', 'structural', 'planning', 'estimation', 'survey'],
};

const normalize = (value) => (value || '').toString().toLowerCase();

const getKeywords = (profile) => {
    const branch = normalize(profile?.branch);
    const specialization = normalize(profile?.specialization);
    const skills = (profile?.skills || []).map(normalize);
    const custom = [branch, specialization, ...skills].filter(Boolean);

    Object.entries(branchKeywords).forEach(([key, keywords]) => {
        if (branch.includes(key)) {
            custom.push(...keywords);
        }
    });

    return [...new Set(custom)];
};

const scoreJob = (job, keywords) => {
    const haystack = [
        job?.title,
        job?.description,
        job?.jobType,
        job?.location,
        job?.company?.name,
        ...(job?.requirements || []),
    ]
        .join(' ')
        .toLowerCase();

    let score = 0;
    keywords.forEach((keyword) => {
        if (haystack.includes(keyword)) {
            score += keyword.length > 5 ? 3 : 2;
        }
    });

    if (job?.jobType?.toLowerCase()?.includes('intern')) score += 1;
    if (job?.location?.toLowerCase()?.includes('remote')) score += 1;
    return score;
};

const BranchRecommendations = ({ profile }) => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    setJobs(res.data.jobs || []);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchJobs();
    }, []);

    const keywords = getKeywords(profile);
    const recommendedJobs = jobs
        .map((job) => ({ job, score: scoreJob(job, keywords) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

    return (
        <div className='bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm mt-6'>
            <div className='flex items-center justify-between gap-4 mb-4'>
                <div>
                    <h2 className='font-bold text-lg'>Branch-wise Recommendations</h2>
                    <p className='text-sm text-gray-500'>Jobs matched from your branch, specialization, and skills.</p>
                </div>
                <Button asChild variant='outline'>
                    <Link to='/jobs'>View All Jobs</Link>
                </Button>
            </div>

            {recommendedJobs.length > 0 ? (
                <div className='grid gap-4 md:grid-cols-2'>
                    {recommendedJobs.map(({ job, score }) => (
                        <div key={job._id} className='rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow'>
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <h3 className='font-semibold text-base'>{job.title}</h3>
                                    <p className='text-sm text-gray-500'>{job.company?.name} • {job.location}</p>
                                </div>
                                <span className='text-xs font-semibold text-[#6A38C2] bg-[#F4EEFF] px-2 py-1 rounded-full'>
                                    Match {score}
                                </span>
                            </div>
                            <p className='text-sm text-gray-600 mt-3 line-clamp-2'>{job.description}</p>
                            <div className='mt-4 flex items-center justify-between gap-3'>
                                <span className='text-xs text-gray-500'>{job.jobType}</span>
                                <Button asChild size='sm' className='bg-[#6A38C2] hover:bg-[#5b30a6]'>
                                    <Link to={`/description/${job._id}`}>View Job</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-500'>
                    Add your branch, specialization, and skills to get better recommendations.
                </div>
            )}
        </div>
    )
}

export default BranchRecommendations