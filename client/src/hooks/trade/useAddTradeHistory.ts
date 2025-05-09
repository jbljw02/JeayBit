import axios from "axios";
import { adjustOwnedCrypto } from "../../redux/features/crypto/userCryptoSlice";
import { addTradeHistory, addUnSignedTradeHistory } from "../../redux/features/trade/tradeSlice";
import { setUserBalance } from "../../redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Crypto } from "../../types/crypto.type";

const API_URL = process.env.REACT_APP_API_URL;

export default function useAddTradeHistory() {
  const dispatch = useAppDispatch();
  const selectedCrypto = useAppSelector(state => state.selectedCrypto);

  // 거래 내역에 저장될 정보를 전송(화폐 매수와 함께)
  const addUserTradeHistory = async (email: string,
    cryptoName: string,
    tradeCategory: string,
    tradeTime: Date,
    cryptoMarket: string,
    cryptoPrice: number,
    tradePrice: number,
    tradeAmount: number | 'ALL',
    market: string,
    isMarketValue: boolean) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/trade/`, {
        email: email,
        cryptoName: cryptoName,
        tradeCategory: tradeCategory,
        tradeTime: tradeTime,
        cryptoMarket: cryptoMarket,
        cryptoPrice: cryptoPrice,
        tradePrice: tradePrice,
        tradeAmount: tradeAmount,
        market: market,
        isMarketValue: isMarketValue,
      }, {
        withCredentials: true,
      });

      // 거래가 즉시 체결 됐을 경우
      // 거래 내역, 보유 화폐 정보, 잔고량 업데이트
      if (response.data.isSigned) {
        const addedCrypto: Crypto = {
          ...selectedCrypto,
          isOwned: response.data.ownedCrypto.isOwned,
          ownedQuantity: response.data.ownedCrypto.ownedQuantity,
        }

        dispatch(addTradeHistory(response.data.tradeHistory));
        dispatch(adjustOwnedCrypto(addedCrypto));
        dispatch(setUserBalance(response.data.balance));
      }
      // 거래가 대기 중일 경우 거래 내역만 업데이트
      else {
        dispatch(addUnSignedTradeHistory(response.data.tradeHistory));
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

  return addUserTradeHistory;
}