import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import formatDateString from "./date/formatDateString";
import { RootState, setAllCrypto, setUserWallet, setSelectedCrypto, OwnedCrypto, setUserTradeHistory, setUserTradeHistory_unSigned, AskingData, setAsking_data, setAsking_totalAskSize, setAsking_totalBidSize, setClosed_data } from "../redux/store";

export default function useFunction() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const filteredData = useSelector((state: RootState) => state.filteredData);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
  const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

  const getAllCrypto = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/get_all_crypto/", {}, {
        withCredentials: true,
      });
      dispatch(setAllCrypto(response.data.all_crypto));

    } catch (error) {
      throw error;
    }
  };

  const checkLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/check_login/", {}, {
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 서버로부터 사용자의 잔고량을 받아옴
  const getBalance = async (email: string) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/get_user_balance/`,
        { email: email }
      );
      dispatch(setUserWallet(response.data.user_balance));
      // console.log(user.name, "의 잔고 : ", response.data.user_balance);
    } catch (error) {
      // console.error("잔고량 받기 실패: ", error)
    }
  }

  // 화면에 보여질 초기 화폐의 차트(비트코인)
  const getInitialData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/get_all_crypto/", {}, {
        withCredentials: true,
      });
      dispatch(setSelectedCrypto(response.data.all_crypto[0]));
      // dispatch(setCandle_per_date_BTC(response.data.candle_btc_date));
      // dispatch(setCr_market_selected(response.data.market[0]));
      // dispatch(setCr_name_selected(response.data.name[0]));
    } catch (error) {
      throw error;
    }
  };

  // 사용자가 소유하고 있는 화폐의 정보를 받아옴
  const getOwnedCrypto = async (email: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/get_user_ownedCrypto/', {
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
      console.log("반환값-소유화폐 : ", response.data)
    } catch (error) {
      console.log("소유 화폐 받아오기 실패", error);
    }
  }

  // 거래 내역에 저장될 정보를 전송(화폐 매수와 함께)
  const addTradeHistory = async (email: string, cryptoName: string, tradeCategory: string, tradeTime: Date, cryptoMarket: string, cryptoPrice: number, tradePrice: number, tradeAmount: number, market: string, isMarketValue: boolean) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/add_user_tradeHistory/", {
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

      console.log("거래 내역 전송 성공: ", response.status);
      return response.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("거래 내역 전송 실패: ", error.response ? error.response.status : "알 수 없는 에러");
        return error.response ? error.response.status : 500;
      }
      else {
        console.log("거래내역 전송 실패: 알 수 없는 에러");
        return 500;
      }
    }
  }

  // 서버로부터 거래 내역을 받아옴
  const getTradeHistory = async (email: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/get_user_tradeHistory/', {
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

          const value = { name: item.crypto_name, price: item.crypto_price, trade_category: item.trade_category, trade_amount: Number(item.trade_amount), trade_price: Number(item.trade_price) };
        }
      });

      dispatch(setUserTradeHistory(signed));
      dispatch(setUserTradeHistory_unSigned(unSigned));
      console.log("거래내역 받아오기 성공: ", tradeHistory);
    } catch (error) {
      console.log("거래내역 받아오기 실패", error);
    }
  }


  // 선택된 화폐에 대한 호가내역 호출
  const selectAskingPrice = async (market: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/asking_price/?market=${market}`);

      const orderbookUnits = response.data[0].orderbook_units;
      const timestamp = response.data[0].timestamp;

      const askingData = orderbookUnits.map((item: AskingData) => (
        {
          ...item,
          timestamp: timestamp,
        }));

      dispatch(setAsking_data(askingData));
      dispatch(setAsking_totalAskSize(response.data[0].total_ask_size));
      dispatch(setAsking_totalBidSize(response.data[0].total_bid_size));
    } catch (error) {
      console.log("호가내역 실패: ", error);
      throw error;
    }
  };


  // 선택된 화폐에 대한 체결내역 호출
  const selectClosedPrice = async (market: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/closed_price/?market=${market}`);

      dispatch(setClosed_data(response.data));
    } catch (error) {
      throw error;
    }
  };

  return {
    getAllCrypto,
    getInitialData,
    getBalance,
    getOwnedCrypto,
    addTradeHistory,
    getTradeHistory,
    selectAskingPrice,
    selectClosedPrice,
    checkLogin,
  };

}