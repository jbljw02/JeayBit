import axios from "axios";
import { useAppDispatch } from "../../redux/hooks";
import { showNoticeModal } from "../../redux/features/modalSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useCheckLogin() {
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

    return checkLogin;
}