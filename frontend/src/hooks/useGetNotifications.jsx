import { useEffect } from 'react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'

const useGetNotifications = (enabled = true, onSuccess) => {
    useEffect(() => {
        if (!enabled) return;

        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/notifications`, { withCredentials: true });
                if (res.data.success && onSuccess) {
                    onSuccess(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 30000);

        return () => clearInterval(intervalId);
    }, [enabled, onSuccess]);
};

export default useGetNotifications;