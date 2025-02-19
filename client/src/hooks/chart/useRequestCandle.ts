import axios from "axios";
import { setCandlePerMinute, setCandlePerDate } from "../../redux/features/chart/chartSlice";
import { showNoticeModal } from "../../redux/features/ui/modalSlice";
import { useAppDispatch } from "../../redux/hooks";

const API_URL = process.env.REACT_APP_API_URL;

const intervalMap = {
  '1분': '1',
  '5분': '5',
  '10분': '10',
  '30분': '30',
  '1시간': '60',
  '4시간': '240',
  '1일': 'days',
  '1주': 'weeks',
  '1개월': 'months'
};

export default function useRequestCandle() {
  const dispatch = useAppDispatch();

  // 분 단위 캔들 데이터 요청
  const requestCandleMinute = async (market: string, unit: string) => {
    if (!market || !unit) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/candle/`, {
        params: {
          market,
          interval: 'minutes',
          unit: intervalMap[unit as keyof typeof intervalMap]
        }
      }
      );
      dispatch(setCandlePerMinute(response.data));
    } catch (error) {
      dispatch(showNoticeModal({
        content: '차트 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
      }));
    }
  };

  // 일/주/월 단위 캔들 데이터 요청
  const requestCandleDate = async (market: string, interval: '1일' | '1주' | '1개월') => {
    if (!market || !interval) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/candle/`, {
        params: {
          market,
          interval: intervalMap[interval]
        }
      }
      );
      dispatch(setCandlePerDate(response.data));
    } catch (error) {
      dispatch(showNoticeModal({
        content: '차트 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
      }));
    }
  };

  return { requestCandleMinute, requestCandleDate };
}