import axios from "axios";
import { setAllCrypto } from "../../redux/features/cryptoListSlice";
import { useAppDispatch } from "../../redux/hooks";
import { setErrorModal } from "../../redux/features/modalSlice";

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
          dispatch(setErrorModal(true));
          throw error;
        }
    };

    return getAllCrypto;
}