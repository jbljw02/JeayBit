import React, { useEffect } from 'react';
import axios from 'axios';
import { setUserInfo } from '../../../redux/features/userSlice';
import { useAppDispatch } from '../../../redux/hooks';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// 카카오 인증 후 토큰 발급 및 유저 정보 저장
export default function KakaoCallback() {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const fetchData = async () => {
            const code = new URL(window.location.href).searchParams.get('code');

            if (code) {
                try {
                    // 카카오 인증 후 토큰 발급
                    const response = await axios.post(`${SERVER_URL}/oauth/callback/kakao/`, { code }, {
                        withCredentials: true
                    });
                    
                    if (window.opener) {
                        dispatch(setUserInfo({
                            name: response.data.name,
                            email: response.data.email
                        }));
                        window.opener.location.href = '/';
                        window.close();
                    }
                } catch (error) {
                    if (window.opener) {
                        window.opener.location.href = '/login';
                        window.close();
                    }
                }
            }
        };

        fetchData();
    }, [dispatch]);

    return null;
};