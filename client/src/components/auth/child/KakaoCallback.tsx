import { useEffect, useState } from 'react';
import axios from 'axios';
import { setUserInfo } from '../../../redux/features/user/userSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { showNoticeModal } from '../../../redux/features/ui/modalSlice';
import WorkingSpinner from '../../modal/trade/WorkingSpinnerModal';

const API_URL = process.env.REACT_APP_API_URL;

// 카카오 인증 후 토큰 발급 및 유저 정보 저장
export default function KakaoCallback() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const code = new URL(window.location.href).searchParams.get('code');

            if (code) {
                try {
                    setIsLoading(true);

                    // 카카오 인증 후 토큰 발급
                    const response = await axios.post(`${API_URL}/oauth/callback/kakao`, { code }, {
                        withCredentials: true
                    });

                    // 사용자 정보 저장
                    dispatch(setUserInfo({
                        name: response.data.name,
                        email: response.data.email
                    }));

                    navigate('/');
                } catch (error) {
                    navigate('/login');
                    dispatch(showNoticeModal({
                        content: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
                        buttonLabel: '확인',
                    }));
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [dispatch, navigate]);

    return <WorkingSpinner
        isModalOpen={isLoading}
        setIsModalOpen={() => setIsLoading(false)} />
}