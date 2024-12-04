
import axios from "axios";
import { useAppDispatch } from "../../redux/hooks";
import { setUserBalance } from "../../redux/features/userSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useGetBalance() {
    const dispatch = useAppDispatch();

    // 서버로부터 사용자의 잔고량을 받아옴
    const getBalance = async (email: string) => {
        try {
            const response = await axios.post(
                `${API_URL}/get_user_balance/`,
                { email: email }
            );
            dispatch(setUserBalance(response.data.user_balance));
        } catch (error) {
            throw error;
        }
    }

    return getBalance;
}