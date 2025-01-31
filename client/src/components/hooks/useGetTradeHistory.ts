import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import formatDateString from "../../utils/date/formatDateString";
import { setUserTradeHistory, setUserTradeHistory_unSigned } from "../../redux/features/tradeSlice";
import { showNoticeModal } from "../../redux/features/modalSlice";
import { useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function useTradeHistory() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  // 서버로부터 거래 내역을 받아옴
  const getTradeHistory = async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/get_user_tradeHistory/`, {
        email: email,
      });

      // 서버로부터 받아온 체결 내역과 미체결 내역을 담을 임시 배열
      const signed: {
        trade_time: string;
        is_signed: boolean;
        id: string;
        crypto_price: number;
        crypto_name: string;
        trade_amount: string;
        trade_price: string;
      }[] = [];
      const unSigned: {
        trade_time: string;
        is_signed: boolean;
        id: string;
        crypto_price: number;
        crypto_name: string;
        trade_amount: string;
        trade_price: string;
      }[] = [];

      const tradeHistory = response.data;

      // 다른 요소는 서버에서 받아온 값 그대로 유지, 거래 시간만 형식 변경해서 dispatch
      tradeHistory.forEach((item: { trade_time: Date | string, is_signed: boolean, id: string, crypto_price: number, crypto_name: string, trade_amount: string, trade_price: string, trade_category: string }, i: number) => {
        const date = new Date(item.trade_time);
        const formattedDate = formatDateString(date);

        // 체결 여부가 true일 경우
        if (item.is_signed) {
          signed.push({ ...item, trade_time: formattedDate });
        }
        else {
          unSigned.push({ ...item, trade_time: formattedDate });
        }
      });

      dispatch(setUserTradeHistory(signed));
      dispatch(setUserTradeHistory_unSigned(unSigned));
    } catch (error) {
      dispatch(showNoticeModal({
        content: '거래 내역을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
      }));
    }
  }

  useEffect(() => {
    if (user.email) {
      getTradeHistory(user.email);
    }
  }, [user.email]);

  return getTradeHistory;
}