import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserWallet, RootState, setOwnedCrypto, setUserTradeHistory, setUserTradeHistory_unSigned, setIsBuying } from "../store";
import { useState } from "react";

export default function useFunction() {

  const dispatch = useDispatch();
  const logInUser = useSelector((state: RootState) => state.logInUser);
  const ownedCrypto = useSelector((state: RootState) => state.ownedCrypto);
  const logInEmail = useSelector((state: RootState) => state.logInEmail);
  const cr_selected = useSelector((state: RootState) => state.cr_selected);
  const userTradeHistory_unSigned = useSelector((state: RootState) => state.userTradeHistory_unSigned);
  const isBuying = useSelector((state: RootState) => state.isBuying);

  const [time, setTime] = useState(new Date());

  // 서버로부터 사용자의 잔고량을 받아옴
  const getBalance = (email: string) => {
    (async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get_user_balance/${email}/`
        );
        dispatch(setUserWallet(response.data.user_balance));
        console.log(logInUser, "의 잔고 : ", response.data.user_balance);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  // 사용자가 소유하고 있는 화폐의 정보를 받아옴
  const getOwnedCrypto = (logInEmail: string) => {
    (async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get_user_ownedCrypto/${logInEmail}/`
        );
        dispatch(setOwnedCrypto(response.data))
        console.log("반환값-소유화폐 : ", response.data)
      } catch (error) {
        console.log(error);
      }
    })()
  }

  // 거래 내역에 저장될 정보를 전송(화폐 매수와 함께)
  const addTradeHistory = (email: string, cryptoName: string, tradeCategory: string, tradeTime: Date, cryptoMarket: string, cryptoPrice: number, tradePrice: number, tradeAmount: number, isSigned: boolean) => {
    (async (email, cryptoName, tradeTime, cryptoMarket, cryptoPrice, tradePrice, tradeAmount) => {
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
          is_signed: isSigned,
        });
        getTradeHistory(logInEmail);
        console.log("거래 내역 전송 성공", response.data)
      } catch (error) {
        console.log("거래 내역 전송 실패", error);
      }
    })(email, cryptoName, tradeTime, cryptoMarket, cryptoPrice, tradePrice, tradeAmount)
  }

  // 서버로부터 거래 내역을 받아옴
  const getTradeHistory = (logInEmail: string) => {
    (async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get_user_tradeHistory/${logInEmail}/`
        );
        console.log("반환값-거래내역 : ", response.data);

        // 다른 요소는 서버에서 받아온 값 그대로 유지, 거래 시간만 형식 변경해서 dispatch
        response.data.map((item: { trade_time: Date, is_signed: boolean, id: string; crypto_price: number }, i: number) => {
          let date = new Date(item.trade_time);
          let formattedDate = date.getFullYear() + '.'
            + (date.getMonth() + 1).toString().padStart(2, '0') + '.'
            + date.getDate().toString().padStart(2, '0') + ' '
            + date.getHours().toString().padStart(2, '0') + ':'
            + date.getMinutes().toString().padStart(2, '0');

          if (item.is_signed) {
            dispatch(setUserTradeHistory({ ...item, trade_time: formattedDate }))
          }
          else {
            dispatch(setUserTradeHistory_unSigned({ ...item, trade_time: formattedDate }))
            localStorage.setItem(item.id, JSON.stringify(item.crypto_price));  // 체결되지 않은 구매 요청에 대한 ID를 로컬 스토리지에 추가
          }
        })
      } catch (error) {
        console.log("거래내역 받아오기 실패", error);
      }
    })();
  }

  // 모든 화폐의 이름을 받아옴
  const getCryptoName = () => {
    (async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/get_crypto_name/'
        );
        console.log(response.data);
        let cryptoNames = response.data.detail;

        let isBuyingTemp = cryptoNames.reduce((obj: { [obj: string]: boolean; }, name: string) => {
          obj[name] = false;
          return obj;
        }, {})
        dispatch(setIsBuying(isBuyingTemp));

      } catch (error) {
        console.log("화폐명 받아오기 실패", error);
      }
    })();
  }

  return { getBalance, getOwnedCrypto, addTradeHistory, getTradeHistory, getCryptoName };

}
