import axios from "axios";
import { setErrorModal } from "../../redux/features/modalSlice";
import { useAppDispatch } from "../../redux/hooks";
import { setClosedData } from "../../redux/features/askingSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useSelectClosedPrice() {
    const dispatch = useAppDispatch();
    
    // 선택된 화폐에 대한 체결내역 호출
    const selectClosedPrice = async (market: string) => {
        try {
            const response = await axios.get(`${API_URL}/closed_price/?market=${market}`);
            dispatch(setClosedData(response.data));
        } catch (error) {
            dispatch(setErrorModal(true));
            throw error;
        }
    };

    return selectClosedPrice;
}