import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { Pen } from 'lucide-react'
import UpdateProfileDialog from '../UpdateProfileDialog'

const RecruiterDashboard = () => {
    useGetAllCompanies();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { companies } = useSelector(store => store.company);
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='flex items-center justify-between gap-4 mb-8'>
                    <div>
                        <h1 className='text-3xl font-bold'>Recruiter Dashboard</h1>
                        <p className='text-gray-500'>Manage your company profile, logo, and posted jobs from one place.</p>
                    </div>
                    <Button onClick={() => navigate('/admin/jobs/create')}>Post a Job</Button>
                </div>

                <Card className='mb-8'>
                    <CardContent className='p-6 flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <Avatar className='h-16 w-16'>
                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                <AvatarFallback className='bg-[#6A38C2] text-white text-lg font-semibold'>
                                    {user?.fullname?.charAt(0)?.toUpperCase() || 'R'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className='text-xl font-semibold'>{user?.fullname}</h2>
                                <p className='text-gray-500'>{user?.email}</p>
                                <p className='text-sm text-gray-500'>Role: {user?.role}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} variant="outline"><Pen /></Button>
                    </CardContent>
                </Card>

                <div className='grid md:grid-cols-3 gap-4 mb-10'>
                    <Card>
                        <CardContent className='p-5'>
                            <h3 className='font-semibold mb-2'>Companies</h3>
                            <p className='text-sm text-gray-500 mb-4'>Create and manage your company profile and logo.</p>
                            <Button asChild variant='outline' className='w-full'>
                                <Link to='/admin/companies'>Open Companies</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='p-5'>
                            <h3 className='font-semibold mb-2'>My Jobs</h3>
                            <p className='text-sm text-gray-500 mb-4'>View and manage every job you created.</p>
                            <Button asChild variant='outline' className='w-full'>
                                <Link to='/admin/jobs'>Open Jobs</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='p-5'>
                            <h3 className='font-semibold mb-2'>Create Job</h3>
                            <p className='text-sm text-gray-500 mb-4'>Post a new opening for your company.</p>
                            <Button asChild className='w-full'>
                                <Link to='/admin/jobs/create'>New Job</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-xl font-semibold'>Your Companies</h2>
                        <Button onClick={() => navigate('/admin/companies/create')} variant='outline'>New Company</Button>
                    </div>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {companies?.length > 0 ? companies.map((company) => (
                            <Card key={company._id}>
                                <CardContent className='p-5 flex items-center gap-4'>
                                    <Avatar>
                                        <AvatarImage src={company.logo} alt={company.name} />
                                        <AvatarFallback>{company.name?.charAt(0)?.toUpperCase() || 'C'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className='font-semibold'>{company.name}</h3>
                                        <p className='text-sm text-gray-500'>{company.location || 'No location yet'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <p className='text-sm text-gray-500'>No company created yet.</p>
                        )}
                    </div>
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default RecruiterDashboard