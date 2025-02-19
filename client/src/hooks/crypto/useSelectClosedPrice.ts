import axios from "axios";
import { setClosedData } from "../../redux/features/crypto/askingSlice";
import { showNoticeModal } from "../../redux/features/ui/modalSlice";
import { useAppDispatch } from "../../redux/hooks";

const API_URL = process.env.REACT_APP_API_URL;

export default function useSelectClosedPrice() {
    const dispatch = useAppDispatch();

    // 선택된 화폐에 대한 체결내역 호출
    const selectClosedPrice = async (market: string) => {
        try {
            const response = await axios.get(`${API_URL}/api/tradebook/?market=${market}`);
            dispatch(setClosedData(response.data));
        } catch (error) {
            dispatch(showNoticeModal({
                content: '체결 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
            }));
        }
    };

    return selectClosedPrice;
}