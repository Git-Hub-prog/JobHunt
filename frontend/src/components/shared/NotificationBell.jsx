import React, { useEffect, useState } from 'react'
import { Bell, MailOpen } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import useGetNotifications from '@/hooks/useGetNotifications'

const gmailInboxUrl = 'https://mail.google.com/mail/u/0/#inbox';

const NotificationBell = () => {
    const { user } = useSelector(store => store.auth);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useGetNotifications(Boolean(user), ({ notifications: nextNotifications, unreadCount: nextUnreadCount }) => {
        setNotifications(nextNotifications || []);
        setUnreadCount(nextUnreadCount || 0);
    });

    const markRead = async (notificationId) => {
        try {
            await axios.post(`${USER_API_END_POINT}/notifications/${notificationId}/read`, {}, { withCredentials: true });
            setNotifications((current) => current.map((item) => item._id === notificationId ? { ...item, read: true } : item));
            setUnreadCount((current) => Math.max(current - 1, 0));
        } catch (error) {
            console.log(error);
        }
    };

    const openNotification = async (notification) => {
        if (!notification.read) {
            await markRead(notification._id);
        }
        window.open(notification.link || gmailInboxUrl, '_blank', 'noopener,noreferrer');
    };

    const clearAll = async () => {
        try {
            await axios.post(`${USER_API_END_POINT}/notifications/read-all`, {}, { withCredentials: true });
            setNotifications((current) => current.map((item) => ({ ...item, read: true })));
            setUnreadCount(0);
            toast.success('Notifications cleared');
        } catch (error) {
            console.log(error);
        }
    };

    if (!user) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className='relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-gray-300 hover:bg-gray-50'>
                    <Bell className='h-5 w-5' />
                    {unreadCount > 0 && (
                        <span className='absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className='w-96 rounded-xl p-4' align='end'>
                <div className='flex items-center justify-between gap-3 mb-4'>
                    <div>
                        <h4 className='font-semibold'>Notifications</h4>
                        <p className='text-xs text-gray-500'>Open Gmail to read the full mail.</p>
                    </div>
                    <Button asChild variant='outline' size='sm'>
                        <a href={gmailInboxUrl} target='_blank' rel='noreferrer'>Gmail</a>
                    </Button>
                </div>

                <div className='max-h-80 space-y-2 overflow-y-auto pr-1'>
                    {notifications.length > 0 ? notifications.map((notification) => (
                        <button
                            key={notification._id}
                            onClick={() => openNotification(notification)}
                            className={`w-full rounded-lg border p-3 text-left transition hover:bg-gray-50 ${notification.read ? 'border-gray-100' : 'border-red-200 bg-red-50/60'}`}
                        >
                            <div className='flex items-start gap-3'>
                                <MailOpen className={`mt-0.5 h-4 w-4 ${notification.read ? 'text-gray-400' : 'text-red-500'}`} />
                                <div className='min-w-0 flex-1'>
                                    <div className='flex items-center justify-between gap-3'>
                                        <p className='font-medium text-sm text-gray-900'>{notification.title}</p>
                                        {!notification.read && <span className='h-2 w-2 rounded-full bg-red-500' />}
                                    </div>
                                    <p className='mt-1 text-xs text-gray-600 line-clamp-2'>{notification.message}</p>
                                    <p className='mt-1 text-[11px] text-gray-400'>{new Date(notification.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </button>
                    )) : (
                        <div className='rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500'>
                            No notifications yet.
                        </div>
                    )}
                </div>

                <div className='mt-4 flex items-center justify-between gap-3'>
                    <span className='text-xs text-gray-500'>{unreadCount} unread</span>
                    <Button onClick={clearAll} variant='outline' size='sm'>Mark all read</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default NotificationBell