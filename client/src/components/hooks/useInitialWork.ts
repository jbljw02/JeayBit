import { useAppDispatch } from "../../redux/hooks";
import axios from "axios";
import { showNoticeModal } from "../../redux/features/modalSlice";
import { useEffect } from "react";
import { setSelectedCrypto, setCryptoRealTime } from "../../redux/features/selectedCryptoSlice";
import { setUserInfo } from "../../redux/features/userSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useInitialWork() {
    const dispatch = useAppDispatch();

    const checkLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/check_login/`, {}, {
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
            const response = await axios.post(`${API_URL}/get_all_crypto/`, {}, {
                withCredentials: true,
            });

            Promise.all([
                dispatch(setSelectedCrypto(response.data.all_crypto[0])),
                dispatch(setCryptoRealTime(response.data.all_crypto[0]))
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
            if (response && response.is_logged_in) {
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