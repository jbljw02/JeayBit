import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUserBalance } from "../redux/features/userSlice";
import { showNoticeModal } from "../redux/features/modalSlice";
import { useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function useGetBalance() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);

    // 서버로부터 사용자의 잔고량을 받아옴
    const getBalance = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/user/balance/`,
                { withCredentials: true }  // 세션 쿠키를 포함하도록 설정
            );
            dispatch(setUserBalance(response.data.balance));
        } catch (error) {
            dispatch(showNoticeModal({
                content: '잔고를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
            }));
        }
    }

    useEffect(() => {
        if (user.email) {
            getBalance();
        }
    }, [user.email]);

    return getBalance;
}