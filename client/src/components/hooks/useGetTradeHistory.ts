import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import formatDateString from "../../utils/format/formatDateString";
import { setTradeHistory, setUnSignedTradeHistory } from "../../redux/features/tradeSlice";
import { showNoticeModal } from "../../redux/features/modalSlice";
import { useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

type ResponseTradeHistory = {
  id: string;
  tradeTime: string;
  isSigned: boolean;
  cryptoPrice: number;
  cryptoName: string;
  tradeAmount: string;
  tradePrice: string;
}

export default function useTradeHistory() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  // 서버로부터 거래 내역을 받아옴
  const getTradeHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/trade/`, {
        withCredentials: true,
      });

      // 서버로부터 받아온 체결 내역과 미체결 내역을 담을 임시 배열
      const signed: ResponseTradeHistory[] = [];
      const unSigned: ResponseTradeHistory[] = [];

      const tradeHistory = response.data;

      // 다른 요소는 서버에서 받아온 값 그대로 유지, 거래 시간만 형식 변경해서 dispatch
      tradeHistory.forEach((item: ResponseTradeHistory, i: number) => {
        const date = new Date(item.tradeTime);
        const formattedDate = formatDateString(date);

        // 체결 여부가 true일 경우
        if (item.isSigned) {
          signed.push({ ...item, tradeTime: formattedDate });
        }
        else {
          unSigned.push({ ...item, tradeTime: formattedDate });
        }
      });

      dispatch(setTradeHistory(signed));
      dispatch(setUnSignedTradeHistory(unSigned));
    } catch (error) {
      dispatch(showNoticeModal({
        content: '거래 내역을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
      }));
    }
  }

  useEffect(() => {
    if (user.email) {
      getTradeHistory();
    }
  }, [user.email]);

  return getTradeHistory;
}