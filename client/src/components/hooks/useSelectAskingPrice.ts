import axios from "axios";
import { AskingData, setAskingData, setTotalAskSize, setTotalBidSize } from "../../redux/features/askingSlice";
import { setErrorModal } from "../../redux/features/modalSlice";
import { useAppDispatch } from "../../redux/hooks";

const API_URL = process.env.REACT_APP_API_URL;

export default function useSelectAskingPrice() {
    const dispatch = useAppDispatch();
    // 선택된 화폐에 대한 호가내역 호출
    const selectAskingPrice = async (market: string) => {
        try {
            const response = await axios.get(`${API_URL}/asking_price/?market=${market}`);

            const orderbookUnits = response.data[0].orderbook_units;
            const timestamp = response.data[0].timestamp;

            const askingData = orderbookUnits.map((item: AskingData) => (
                {
                    ...item,
                    timestamp: timestamp,
                }));

            dispatch(setAskingData(askingData));
            dispatch(setTotalAskSize(response.data[0].total_ask_size));
            dispatch(setTotalBidSize(response.data[0].total_bid_size));
        } catch (error) {
            dispatch(setErrorModal(true));
            throw error;
        }
    };

    return selectAskingPrice;
}