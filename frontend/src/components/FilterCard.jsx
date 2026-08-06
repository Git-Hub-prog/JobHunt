import React from 'react'
import { BriefcaseBusiness, MapPin, RotateCcw, Search, WalletCards } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearJobFilters, setJobFilter } from '@/redux/jobSlice'
import { Input } from './ui/input'
import { Button } from './ui/button'

const filterSections = [
    {
        name: 'location',
        title: 'Location',
        icon: MapPin,
        options: ['Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Noida', 'vadodara'],
    },
    {
        name: 'role',
        title: 'Role',
        icon: BriefcaseBusiness,
        options: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Devops', 'AI/ML'],
    },
    {
        name: 'jobType',
        title: 'Job Type',
        icon: BriefcaseBusiness,
        options: ['Internship', 'Full Time', 'Part Time', 'Remote'],
    },
    {
        name: 'salary',
        title: 'Salary',
        icon: WalletCards,
        options: ['0-40k', '40k-1lakh', '1lakh to 5lakh'],
    },
]

const FilterCard = () => {
    const dispatch = useDispatch();
    const { jobFilters = {} } = useSelector(store => store.job);
    const hasFilters = Object.values(jobFilters).some(Boolean);

    const updateFilter = (name, value) => {
        dispatch(setJobFilter({ name, value }));
    }

    return (
        <aside className='sticky top-20 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center justify-between gap-3 border-b border-gray-100 pb-4'>
                <div>
                    <h1 className='font-bold text-xl'>Filter Jobs</h1>
                    <p className='mt-1 text-xs text-gray-500'>Refine openings quickly.</p>
                </div>
                {hasFilters && (
                    <Button type='button' variant='outline' size='icon' className='h-9 w-9 rounded-full' onClick={() => dispatch(clearJobFilters())}>
                        <RotateCcw className='h-4 w-4' />
                    </Button>
                )}
            </div>

            <div className='mt-4'>
                <label className='mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800'>
                    <Search className='h-4 w-4 text-[#6A38C2]' />
                    Search
                </label>
                <Input
                    value={jobFilters.keyword}
                    onChange={(event) => updateFilter('keyword', event.target.value)}
                    placeholder='Title, company, skill'
                    className='rounded-lg'
                />
            </div>

            <div className='mt-5 space-y-5'>
                {filterSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <div key={section.name}>
                            <div className='mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800'>
                                <Icon className='h-4 w-4 text-[#6A38C2]' />
                                {section.title}
                            </div>
                            <div className='space-y-2'>
                                {section.options.map((option) => {
                                    const selected = jobFilters[section.name] === option;
                                    return (
                                        <button
                                            key={option}
                                            type='button'
                                            onClick={() => updateFilter(section.name, selected ? '' : option)}
                                            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${selected
                                                ? 'border-[#6A38C2] bg-[#F4EEFF] font-semibold text-[#6A38C2]'
                                                : 'border-gray-200 text-gray-700 hover:border-[#6A38C2]/40 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>{option}</span>
                                            <span className={`h-3 w-3 rounded-full border ${selected ? 'border-[#6A38C2] bg-[#6A38C2]' : 'border-gray-300'}`} />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </aside>
    )
}

export default FilterCard
