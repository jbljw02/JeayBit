import axios from "axios";
import { useAppDispatch } from "../../redux/hooks";
import { setCandlePerDate, setCandlePerMinute } from "../../redux/features/chartSlice";
import { showNoticeModal } from "../../redux/features/modalSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useRequestCandleMinute() {
  const dispatch = useAppDispatch();

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 분에 따라)
  const requestCandleMinute = async (market: string, minute: string) => {
    if (minute && market) {
      try {
        const response = await axios.get(`${API_URL}/candle-per-minute/?market=${market}&minute=${minute}`);
        dispatch(setCandlePerMinute(response.data));
      } catch (error) {
        dispatch(showNoticeModal({
          content: '차트 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
        }));
      }
    }
  };

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 ;일/주/월에 따라)
  const requestCandleDate = async (market: string, date: '1일' | '1주' | '1개월') => {
    try {
      let url = `${API_URL}/`;

      if (date === "1일") {
        url += `candle-per-date/?market=${market}`;
      } else if (date === "1주") {
        url += `candle-per-week/?market=${market}`;
      } else if (date === "1개월") {
        url += `candle-per-month/?market=${market}`;
      }
      let response;
      response = await axios.get(url);
      dispatch(setCandlePerDate(response.data));
    } catch (error) {
      dispatch(showNoticeModal({
        content: '차트 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
      }));
    }
  };

  return { requestCandleMinute, requestCandleDate };
}