import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import { USER_API_END_POINT } from '@/utils/constant'

const AuthInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const syncUserSession = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/me`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                } else {
                    dispatch(setUser(null));
                }
            } catch (error) {
                dispatch(setUser(null));
            }
        };

        syncUserSession();
    }, [dispatch]);

    return null;
}

export default AuthInitializer