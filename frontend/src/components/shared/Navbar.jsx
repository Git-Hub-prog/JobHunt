import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { BriefcaseBusiness, Compass, GitBranch, LogOut, PanelLeft, Search, User2, Users, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import NotificationBell from './NotificationBell'

const placementItems = [
    { label: 'Jobs', path: '/jobs', icon: Search },
    { label: 'Browse', path: '/browse', icon: Compass },
    { label: 'Applied Jobs', path: '/applied-jobs', icon: BriefcaseBusiness },
    { label: 'Branch-wise Recommendation', path: '/branch-recommendations', icon: GitBranch },
    { label: 'My Network', path: '/my-network', icon: Users },
]

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showPlacementSidebar = !user || user?.role === 'student';

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
            <div className='bg-white/95 backdrop-blur border-b border-gray-100'>
                <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                    <div className='flex items-center gap-3 shrink-0'>
                        {showPlacementSidebar && (
                            <Button
                                type='button'
                                variant='outline'
                                size='icon'
                                className='h-10 w-10 rounded-full'
                                onClick={() => setSidebarOpen(true)}
                                aria-label='Open placement sidebar'
                            >
                                <PanelLeft className='h-5 w-5' />
                            </Button>
                        )}
                        <Link to='/' className='text-2xl font-bold tracking-tight'>
                            Job<span className='text-[#F83002]'>Hunt</span>
                        </Link>
                    </div>
                    <div className='flex items-center gap-6 sm:gap-10'>
                        <ul className='flex items-center gap-6 text-[15px] font-medium text-gray-700'>
                            {(!user || user?.role === 'student') ? (
                                <>
                                    <li><Link className='transition-colors hover:text-black' to="/">Home</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link className='transition-colors hover:text-black' to="/">Home</Link></li>
                                    <li><Link className='transition-colors hover:text-black' to="/recruiter/dashboard">Dashboard</Link></li>
                                    <li><Link className='transition-colors hover:text-black' to="/admin/companies">Companies</Link></li>
                                    <li><Link className='transition-colors hover:text-black' to="/admin/jobs">My Jobs</Link></li>
                                </>
                            )}
                        </ul>
                        {
                            !user ? (
                                <div className='hidden sm:flex items-center gap-2'>
                                    <Link to="/login"><Button variant="outline">Login</Button></Link>
                                    <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                                </div>
                            ) : (
                                <div className='flex items-center gap-3'>
                                    <NotificationBell />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent transition hover:ring-gray-200">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                                <AvatarFallback className="bg-[#6A38C2] text-white text-sm font-semibold">
                                                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 rounded-xl p-4" align="end">
                                            <div className='space-y-4'>
                                                <div className='flex gap-3'>
                                                    <Avatar className="h-12 w-12 cursor-pointer">
                                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                                        <AvatarFallback className="bg-[#6A38C2] text-white font-semibold">
                                                            {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className='min-w-0'>
                                                        <h4 className='font-semibold leading-none'>{user?.fullname}</h4>
                                                        <p className='mt-1 text-sm text-muted-foreground line-clamp-2'>{user?.profile?.bio || 'Experienced software developer'}</p>
                                                    </div>
                                                </div>
                                                <div className='border-t pt-3 text-gray-600'>
                                                    {user?.role === 'student' && (<>
                                                        <div className='flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50'>
                                                            <User2 className='h-4 w-4' />
                                                            <Button asChild variant="link" className='h-auto p-0 text-left font-normal text-gray-700 no-underline hover:no-underline'>
                                                                <Link to="/profile">View Profile</Link>
                                                            </Button>
                                                        </div>
                                                        <div className='flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50'>
                                                            <BriefcaseBusiness className='h-4 w-4' />
                                                            <Button asChild variant="link" className='h-auto p-0 text-left font-normal text-gray-700 no-underline hover:no-underline'>
                                                                <Link to="/applied-jobs">Placements</Link>
                                                            </Button>
                                                        </div>
                                                    </>)}
                                                    {user?.role === 'recruiter' && (
                                                        <div className='flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50'>
                                                            <User2 className='h-4 w-4' />
                                                            <Button asChild variant="link" className='h-auto p-0 text-left font-normal text-gray-700 no-underline hover:no-underline'>
                                                                <Link to="/recruiter/dashboard">Recruiter Dashboard</Link>
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <div className='flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50'>
                                                        <LogOut className='h-4 w-4' />
                                                        <Button onClick={logoutHandler} variant="link" className='h-auto p-0 font-normal text-gray-700 no-underline hover:no-underline'>
                                                            Logout
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>

            {showPlacementSidebar && sidebarOpen && (
                <div className='fixed inset-0 z-50 flex'>
                    <button
                        type='button'
                        className='absolute inset-0 bg-black/30'
                        onClick={() => setSidebarOpen(false)}
                        aria-label='Close placement sidebar overlay'
                    />
                    <aside className='relative z-10 h-full w-[320px] max-w-[86vw] bg-white shadow-2xl'>
                        <div className='flex h-16 items-center justify-between border-b px-5'>
                            <div>
                                <h2 className='font-semibold text-lg'>Placement Area</h2>
                                <p className='text-xs text-gray-500'>Choose what you want to view.</p>
                            </div>
                            <Button
                                type='button'
                                variant='outline'
                                size='icon'
                                className='h-9 w-9 rounded-full'
                                onClick={() => setSidebarOpen(false)}
                                aria-label='Close placement sidebar'
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                        <nav className='space-y-2 p-4'>
                            {placementItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                                                ? 'bg-[#F4EEFF] text-[#6A38C2]'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2]'
                                            }`
                                        }
                                    >
                                        <Icon className='h-5 w-5' />
                                        <span>{item.label}</span>
                                    </NavLink>
                                )
                            })}
                        </nav>
                    </aside>
                </div>
            )}
        </>
    )
}

export default Navbar

