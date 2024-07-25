import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import formatDateString from "../utils/date/formatDateString";
import { AskingData, setAskingData, setTotalAskSize, setTotalBidSize, setClosedData } from "../redux/features/askingSlice";
import { setAllCrypto, OwnedCrypto } from "../redux/features/cryptoListSlice";
import { setSelectedCrypto } from "../redux/features/selectedCryptoSlice";
import { setUserTradeHistory, setUserTradeHistory_unSigned } from "../redux/features/tradeSlice";
import { setFailTransfer, setSuccessTransfer, setUserWallet } from "../redux/features/walletSlice";
import { RootState } from "../redux/store";
import { setErrorModal } from "../redux/features/modalSlice";
import { useCallback } from "react";
import { setCandlePerMinute, setCandlePerDate } from "../redux/features/chartSlice";
import NoticeModal from "./modal/common/NoticeModal";

export default function useFunction() {
  const dispatch = useDispatch();

  const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
  const successTransfer = useSelector((state: RootState) => state.successTransfer);
  const failTransfer = useSelector((state: RootState) => state.failTransfer);
  const transferCategory = useSelector((state: RootState) => state.transferCategory);


  const checkLogin = async () => {
    try {
      const response = await axios.post("https://jeaybit.onrender.com/check_login/", {}, {
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const getAllCrypto = async () => {
    try {
      const response = await axios.post("https://jeaybit.onrender.com/get_all_crypto/", {}, {
        withCredentials: true,
      });

      dispatch(setAllCrypto(response.data.all_crypto));
    } catch (error) {
      dispatch(setErrorModal(true));
      throw error;
    }
  };

  // 서버로부터 사용자의 잔고량을 받아옴
  const getBalance = async (email: string) => {
    try {
      const response = await axios.post(
        `https://jeaybit.onrender.com/get_user_balance/`,
        { email: email }
      );
      dispatch(setUserWallet(response.data.user_balance));
    } catch (error) {
      throw error;
    }
  }

  // 사용자가 소유하고 있는 화폐의 정보를 받아옴
  const getOwnedCrypto = async (email: string) => {
    try {
      const response = await axios.post('https://jeaybit.onrender.com/get_user_ownedCrypto/', {
        email: email,
      });

      const resOwnedCrypto: OwnedCrypto[] = response.data;
      const targetCrypto = resOwnedCrypto.find(item => item.name === selectedCrypto.name);

      const updatedCrypto = {
        ...selectedCrypto,
        is_owned: targetCrypto?.is_owned,
        owned_quantity: targetCrypto?.owned_quantity,
      };

      dispatch(setSelectedCrypto(updatedCrypto));
    } catch (error) {
      throw error;
    }
  }

  // 거래 내역에 저장될 정보를 전송(화폐 매수와 함께)
  const addTradeHistory = async (email: string, cryptoName: string, tradeCategory: string, tradeTime: Date, cryptoMarket: string, cryptoPrice: number, tradePrice: number, tradeAmount: number, market: string, isMarketValue: boolean) => {
    try {
      const response = await axios.post("https://jeaybit.onrender.com/add_user_tradeHistory/", {
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
      const response = await axios.post('https://jeaybit.onrender.com/get_user_tradeHistory/', {
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


  // 선택된 화폐에 대한 호가내역 호출
  const selectAskingPrice = async (market: string) => {
    try {
      const response = await axios.get(`https://jeaybit.onrender.com/asking_price/?market=${market}`);

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

  // 선택된 화폐에 대한 체결내역 호출
  const selectClosedPrice = async (market: string) => {
    try {
      const response = await axios.get(`https://jeaybit.onrender.com/closed_price/?market=${market}`);
      dispatch(setClosedData(response.data));
    } catch (error) {
      dispatch(setErrorModal(true));
      throw error;
    }
  };

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 분에 따라)
  const requestCandleMinute = useCallback(async (market: string, minute: string) => {
    if (minute && market) {
      try {
        const response = await axios.get(`https://jeaybit.onrender.com/candle_per_minute/?market=${market}&minute=${minute}`);
        dispatch(setCandlePerMinute(response.data));
      } catch (error) {
        dispatch(setErrorModal(true));
        throw error;
      }
    }
  }, [dispatch]);

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 일/주/월에 따라)
  const requestCandleDate = useCallback(async (market: string) => {
    try {
      let response;
      let url = "https://jeaybit.onrender.com/";

      if (chartSortDate === "1일") {
        url += `candle_per_date/?market=${market}`;
        response = await axios.get(url);
        dispatch(setCandlePerDate(response.data));
      } else if (chartSortDate === "1주") {
        url += `candle_per_week/?market=${market}`;
        response = await axios.get(url);
        dispatch(setCandlePerDate(response.data));
      } else if (chartSortDate === "1개월") {
        url += `candle_per_month/?market=${market}`;
        response = await axios.get(url);
        dispatch(setCandlePerDate(response.data));
      }
    } catch (error) {
      dispatch(setErrorModal(true));
      throw error;
    }
  }, [chartSortDate, dispatch]);

  // 입/출금 완료 시 띄울 모달 결정
  const renderTransferModal = () => {
    if (successTransfer) {
      return (
        <NoticeModal
          isModalOpen={successTransfer}
          setIsModalOpen={() => dispatch(setSuccessTransfer(false))}
          content={`${transferCategory === 'deposit' ? '입금' : '출금'}이 성공적으로 완료되었습니다.`} />
      );
    }
    if (failTransfer) {
      return (
        <NoticeModal
          isModalOpen={failTransfer}
          setIsModalOpen={() => dispatch(setFailTransfer(false))}
          content={`${transferCategory === 'deposit' ? '입금' : '출금'}에 실패했습니다.`} />
      );
    }

    return null;
  };


  return {
    checkLogin,
    getAllCrypto,
    getBalance,
    getOwnedCrypto,
    addTradeHistory,
    getTradeHistory,
    selectAskingPrice,
    selectClosedPrice,
    requestCandleMinute,
    requestCandleDate,
    renderTransferModal
  };

}