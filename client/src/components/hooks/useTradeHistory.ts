import axios from "axios";
import { useAppDispatch } from "../../redux/hooks";
import formatDateString from "../../utils/date/formatDateString";
import { addUserTradeHistory, addUserTradeHistory_unSigned, setUserTradeHistory, setUserTradeHistory_unSigned } from "../../redux/features/tradeSlice";
import { addOwnedCrypto } from "../../redux/features/userCryptoSlice";
import { setUserBalance } from "../../redux/features/userSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useTradeHistory() {
  const dispatch = useAppDispatch();

  // 거래 내역에 저장될 정보를 전송(화폐 매수와 함께)
  const addTradeHistory = async (email: string, cryptoName: string, tradeCategory: string, tradeTime: Date, cryptoMarket: string, cryptoPrice: number, tradePrice: number, tradeAmount: number, market: string, isMarketValue: boolean) => {
    try {
      const response = await axios.post(`${API_URL}/add_user_tradeHistory/`, {
        email: email,
        crypto_name: cryptoName,
        trade_category: tradeCategory,
        trade_time: tradeTime,
        crypto_market: cryptoMarket,
        crypto_price: cryptoPrice,
        trade_price: tradePrice,
        trade_amount: tradeAmount,
        market: market,
        isMarketValue: isMarketValue,
      });

      // 거래가 즉시 체결 됐을 경우
      // 거래 내역, 보유 화폐 정보, 잔고량 업데이트
      if (response.data.is_signed) {
        dispatch(addUserTradeHistory(response.data.trade_history));
        dispatch(addOwnedCrypto(response.data.owned_crypto));
        dispatch(setUserBalance(response.data.balance));
      }
      // 거래가 대기 중일 경우 거래 내역만 업데이트
      else {
        dispatch(addUserTradeHistory_unSigned(response.data.trade_history));
      }

      return response.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response ? error.response.status : 500;
      }
      else {
        return 500;
      }
    }
  }

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
      throw error;
    }
  }

  return { addTradeHistory, getTradeHistory };
}