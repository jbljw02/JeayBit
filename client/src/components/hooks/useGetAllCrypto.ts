import axios from "axios";
import { setAllCrypto } from "../../redux/features/cryptoListSlice";
import { useAppDispatch } from "../../redux/hooks";
import { showNoticeModal } from "../../redux/features/modalSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useGetAllCrypto() {
    const dispatch = useAppDispatch();

    const getAllCrypto = async () => {
        try {
          const response = await axios.post(`${API_URL}/get_all_crypto/`, {}, {
            withCredentials: true,
          });
    
          dispatch(setAllCrypto(response.data.all_crypto));
        } catch (error) {
            dispatch(showNoticeModal({
                content: '서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.',
            }));
        }
    };

    return getAllCrypto;
}