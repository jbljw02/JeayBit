import React, { useEffect } from 'react';
import axios from 'axios';
import { setUserInfo } from '../../../redux/features/userSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { showNoticeModal } from '../../../redux/features/modalSlice';
import checkCurrentScreen from '../../../utils/responsive/checkCurrentScreen';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// 카카오 인증 후 토큰 발급 및 유저 정보 저장
export default function KakaoCallback() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const code = new URL(window.location.href).searchParams.get('code');

            if (code) {
                try {
                    // 카카오 인증 후 토큰 발급
                    const response = await axios.post(`${SERVER_URL}/oauth/callback/kakao/`, { code }, {
                        withCredentials: true
                    });

                    // 사용자 정보 저장
                    dispatch(setUserInfo({
                        name: response.data.name,
                        email: response.data.email
                    }));

                    // 데스크톱: 팝업 창 처리
                    if (window.opener && checkCurrentScreen() !== 'mobile') {
                        window.opener.location.href = '/';
                        window.close();
                    }
                    // 모바일: 직접 리다이렉션
                    else {
                        navigate('/');
                    }
                } catch (error) {
                    if (window.opener && checkCurrentScreen() !== 'mobile') {
                        window.opener.location.href = '/login';
                        dispatch(showNoticeModal({
                            content: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
                            buttonLabel: '확인',
                            onClick: () => window.close(),
                        }));
                    }
                    else {
                        navigate('/login');
                        dispatch(showNoticeModal({
                            content: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
                            buttonLabel: '확인',
                        }));
                    }
                }
            }
        };

        fetchData();
    }, [dispatch, navigate]);

    return null;
}