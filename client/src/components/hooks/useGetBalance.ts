import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUserBalance } from "../../redux/features/userSlice";
import { showNoticeModal } from "../../redux/features/modalSlice";
import { useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function useGetBalance() {
    const dispatch = useAppDispatch();
    
    const user = useAppSelector(state => state.user);

    // 서버로부터 사용자의 잔고량을 받아옴
    const getBalance = async (email: string) => {
        try {
            const response = await axios.post(
                `${API_URL}/get_user_balance/`,
                { email: email }
            );
            dispatch(setUserBalance(response.data.userBalance));
        } catch (error) {
            dispatch(showNoticeModal({
                content: '잔고를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
            }));
        }
    }

    useEffect(() => {
        if (user.email) {
            getBalance(user.email);
        }
    }, [user.email]);

    return getBalance;
}