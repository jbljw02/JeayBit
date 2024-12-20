import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addUserTradeHistory, addUserTradeHistory_unSigned } from "../../redux/features/tradeSlice";
import { adjustOwnedCrypto } from "../../redux/features/userCryptoSlice";
import { setUserBalance } from "../../redux/features/userSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useAddTradeHistory() {
  const dispatch = useAppDispatch();

  // 거래 내역에 저장될 정보를 전송(화폐 매수와 함께)
  const addTradeHistory = async (email: string,
    cryptoName: string,
    tradeCategory: string,
    tradeTime: Date,
    cryptoMarket: string,
    cryptoPrice: number,
    tradePrice: number,
    tradeAmount: number,
    market: string,
    isMarketValue: boolean) => {
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
        dispatch(adjustOwnedCrypto(response.data.owned_crypto));
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

  return addTradeHistory;
}