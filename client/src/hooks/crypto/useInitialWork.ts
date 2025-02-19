import axios from "axios";
import { useEffect } from "react";
import { setSelectedCrypto, setCryptoRealTime } from "../../redux/features/crypto/selectedCryptoSlice";
import { showNoticeModal } from "../../redux/features/ui/modalSlice";
import { setUserInfo } from "../../redux/features/user/userSlice";
import { useAppDispatch } from "../../redux/hooks";

const API_URL = process.env.REACT_APP_API_URL;

export default function useInitialWork() {
    const dispatch = useAppDispatch();

    const checkLogin = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/`, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            dispatch(showNoticeModal({
                content: '사용자 정보 확인에 실패했습니다. 잠시 후 다시 접속해주세요.',
            }));
        }
    }

    // 초기 데이터를 비트코인으로 설정
    const getInitialData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/crypto/`, {
                withCredentials: true,
            });

            Promise.all([
                dispatch(setSelectedCrypto(response.data.allCrypto[0])),
                dispatch(setCryptoRealTime(response.data.allCrypto[0]))
            ]);
        } catch (error) {
            dispatch(showNoticeModal({
                content: '서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.',
            }));
        }
    };

    // 마운트 초기에 사용자의 로그인 여부를 체크
    // 초기 데이터를 요청하여 selectedCrypto의 초기값을 비트코인으로 설정
    useEffect(() => {
        getInitialData();

        (async () => {
            const response = await checkLogin();
            if (response && response.isLoggedIn) {
                dispatch(setUserInfo({
                    name: response.name,
                    email: response.email,
                }));
            }
            else {
                dispatch(setUserInfo({
                    name: '',
                    email: '',
                }))
            }
        })();
    }, []);
}