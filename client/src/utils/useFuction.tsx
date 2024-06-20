import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserWallet, RootState, setOwnedCrypto, setUserTradeHistory, setUserTradeHistory_unSigned, setIsBuying, setAsking_data, setAsking_dateTime, setAsking_totalAskSize, setAsking_totalBidSize, setAskingData_unSigned, setIsSelling, setTheme, setClosed_data, setCandle_per_minute, setCandle_per_date, setCandle_per_week, setCandle_per_month, setCr_change, setCr_change_price, setCr_change_rate, setCr_high_price, setCr_low_price, setCr_market, setCr_name, setCr_open_price, setCr_price, setCr_trade_price, setCr_trade_volume, setCandle_per_date_BTC, setCr_market_selected, setCr_name_selected, setFavoriteCrypto, setAllCrypto, setCsrfToken, AskingData, setSelectedCrypto, OwnedCrypto } from "../redux/store";
import { useEffect } from "react";

export default function useFunction() {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const filteredData = useSelector((state: RootState) => state.filteredData);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
  const theme = useSelector((state: RootState) => state.theme);
  const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

  const getAllCrypto = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/get_all_crypto/", {}, {
        withCredentials: true,
      });
      dispatch(setAllCrypto(response.data.all_crypto));
      dispatch(setCr_name(response.data.name));
      dispatch(setCr_price(response.data.price));
      dispatch(setCr_market(response.data.market));
      dispatch(setCr_change(response.data.change));
      dispatch(setCr_change_rate(response.data.change_rate));
      dispatch(setCr_change_price(response.data.change_price));
      dispatch(setCr_trade_price(response.data.trade_price));
      dispatch(setCr_trade_volume(response.data.trade_volume));
      dispatch(setCr_open_price(response.data.open_price));
      dispatch(setCr_high_price(response.data.high_price));
      dispatch(setCr_low_price(response.data.low_price));

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
      console.error("Error: ", error);
    }
  }


  // 서버로부터 사용자의 잔고량을 받아옴
  const getBalance = async (email: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/get_user_balance/${email}/`
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
      const response = await axios.post(
        `http://127.0.0.1:8000/get_user_ownedCrypto/${email}/`
      );

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
      console.log("거래 내역 전송 성공", response.data);
    } catch (error) {
      console.log("거래 내역 전송 실패", error);
    }
  }

  // 서버로부터 거래 내역을 받아옴
  const getTradeHistory = async (email: string) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/get_user_tradeHistory/${email}/`
      );

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

      const tradeHistory = response.data.trade_history;

      // 다른 요소는 서버에서 받아온 값 그대로 유지, 거래 시간만 형식 변경해서 dispatch
      tradeHistory.forEach((item: { trade_time: Date, is_signed: boolean, id: string, crypto_price: number, crypto_name: string, trade_amount: string, trade_price: string, trade_category: string }, i: number) => {
        let date = new Date(item.trade_time);
        let formattedDate = date.getFullYear() + '.'
          + (date.getMonth() + 1).toString().padStart(2, '0') + '.'
          + date.getDate().toString().padStart(2, '0') + ' '
          + date.getHours().toString().padStart(2, '0') + ':'
          + date.getMinutes().toString().padStart(2, '0');

        // 체결 여부가 true일 경우
        if (item.is_signed) {
          signed.push({ ...item, trade_time: formattedDate });
        }
        else {
          unSigned.push({ ...item, trade_time: formattedDate });

          const value = { name: item.crypto_name, price: item.crypto_price, trade_category: item.trade_category, trade_amount: Number(item.trade_amount), trade_price: Number(item.trade_price) };
          localStorage.setItem(item.id, JSON.stringify(value));  // 체결되지 않은 구매 요청에 대한 ID를 로컬 스토리지에 추가
        }
      });

      dispatch(setUserTradeHistory(signed));
      dispatch(setUserTradeHistory_unSigned(unSigned));
    } catch (error) {
      console.log("거래내역 받아오기 실패", error);
    }
  }

  // 모든 화폐의 이름을 받아옴
  const getCryptoName = (email: string) => {
    (async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/get_crypto_name/'
        );

        let cryptoNames = response.data.detail;

        let localStorageItem: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          let key = localStorage.key(i);
          if (key !== null) {
            let value = localStorage.getItem(key);
            if (value !== null) {
              let item = JSON.parse(value);
              localStorageItem.push(item.name);
            }
          }
        }

        // 로컬 스토리지의 값에 있는(체결되지 않은) 화폐는 true로, 아니라면 false로 선언
        let isWaitingTemp = cryptoNames.reduce((obj: { [obj: string]: boolean; }, name: string) => {
          if (localStorageItem.includes(name)) {
            obj[name] = true;
          }
          else {
            obj[name] = false;
          }
          return obj;
        }, {})

        dispatch(setIsBuying(isWaitingTemp));
        dispatch(setIsSelling(isWaitingTemp));
        localStorage.setItem(`${email}_IsBuying`, JSON.stringify(isWaitingTemp));
        localStorage.setItem(`${email}_IsSelling`, JSON.stringify(isWaitingTemp));
      } catch (error) {
        throw error;
      }
    })();
  }

  // 선택된 화폐에 대한 호가내역 호출
  const selectAskingPrice = (market: string) => {
    (async (market) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/asking_price/",
          {
            market: market,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
        throw error;
      }
    })(market);
  };

  // useEffect(() => {
  //   setInterval(() => {
  //     selectAskingPrice('KRW-BTC')
  //   }, 1000)
  // }, []);

  // 미체결 화폐에 대한 호가내역 호출
  const selectAskingPrice_unSigned = (market: string) => {
    (async (market) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/asking_price/",
          {
            market: market,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("호가내역-미체결 : ", response.data[0]);

        let tempState = response.data[0].orderbook_units.map((item: { ask_price: number; bid_price: number; }) => ({
          ask_price: item.ask_price,
          bid_price: item.bid_price
        }));

        // dispatch(setAskingData_unSigned({ market: response.data[0].market, data: tempState }));

        // 마켓명에 대응하는 화폐명을 찾음
        let isCorresponed = filteredData.find(item => item.market === response.data[0].market);
        let marketName = isCorresponed ? isCorresponed.name : null;

        // 마켓명이 아닌 화폐명을 키로 지정
        if (marketName) {
          dispatch(setAskingData_unSigned({ market: marketName, data: tempState }));
        }

        // console.log("미체결 호가값 : ", askingData_unSigned);
      } catch (error) {
        // console.error("호가내역-미체결 전송 실패", error);
      }
    })(market);
  };

  // 호가와 구매가가 일치하지 않을 때
  const buyCrypto_unSigned = (key: string, email: string, cryptoName: string, cryptoQuantity: number, buyTotal: number) => {
    (async (key, email, cryptoName, cryptoQuantity, buyTotal) => {
      try {
        await axios.post("http://127.0.0.1:8000/buy_crypto_unSigned/", {
          key: key,
          email: email,
          crypto_name: cryptoName,
          crypto_quantity: cryptoQuantity,
          buy_total: buyTotal,
        });
        // console.log("구매 화폐 전송 성공", response.data);
        getBalance(email);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
        // getOwnedCrypto(email);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
        getTradeHistory(email)  // 매수에 성공했으니 거래내역 업데이트
        localStorage.removeItem(key)
      } catch (error) {
        // console.log("구매 화폐 전송 실패: ", error)
      }
    })(key, email, cryptoName, cryptoQuantity, buyTotal);
  }

  const sellCrypto_unSigned = (key: string, email: string, cryptoName: string, cryptoQuantity: number, sellTotal: number) => {
    (async (key, email, cryptoName, cryptoQuantity, sellTotal) => {
      try {
        await axios.post("http://127.0.0.1:8000/sell_crypto_unSigned/", {
          key: key,
          email: email,
          crypto_name: cryptoName,
          crypto_quantity: cryptoQuantity,
          sell_total: sellTotal,
        });
        // console.log("매도 화폐 전송 성공", response.data);
        getBalance(email);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
        // getOwnedCrypto(email);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
        getTradeHistory(email)  // 매수에 성공했으니 거래내역 업데이트
        localStorage.removeItem(key)
      } catch (error) {
        // console.log("매도 화폐 전송 실패: ", error)
      }
    })(key, email, cryptoName, cryptoQuantity, sellTotal);
  }

  // 선택된 화폐에 대한 체결내역 호출
  const selectClosedPrice = (market: string) => {
    (async (market) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/closed_price/",
          {
            market: market,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        dispatch(setClosed_data(response.data));
      } catch (error) {
        throw error;
      }
    })(market);
  };

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 분에 따라)
  const requestCandleMinute = (market: string, minute: string) => {
    (async (market, minute) => {
      if (minute !== '') {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/candle_per_minute/",
            {
              market: market,
              minute: minute,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          dispatch(setCandle_per_minute(response.data));
        } catch (error) {
          throw error;
        }
      }
    })(market, minute);
  };

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 일/주/월에 따라)
  const requestCandleDate = (market: string) => {
    if (chartSortDate === "1일") {
      (async (market) => {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/candle_per_date/",
            {
              market: market,
              // date: tempChartSort,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          dispatch(setCandle_per_date(response.data));
        } catch (error) {
          throw error;
        }
      })(market);
    } else if (chartSortDate === "1주") {
      void (async (market) => {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/candle_per_week/",
            {
              market: market,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          dispatch(setCandle_per_week(response.data));
        } catch (error) {
          throw error;
        }
      })(market);
    } else if (chartSortDate === "1개월") {
      void (async (market) => {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/candle_per_month/",
            {
              market: market,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          dispatch(setCandle_per_month(response.data));
        } catch (error) {
          throw error;
        }
      })(market);
    }
  };

  // 로그인한 사용자에 대해 관심 화폐를 업데이트
  const addCryptoToUser = (email: string, cryptoName: string) => {
    if (user.email !== "") {
      (async (email, cryptoName) => {
        try {
          axios.post("http://127.0.0.1:8000/add_favoriteCrypto_to_user/", {
            email: email,
            crypto_name: cryptoName,
          });
        } catch (error) {
          throw error;
        }
      })(email, cryptoName);
    }
  };

  return {
    getAllCrypto,
    getInitialData,
    getBalance,
    getOwnedCrypto,
    addTradeHistory,
    getTradeHistory,
    getCryptoName,
    selectAskingPrice,
    selectAskingPrice_unSigned,
    buyCrypto_unSigned,
    sellCrypto_unSigned,
    selectClosedPrice,
    requestCandleMinute,
    requestCandleDate,
    addCryptoToUser,
    checkLogin,
  };

}