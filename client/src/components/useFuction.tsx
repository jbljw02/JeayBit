import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserWallet, RootState, setOwnedCrypto, setUserTradeHistory, setUserTradeHistory_unSigned, setIsBuying, setAsking_data, setAsking_dateTime, setAsking_totalAskSize, setAsking_totalBidSize, setAskingData_unSigned, setIsSelling, setTheme } from "../store";

export default function useFunction() {

  const dispatch = useDispatch();
  const logInEmail = useSelector((state: RootState) => state.logInEmail);
  const filteredData = useSelector((state: RootState) => state.filteredData);
  const theme = useSelector((state: RootState) => state.theme);

  // 서버로부터 사용자의 잔고량을 받아옴
  const getBalance = (email: string) => {
    (async () => {
      try {
        const response = await axios.get(
          `https://jeaybit.site/get_user_balance/${email}/`
        );
        dispatch(setUserWallet(response.data.user_balance));
        // console.log(logInUser, "의 잔고 : ", response.data.user_balance);
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
          `https://jeaybit.site/get_user_ownedCrypto/${logInEmail}/`
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
        const response = await axios.post("https://jeaybit.site/add_user_tradeHistory/", {
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
          `https://jeaybit.site/get_user_tradeHistory/${logInEmail}/`
        );
        console.log("반환값-거래내역 : ", response.data);

        // 서버로부터 받아온 체결 내역과 미체결 내역을 담을 임시 배열
        const signed: { trade_time: string; is_signed: boolean; id: string; crypto_price: number; crypto_name: string; trade_amount: string; trade_price: string; }[] = [];
        const unsigned: { trade_time: string; is_signed: boolean; id: string; crypto_price: number; crypto_name: string; trade_amount: string; trade_price: string; }[] = [];

        // 다른 요소는 서버에서 받아온 값 그대로 유지, 거래 시간만 형식 변경해서 dispatch
        response.data.forEach((item: { trade_time: Date, is_signed: boolean, id: string, crypto_price: number, crypto_name: string, trade_amount: string, trade_price: string }, i: number) => {
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
            unsigned.push({ ...item, trade_time: formattedDate });
        
            let value = { name: item.crypto_name, price: item.crypto_price, trade_amount: Number(item.trade_amount), trade_price: Number(item.trade_price) };
            localStorage.setItem(item.id, JSON.stringify(value));  // 체결되지 않은 구매 요청에 대한 ID를 로컬 스토리지에 추가
          }
        });

        dispatch(setUserTradeHistory(signed));
        dispatch(setUserTradeHistory_unSigned(unsigned));
      } catch (error) {
        console.log("거래내역 받아오기 실패", error);
      }
    })();
  }

  // 모든 화폐의 이름을 받아옴
  const getCryptoName = (logInEmail: string) => {
    (async () => {
      try {
        const response = await axios.get(
          'https://jeaybit.site/get_crypto_name/'
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
        localStorage.setItem(`${logInEmail}_IsBuying`, JSON.stringify(isWaitingTemp));
        localStorage.setItem(`${logInEmail}_IsSelling`, JSON.stringify(isWaitingTemp));
      } catch (error) {
        console.log("화폐명 받아오기 실패", error);
      }
    })();
  }

  // 선택된 화폐에 대한 호가내역 호출
  const selectAskingPrice = (market: string) => {
    (async (market) => {
      try {
        const response = await axios.post(
          "https://jeaybit.site/asking_price/",
          {
            market: market,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("호가내역 : ", response.data[0].orderbook_units);
        dispatch(setAsking_data(response.data[0].orderbook_units));
        dispatch(setAsking_dateTime(response.data[0].timestamp));
        dispatch(setAsking_totalAskSize(response.data[0].total_ask_size));
        dispatch(setAsking_totalBidSize(response.data[0].total_bid_size));
      } catch (error) {
        console.error("호가내역 전송 실패", error);
      }
    })(market);
  };

  // 미체결 화폐에 대한 호가내역 호출
  const selectAskingPrice_unSigned = (market: string) => {
    (async (market) => {
      try {
        const response = await axios.post(
          "https://jeaybit.site/asking_price/",
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
        console.error("호가내역-미체결 전송 실패", error);
      }
    })(market);
  };

  // 호가와 구매가가 일치하지 않을 때
  const buyCrypto_unSigned = (key: string, email: string, cryptoName: string, cryptoQuantity: number, buyTotal: number) => {
    (async (key, email, cryptoName, cryptoQuantity, buyTotal) => {
      try {
        const response = await axios.post("https://jeaybit.site/buy_crypto_unSigned/", {
          key: key,
          email: email,
          crypto_name: cryptoName,
          crypto_quantity: cryptoQuantity,
          buy_total: buyTotal,
        });
        console.log("구매 화폐 전송 성공", response.data);
        getBalance(logInEmail);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
        getOwnedCrypto(logInEmail);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
        getTradeHistory(logInEmail)  // 매수에 성공했으니 거래내역 업데이트
        localStorage.removeItem(key)
      } catch (error) {
        console.log("구매 화폐 전송 실패: ", error)
      }
    })(key, email, cryptoName, cryptoQuantity, buyTotal);
  }

  const sellCrypto_unSigned = (key: string, email: string, cryptoName: string, cryptoQuantity: number, sellTotal: number) => {
    (async (key, email, cryptoName, cryptoQuantity, sellTotal) => {
      try {
        const response = await axios.post("https://jeaybit.site/sell_crypto_unSigned/", {
          key: key,
          email: email,
          crypto_name: cryptoName,
          crypto_quantity: cryptoQuantity,
          sell_total: sellTotal,
        });
        console.log("매도 화폐 전송 성공", response.data);
        getBalance(logInEmail);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
        getOwnedCrypto(logInEmail);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
        getTradeHistory(logInEmail)  // 매수에 성공했으니 거래내역 업데이트
        localStorage.removeItem(key)
      } catch (error) {
        console.log("매도 화폐 전송 실패: ", error)
      }
    })(key, email, cryptoName, cryptoQuantity, sellTotal);
  }

  const themeChange = () => {

    dispatch(setTheme(!theme));
    let generalTheme = document.querySelectorAll(".lightMode, .darkMode");
    let titleTheme = document.querySelectorAll(
      ".lightMode-title, .darkMode-title"
    );
    let titleImgTheme = document.querySelectorAll(
      ".title-img-light, .title-img-dark"
    );
    let hoverTheme = document.querySelectorAll(
      ".hover-lightMode, .hover-darkMode"
    );

    // 라이트모드 <-> 다크모드 순회
    generalTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("lightMode");
        element.classList.add("darkMode");
      } else {
        element.classList.remove("darkMode");
        element.classList.add("lightMode");
      }
    });

    titleTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("lightMode-title");
        element.classList.add("darkMode-title");
      } else {
        element.classList.remove("darkMode-title");
        element.classList.add("lightMode-title");
      }
    });

    titleImgTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("title-img-light");
        element.classList.add("title-img-dark");
      } else {
        element.classList.remove("title-img-dark");
        element.classList.add("title-img-light");
      }
    });

    hoverTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("hover-lightMode");
        element.classList.add("hover-darkMode");
      } else {
        element.classList.remove("hover-darkMode");
        element.classList.add("hover-lightMode");
      }
    });
  };

  return { getBalance, getOwnedCrypto, addTradeHistory, getTradeHistory, getCryptoName, selectAskingPrice, selectAskingPrice_unSigned, buyCrypto_unSigned, sellCrypto_unSigned, themeChange };

}