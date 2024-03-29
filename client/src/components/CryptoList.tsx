import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  setFilteredData,
  setStar,
  Crypto,
  setCr_name_selected,
  setCr_market_selected,
  setSortedData,
  setCandle_per_date,
  setCandle_per_week,
  setCandle_per_month,
  setCandle_per_minute,
  setCr_name,
  setCr_price,
  setCr_market,
  setCr_change,
  setCr_change_rate,
  setCr_change_price,
  setCr_trade_price,
  setCr_trade_volume,
  setCr_open_price,
  setCr_high_price,
  setCr_low_price,
  setCandle_per_date_BTC,
  setClosed_data,
  setCr_selected,
  setFavoriteCrypto,
  setBuyingPrice,
  setLogInEmail,
  setLogInUser,
  setSellingPrice,
} from "../store";
import { useEffect, useState } from "react";
import img_sort from "../assets/images/sort.png";
import img_sort_up from "../assets/images/sort-up.png";
import img_sort_down from "../assets/images/sort-down.png";
import starOn from "../assets/images/star-on.png";
import starOff from "../assets/images/star-off.png";
import axios from "axios";
import useFunction from "./useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const CryptoList = () => {

  const dispatch = useDispatch();

  const cr_name = useSelector((state: RootState) => state.cr_name);
  const cr_price = useSelector((state: RootState) => state.cr_price);
  const cr_market = useSelector((state: RootState) => state.cr_market);
  const cr_change = useSelector((state: RootState) => state.cr_change);
  const cr_change_rate = useSelector((state: RootState) => state.cr_change_rate);
  const cr_change_price = useSelector((state: RootState) => state.cr_change_price);
  const cr_trade_price = useSelector((state: RootState) => state.cr_trade_price);
  const cr_trade_volume = useSelector((state: RootState) => state.cr_trade_volume);
  const cr_open_price = useSelector((state: RootState) => state.cr_open_price);
  const cr_high_price = useSelector((state: RootState) => state.cr_high_price);
  const cr_low_price = useSelector((state: RootState) => state.cr_low_price);
  const star = useSelector((state: RootState) => state.star);
  const filteredData = useSelector((state: RootState) => state.filteredData);
  const cr_market_selected = useSelector((state: RootState) => state.cr_market_selected);

  // 검색값을 관리하기 위한 state
  const [search_cr, setSearch_cr] = useState<string>("");

  // 차례로 화폐명, 현재가, 전일대비, 거래대금의 정렬 상태를 관리
  const [sort_states, setSort_states] = useState<number[]>([0, 0, 0, 0]);

  // 정렬하려는 목적에 따라 이미지를 변경하기 위해 배열로 생성
  const sort_images = [img_sort, img_sort_down, img_sort_up];

  const selectedChartSort = useSelector((state: RootState) => state.selectedChartSort);
  const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
  const ownedCrypto = useSelector((state: RootState) => state.ownedCrypto);
  const isBuying = useSelector((state: RootState) => state.isBuying);

  const [selectedCrypto, setSelectedCrypto] = useState<any>();
  // eslint-disable-next-line
  const [userSelectedCrypto, setUserSelectedCrypto] = useState<any>();

  const logInEmail = useSelector((state: RootState) => state.logInEmail);

  const favoriteCrypto = useSelector((state: RootState) => state.favoriteCrypto);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [listCategory, setListCategory] = useState<string>("원화");

  // 화폐 가격을 업데이트 하기 전에 해당 state에 담음
  const [prevData, setPrevData] = useState<number[]>();

  // 이전 화폐 가격과 현재 화폐 가격을 비교하여 변화가 발생한 화폐를 저장할 state
  const [differences, setDifferences] = useState<
    {
      index: number;
      oldValue: number;
      newValue: number;
    }[]
  >([]);

  const { getOwnedCrypto, getTradeHistory, selectAskingPrice, getCryptoName, selectAskingPrice_unSigned } = useFunction();

  const getAskingPrice_unSigned = () => {

    // Object.entries = 객체를 [key, value]쌍의 배열로 변환 
    let unSignedCrypto = Object.entries(isBuying)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key)

    // 마켓명으로 요청을 보내야 하기 때문에, 화폐명을 마켓명으로 변경
    let unSignedMarket: (string | null)[] = unSignedCrypto.map((name) => {
      let isCorresponed = filteredData.find(isCorresponed => isCorresponed.name === name)
      return isCorresponed ? isCorresponed.market : null
    })

    for (let i = 0; i < unSignedMarket.length; i++) {
      if (unSignedMarket[i]) {
        selectAskingPrice_unSigned(unSignedMarket[i] as string);
      }
    }

    return unSignedMarket;
  }

  useEffect(() => {
    // const 변수 = setInterval(() => { 콜백함수, 시간 })
    // fetchData 함수를 1초마다 실행 - 서버에서 받아오는 값을 1초마다 갱신시킴
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    initialData();

    // clearInterval(변수)
    // setInterval이 반환하는 interval ID를 clearInterval 함수로 제거
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // 별 이미지를 클릭할 때마다 서버로부터 관심 화폐에 대한 정보 받아옴
  useEffect(() => {
    if (logInEmail !== '') {
      getFavoriteCrypto(logInEmail);
    }
    // eslint-disable-next-line
  }, [isFavorited]);

  // 화면에 보여질 초기 화폐의 차트(비트코인)
  const initialData = async () => {
    try {
      const response = await axios.get("https://jeaybit.site/get_data/");
      dispatch(setCandle_per_date_BTC(response.data.candle_btc_date));
      dispatch(setCr_market_selected(response.data.market[0]));
      dispatch(setCr_name_selected(response.data.name[0]));
    } catch (error) {
      // console.error(error);
    }
  };

  // 비동기 함수 async를 이용하여 데이터를 받아오는 동안에도 다른 작업을 가능하게 함
  // = async function () {}
  const fetchData = async () => {
    try {
      const response = await axios.get("https://jeaybit.site/get_data/");
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
      // console.error(error);
    }
  };

  // 필터링 및 정렬된 데이터를 새로운 배열로 생성 -> setFilteredData로 상태를 업데이트
  // price = 숫자형, f_price = 문자형 / 숫자형으로 정렬, 문자형으로 출력
  const updatedData = cr_name.map((name, i) => ({
    name,
    price: cr_price[i],
    market: cr_market[i],
    change: cr_change[i],
    change_rate: cr_change_rate[i],
    change_price: cr_change_price[i],
    trade_price: cr_trade_price[i],
    trade_volume: cr_trade_volume[i],
    open_price: cr_open_price[i],
    high_price: cr_high_price[i],
    low_price: cr_low_price[i],
    star: star[i],
    // 검색어에 해당하는 데이터를 비교하여 배열을 재생성
  })).filter((item) =>
    item.name.toLowerCase().includes(search_cr.toLowerCase())
  );

  // useEffect(() => {
  //   if (filteredData.length === 0 && updatedData.length > 0) {
  //     dispatch(setFilteredData(updatedData));
  //   }
  // });

  // 화폐 가격의 변화를 감지하고 이전 값과 비교하여 변화가 생긴 값을 상태에 업데이트
  useEffect(() => {
    setPrevData(cr_price); // state의 업데이트는 비동기적이기 때문에 값이 즉시 바뀌지 않음. 그러므로 이 useEffect() 안에서 prevData는 아직 이전의 값을 가지고 있기 때문에 cr_price와 prevData는 다른 값을 가짐. (cr_price = 현재값, prevData = 이전값)

    let newDifferences: {
      index: number;
      oldValue: number;
      newValue: number;
    }[] = [];

    // 화폐 리스트가 변할 때마다 변화 이전 값과 현재 값을 비교
    if (prevData !== undefined) {
      prevData.forEach((value, index) => {
        if (value !== cr_price[index]) {
          newDifferences.push({
            index: index,
            oldValue: value,
            newValue: cr_price[index],
          });
        }
      });
    }
    setDifferences(newDifferences);

    // 별도로 선택한 화폐가 있을 때
    if (selectedCrypto) {
      const newSelectedCrypto = filteredData.find(
        (crypto) => crypto.name === selectedCrypto.name
      );
      if (newSelectedCrypto) {
        setSelectedCrypto(newSelectedCrypto);
        setUserSelectedCrypto(newSelectedCrypto);
        dispatch(setCr_selected(newSelectedCrypto));
      }
      // 호가 및 체결내역 호출
      selectClosedPrice(selectedCrypto.market);
      selectAskingPrice(selectedCrypto.market);

      getAskingPrice_unSigned();

    }
    // 선택한 화폐가 없을 때(비트코인의 정보 출력)
    else {
      if (filteredData.length > 0) {
        const initial_newSelectedCrypto = filteredData[0];
        if (initial_newSelectedCrypto) {
          setSelectedCrypto(initial_newSelectedCrypto); // 해당 코드 때문에 '비트코인'이 강제 선택됨. 즉, if문 조건 성립
          dispatch(setCr_selected(initial_newSelectedCrypto));
          dispatch(setBuyingPrice(initial_newSelectedCrypto.price));
          dispatch(setSellingPrice(initial_newSelectedCrypto.price));
        }
      }
    }
    // 차트에 실시간 데이터를 전달(시간당)
    if (filteredData.length > 0 && selectedCrypto) {
      if (selectedCrypto.name && selectedCrypto.market === "KRW-BTC") {
        selectMarket_time(cr_market_selected, chartSortTime);
      } else {
        selectMarket_time(cr_market_selected, chartSortTime);
      }
    }
    // eslint-disable-next-line
  }, [filteredData]);

  // 리스트에 있는 화폐 검색시 업데이트
  useEffect(() => {
    // fetchData();
    dispatch(setFilteredData(updatedData));
    // eslint-disable-next-line
  }, [search_cr, cr_price]);

  useEffect(() => {
    if (cr_market_selected) {
      selectMarket_date(cr_market_selected);
      // selectMarket_time(cr_market_selected, chartSortTime);
    }
    // eslint-disable-next-line
  }, [cr_market_selected, chartSortDate, chartSortTime]);

  // 화면이 첫 렌더링 될 때마다 
  useEffect(() => {
    const userItem = localStorage.getItem('user');
    if (userItem !== null) {
      const user = JSON.parse(userItem);
      if (user) {
        dispatch(setLogInUser(user.username));
        dispatch(setLogInEmail(user.email));
        getFavoriteCrypto(user.email);
        getOwnedCrypto(user.email);
        getTradeHistory(user.email);
        getCryptoName(user.email);

        getAskingPrice_unSigned()
      }
    }
    // eslint-disable-next-line
  }, [])

  // 선택된 화폐에 대한 체결내역 호출
  const selectClosedPrice = (market: string) => {
    (async (market) => {
      try {
        const response = await axios.post(
          "https://jeaybit.site/closed_price/",
          {
            market: market,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("체결내역 : ", response.data);
        dispatch(setClosed_data(response.data));
      } catch (error) {
        // console.error("체결내역 호출 실패", error);
      }
    })(market);
  };


  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 분에 따라)
  const selectMarket_time = (market: string, minute: string) => {
    (async (market, minute) => {
      if (minute !== '') {
        try {
          const response = await axios.post(
            "https://jeaybit.site/candle_per_minute/",
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
          // console.log(chartSortTime, "당 요청값: ", response.data);
          dispatch(setCandle_per_minute(response.data));
        } catch (error) {
          // console.error("분당 캔들 호출 실패", error);
        }
      }
    })(market, minute);
  };

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 일자에 따라)
  const selectMarket_date = (market: string) => {
    if (chartSortDate === "1일") {
      (async (market) => {
        try {
          const response = await axios.post(
            "https://jeaybit.site/candle_per_date/",
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

          // console.log("1일 요청된 값 : ", response.data)
          dispatch(setCandle_per_date(response.data));
        } catch (error) {
          // console.error("1일당 캔들 호출 실패", error);
        }
      })(market);
    } else if (chartSortDate === "1주") {
      void (async (market) => {
        try {
          const response = await axios.post(
            "https://jeaybit.site/candle_per_week/",
            {
              market: market,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // console.log("1주 요청된 값 : ", response.data)
          dispatch(setCandle_per_week(response.data));
        } catch (error) {
          // console.error("1주당 캔들 호출 실패", error);
        }
      })(market);
    } else if (chartSortDate === "1개월") {
      void (async (market) => {
        try {
          const response = await axios.post(
            "https://jeaybit.site/candle_per_month/",
            {
              market: market,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // console.log("1개월 요청된 값 : ", response.data)
          dispatch(setCandle_per_month(response.data));
        } catch (error) {
          // console.error("1개월당 호출 실패", error);
        }
      })(market);
    }
  };

  // 별 이미지를 클릭하면 on off
  const starClick = (index: number) => {
    dispatch(setStar(index));
    setIsFavorited(!isFavorited);
  };

  // 로그인한 사용자에 대해 관심 화폐를 업데이트
  const addCryptoToUser = (email: string, cryptoName: string) => {
    if (logInEmail !== "") {
      (async (email, cryptoName) => {
        try {
          axios.post("https://jeaybit.site/add_favoriteCrypto_to_user/", {
            email: email,
            crypto_name: cryptoName,
          });
        } catch (error) {
          // console.log("관심 화폐 정보 전송 실패");
        }
      })(email, cryptoName);
    } else {
      alert("사용자 존재X");
    }
  };

  // 로그인한 사용자에 대한 관심 화폐 정보를 받아옴
  const getFavoriteCrypto = (logInEmail: string) => {
    (async () => {
      try {
        const response = await axios.get(
          `https://jeaybit.site/get_user_favoriteCrypto/${logInEmail}/`
        );
        // console.log("반환값-관심화폐 : ", response.data);
        dispatch(setFavoriteCrypto(response.data));
      } catch (error) {
        // console.log("관심 화폐 정보 받아오기 실패", error);
      }
    })();
  };

  // 정렬 이미지 클릭 이벤트
  const sortClick = (index: number) => {
    // 정렬 이미지 순환
    setSort_states((prevStates) => {
      const states_copy = [...prevStates];
      states_copy[index] = (states_copy[index] + 1) % sort_images.length;

      let sortedData = [...filteredData];

      // 화폐를 전일대비 상승/동결/하락 여부에 따라 구분
      // 값 자체에 양수, 음수 구분이 되어있는 것이 아니기 때문에 정렬하기 전에 구분을 지어줘야 함
      let rise_crypto: Crypto[] = [];
      let even_crypto: Crypto[] = [];
      let fall_crypto: Crypto[] = [];

      // 상승/동결/하락 여부에 따라 구분하여 새 배열 생성
      sortedData.forEach((item) => {
        rise_crypto = sortedData.filter((item) => item.change === "RISE");
        even_crypto = sortedData.filter((item) => item.change === "EVEN");
        fall_crypto = sortedData.filter((item) => item.change === "FALL");
      });

      switch (index) {
        // 화폐 이름순 정렬
        case 0:
          if (states_copy[index] === 0) {
            states_copy[index] = 1;
          }
          if (states_copy[index] === 1) {
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            // dispatch(setFilteredData(sortedData));

            sort_states[1] = 0;
            sort_states[2] = 0;
            sort_states[3] = 0;
          }
          if (states_copy[index] === 2) {
            sortedData.sort((a, b) => b.name.localeCompare(a.name));
            // dispatch(setFilteredData(sortedData));

            sort_states[1] = 0;
            sort_states[2] = 0;
            sort_states[3] = 0;
          }
          break;

        // 화폐 가격순 정렬
        case 1:
          if (states_copy[index] === 0) {
            states_copy[index] = 1;
          }
          if (states_copy[index] === 1) {
            sortedData.sort((a, b) => b.price - a.price);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[2] = 0;
            sort_states[3] = 0;
          }
          if (states_copy[index] === 2) {
            sortedData.sort((a, b) => a.price - b.price);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[2] = 0;
            sort_states[3] = 0;
          }
          break;

        // 화폐 전일대비 변화순 정렬
        case 2:
          if (states_copy[index] === 0) {
            states_copy[index] = 1;
          }
          if (states_copy[index] === 1) {
            rise_crypto.sort((a, b) => b.change_rate - a.change_rate);
            even_crypto.sort((a, b) => b.change_rate - a.change_rate);
            fall_crypto.sort((a, b) => a.change_rate - b.change_rate);

            // 새 배열을 원본 배열의 카피본에 병합 - 내림차순이기 때문에 상승, 동결, 하락순으로 병합
            sortedData = [...rise_crypto, ...even_crypto, ...fall_crypto];
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[3] = 0;
          }
          if (states_copy[index] === 2) {
            fall_crypto.sort((a, b) => b.change_rate - a.change_rate);
            even_crypto.sort((a, b) => b.change_rate - a.change_rate);
            rise_crypto.sort((a, b) => a.change_rate - b.change_rate);

            // 새 배열을 원본 배열의 카피본에 병합 - 오름차순이기 때문에 하락, 동결, 상승순으로 병합
            sortedData = [...fall_crypto, ...even_crypto, ...rise_crypto];
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[3] = 0;
          }
          break;

        // 거래대금순 정렬
        case 3:
          if (states_copy[index] === 0) {
            states_copy[index] = 1;
          }
          if (states_copy[index] === 1) {
            sortedData.sort((a, b) => b.trade_price - a.trade_price);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[2] = 0;
          }
          if (states_copy[index] === 2) {
            sortedData.sort((a, b) => a.trade_price - b.trade_price);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[2] = 0;
          }
          break;
      }
      dispatch(setFilteredData(sortedData));
      dispatch(setSortedData(sortedData));

      return states_copy;
    });
  };

  // 각 값들을 테이블에서 클릭한 화폐의 정보로 변경
  const nameSelect = (value: string) => {
    dispatch(setCr_name_selected(value));
  };
  const marketSelect = (value: string) => {
    dispatch(setCr_market_selected(value));
  };

  return (
    <div className="lightMode">
      {/* 검색 공간 */}
      <div className="list-search lightMode">
        {/* <img className="img-search" src={search}></img> */}
        <svg
          className="img-search"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 18"
          width="30"
          height="30"
        >
          <path
            fill="currentColor"
            d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"
          ></path>
        </svg>
        <input
          type="text"
          className="crypto-search lightMode"
          placeholder="검색"
          value={search_cr}
          onChange={(e) => setSearch_cr(e.target.value)}
        ></input>
      </div>

      {/* 원화, 보유, 관심 선택란 */}
      <div className="list-category">
        <span
          className={`${listCategory === "원화" ? "list-category-clicked" : ""
            }`}
          onClick={() => setListCategory("원화")}
        >
          원화
        </span>
        <span
          className={`${listCategory === "보유" ? "list-category-clicked" : ""
            }`}
          onClick={() => setListCategory("보유")}
        >
          보유
        </span>
        <span
          className={`${listCategory === "관심" ? "list-category-clicked" : ""
            }`}
          onClick={() => setListCategory("관심")}
        >
          관심
        </span>
      </div>

      {/* 화폐 정보 테이블 */}
      {/* 스크롤바를 넣기 위해 테이블을 두 개로 구성 */}
      <table className="list-table" id="listHead">
        <colgroup>
          <col width={150} />
          <col width={90} />
          <col width={90} />
          <col width={90} />
        </colgroup>
        <thead className="list-thead lightMode">
          <tr className="lightMode-title">
            {
              listCategory !== '보유' ?
                <>
                  <th className="name" onClick={() => sortClick(0)}>
                    화폐명&nbsp;
                    <img
                      className="sort"
                      src={sort_images[sort_states[0]]}
                      alt="화폐명"
                    ></img>
                  </th>
                  <th className="price" onClick={() => sortClick(1)}>
                    현재가&nbsp;
                    <img
                      className="sort"
                      src={sort_images[sort_states[1]]}
                      alt="현재가"
                    ></img>
                  </th>
                  <th className="compare" onClick={() => sortClick(2)}>
                    전일대비&nbsp;
                    <img
                      className="sort"
                      src={sort_images[sort_states[2]]}
                      alt="전일대비"
                    ></img>
                  </th>
                  <th className="volume" onClick={() => sortClick(3)}>
                    거래대금&nbsp;
                    <img
                      className="sort"
                      src={sort_images[sort_states[3]]}
                      alt="거래대금"
                    ></img>
                  </th>
                </> :
                <>
                  <th className="name" id="owned-name" onClick={() => sortClick(0)}>
                    화폐명&nbsp;
                    <img
                      className="sort"
                      src={sort_images[sort_states[0]]}
                      alt="화폐명"
                    ></img>
                  </th>
                  <th className="price" id="owned-price" onClick={() => sortClick(1)}>
                    현재가&nbsp;
                    <img
                      className="sort"
                      src={sort_images[sort_states[1]]}
                      alt="현재가"
                    ></img>
                  </th>
                  <th className="compare" id="owned-compare" onClick={() => sortClick(2)}>
                    전일대비&nbsp;
                    <img
                      className="sort"
                      src={sort_images[sort_states[2]]}
                      alt="전일대비"
                    ></img>
                  </th>
                  <th className="volume" id="owned-volume" onClick={() => sortClick(2)}>
                    보유수량&nbsp;
                    <img
                      className="sort"
                      src={sort_images[sort_states[2]]}
                      alt="보유수량"
                    ></img>
                  </th>
                </>
            }
          </tr>
        </thead>
      </table>
      {
        listCategory === "원화" ? (
          <PerfectScrollbar className="scrollBar-listTable">
            <table className="list-table">
              <colgroup>
                <col width={150} />
                <col width={90} />
                <col width={90} />
                <col width={90} />
              </colgroup>
              <tbody className="scrollable-tbody">
                {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
                {filteredData.map((item, i) => {

                  // 가격의 변화가 생긴 state를 테이블에서 찾아 해당 td 시각화
                  let isChanged = differences.some((diff, index) => {
                    return diff.index === i && diff.newValue === item.price;
                  });
                  let priceClass_rise = isChanged ? "change-price-rise" : "";
                  let priceClass_fall = isChanged ? "change-price-fall" : "";

                  // DB에서 가져온 관심화폐 목록과 일치하는 행을 찾음
                  let isFavorited =
                    Array.isArray(favoriteCrypto) &&
                    favoriteCrypto.some((diff, index) => {
                      return item.name === diff.crypto_name;
                    });

                  return (
                    <tr
                      key={i}
                      onClick={() => {
                        dispatch(setBuyingPrice(filteredData[i].price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매수가격'이 업데이트 됨
                        dispatch(setSellingPrice(filteredData[i].price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매도가격'이 업데이트 됨  

                        nameSelect(filteredData[i].name);
                        marketSelect(filteredData[i].market);
                        setSelectedCrypto(filteredData[i]);
                        selectMarket_date(filteredData[i].market);
                        selectMarket_time(
                          filteredData[i].market,
                          selectedChartSort
                        );
                        selectAskingPrice(filteredData[i].market);
                        selectClosedPrice(filteredData[i].market);
                      }}
                    >
                      <td className="td-name lightMode">
                        <span className="span-star">
                          <img
                            onClick={() => {
                              starClick(i);
                              addCryptoToUser(logInEmail, filteredData[i].name);
                            }}
                            // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                            // src={star[i] === 'starOn' ? starOn : starOff}
                            src={isFavorited ? starOn : starOff}
                            alt="star"
                          />
                        </span>
                        <div className="div-name">
                          <div>{item.name}</div>
                          <div>{item.market}</div>
                        </div>
                      </td>

                      {/* 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
                      {item.change === "RISE" ? (
                        <td className="lightMode">
                          <span className={`td-rise ${priceClass_rise}`}>
                            {item.price.toLocaleString()}
                          </span>
                        </td>
                      ) : item.change === "FALL" ? (
                        <td className="lightMode">
                          <span className={`td-fall ${priceClass_fall}`}>
                            {item.price.toLocaleString()}
                          </span>
                        </td>
                      ) : (
                        <td className="lightMode">
                          <span>{item.price.toLocaleString()}</span>
                        </td>
                      )}
                      {item.change === "RISE" ? (
                        <td className="lightMode">
                          <span className="td-rise">
                            +{(item.change_rate * 100).toFixed(2)}% <br />{" "}
                            {item.change_price.toLocaleString()}
                          </span>
                        </td>
                      ) : item.change === "FALL" ? (
                        <td className="lightMode">
                          <span className="td-fall">
                            -{(item.change_rate * 100).toFixed(2)}% <br />{" "}
                            {item.change_price.toLocaleString()}
                          </span>
                        </td>
                      ) : (
                        <td className="lightMode">
                          <span>
                            {(item.change_rate * 100).toFixed(2)}% <br />{" "}
                            {item.change_price.toLocaleString()}
                          </span>
                        </td>
                      )}
                      <td className="lightMode">
                        <span className="td-volume">
                          {Number(
                            String(Math.floor(item.trade_price)).slice(0, -6)
                          ).toLocaleString()}
                          백만
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </PerfectScrollbar>
        ) : listCategory === "보유" ? (
          logInEmail !== "" ? (
            // 보유 화폐 영역
            <PerfectScrollbar className="scrollBar-listTable">
              <table className="list-table">
                <colgroup>
                  <col width={150} />
                  <col width={90} />
                  <col width={90} />
                  <col width={90} />
                </colgroup>
                <tbody className="scrollable-tbody">
                  {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
                  {
                    filteredData.map((item, i) => {

                      // 가격의 변화가 생긴 state를 테이블에서 찾아 해당 td 시각화
                      let isChanged = differences.some((diff, index) => {
                        return diff.index === i && diff.newValue === item.price;
                      });
                      let priceClass_rise = isChanged ? "change-price-rise" : "";
                      let priceClass_fall = isChanged ? "change-price-fall" : "";

                      // DB에서 가져온 보유화폐 목록과 일치하는 행을 찾음
                      let isOwned =
                        Array.isArray(ownedCrypto) && ownedCrypto.some((diff, index) => {
                          return item.name === diff.crypto_name;
                        });

                      // 관심화폐는 시각화 해주기 위해 구분
                      let isFavorited =
                        Array.isArray(favoriteCrypto) && favoriteCrypto.some((diff, index) => {
                          return item.name === diff.crypto_name;
                        });


                      // 인덱스 한 번당 소유화폐를 순회시켜서 일치하는 요소를 찾고, 찾지 못한다면 ?를 이용해서 undefined를 반환
                      let ownedQuantity = String(Number(ownedCrypto.find((crypto) => item.name === crypto.crypto_name)?.quantity)?.toFixed(2))

                      let ownedMarket = (item.market).slice(4)

                      let userOwnedQuantity = ownedQuantity + ownedMarket;

                      // 전체 문자열의 길이가 12자리를 넘어갈 경우 12자리가 될 때 까지 마지막 인덱스 제거
                      while (userOwnedQuantity.length > 12) {
                        ownedQuantity = ownedQuantity.slice(0, -1);
                        userOwnedQuantity = ownedQuantity + ownedMarket;
                      }

                      // 마지막 인덱스가 '.'일 경우 제거
                      if (userOwnedQuantity.endsWith('.')) {
                        userOwnedQuantity = userOwnedQuantity.slice(0, -1);
                      }

                      return (
                        // 보유화폐만 출력
                        isOwned && (
                          <tr
                            key={i}
                            onClick={() => {
                              dispatch(setBuyingPrice(filteredData[i].price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매수가격'이 업데이트 됨
                              dispatch(setSellingPrice(filteredData[i].price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매더가격'이 업데이트 됨
                              nameSelect(filteredData[i].name);
                              marketSelect(filteredData[i].market);
                              setSelectedCrypto(filteredData[i]);
                              selectMarket_date(filteredData[i].market);
                              selectMarket_time(
                                filteredData[i].market,
                                selectedChartSort
                              );
                              selectAskingPrice(filteredData[i].market);
                              selectClosedPrice(filteredData[i].market);
                            }}>
                            <td className="td-name lightMode" id="owned-td-name">
                              <span className="span-star">
                                <img
                                  onClick={() => {
                                    starClick(i);
                                    addCryptoToUser(logInEmail, filteredData[i].name);
                                  }}
                                  // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                                  // src={star[i] === 'starOn' ? starOn : starOff}
                                  src={isFavorited ? starOn : starOff}
                                  alt="star"
                                />
                              </span>
                              <div className="div-name">
                                <div>{item.name}</div>
                                <div>{item.market}</div>
                              </div>
                            </td>

                            {/* 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
                            {
                              item.change === "RISE" ? (
                                <td className="lightMode" id="owned-td-price">
                                  <span className={`td-rise ${priceClass_rise}`}>
                                    {item.price.toLocaleString()}
                                  </span>
                                </td>
                              ) : item.change === "FALL" ? (
                                <td className="lightMode" id="owned-td-price">
                                  <span className={`td-fall ${priceClass_fall}`}>
                                    {item.price.toLocaleString()}
                                  </span>
                                </td>
                              ) : (
                                <td className="lightMode" id="owned-td-price">
                                  <span>{item.price.toLocaleString()}</span>
                                </td>
                              )}
                            {
                              item.change === "RISE" ? (
                                <td className="lightMode" id="owned-td-changeRate">
                                  <span className="td-rise">
                                    +{(item.change_rate * 100).toFixed(2)}% <br />{" "}
                                    {item.change_price.toLocaleString()}
                                  </span>
                                </td>
                              ) : item.change === "FALL" ? (
                                <td className="lightMode" id="owned-td-changeRate">
                                  <span className="td-fall">
                                    -{(item.change_rate * 100).toFixed(2)}% <br />{" "}
                                    {item.change_price.toLocaleString()}
                                  </span>
                                </td>
                              ) : (
                                <td className="lightMode" id="owned-td-changeRate">
                                  <span>
                                    {(item.change_rate * 100).toFixed(2)}% <br />{" "}
                                    {item.change_price.toLocaleString()}
                                  </span>
                                </td>
                              )}
                            <td className="lightMode" id="owned-td-quantity">
                              <span className="td-volume">
                                {userOwnedQuantity}
                              </span>
                            </td>
                          </tr>
                        )
                      );
                    })}
                </tbody>
              </table>
            </PerfectScrollbar>
          ) : (
            <div className="crypto-notice">
              보유 화폐를 확인하시려면 로그인 해주세요.
            </div>
          )
        ) : logInEmail !== "" ? (
          // 관심 화폐 영역
          <PerfectScrollbar className="scrollBar-listTable">
            <table className="list-table">
              <colgroup>
                <col width={150} />
                <col width={90} />
                <col width={90} />
                <col width={90} />
              </colgroup>
              <tbody className="scrollable-tbody">
                {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
                {filteredData.map((item, i) => {

                  // 가격의 변화가 생긴 state를 테이블에서 찾아 해당 td 시각화
                  let isChanged = differences.some((diff, index) => {
                    return diff.index === i && diff.newValue === item.price;
                  });
                  let priceClass_rise = isChanged ? "change-price-rise" : "";
                  let priceClass_fall = isChanged ? "change-price-fall" : "";

                  // DB에서 가져온 관심화폐 목록과 일치하는 행을 찾음
                  let isFavorited =
                    Array.isArray(favoriteCrypto) &&
                    favoriteCrypto.some((diff, index) => {
                      return item.name === diff.crypto_name;
                    });

                  return (
                    // 관심화폐만 출력
                    isFavorited && (
                      <tr
                        key={i}
                        onClick={() => {
                          dispatch(setBuyingPrice(filteredData[i].price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매수가격'이 업데이트 됨
                          dispatch(setSellingPrice(filteredData[i].price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매도가격'이 업데이트 됨
                          nameSelect(filteredData[i].name);
                          marketSelect(filteredData[i].market);
                          setSelectedCrypto(filteredData[i]);
                          selectMarket_date(filteredData[i].market);
                          selectMarket_time(
                            filteredData[i].market,
                            selectedChartSort
                          );
                          selectAskingPrice(filteredData[i].market);
                          selectClosedPrice(filteredData[i].market);
                        }}
                      >
                        <td className="td-name lightMode">
                          <span className="span-star">
                            <img
                              onClick={() => {
                                starClick(i);
                                addCryptoToUser(logInEmail, filteredData[i].name);
                              }}
                              // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                              // src={star[i] === 'starOn' ? starOn : starOff}
                              src={isFavorited ? starOn : starOff}
                              alt="star"
                            />
                          </span>
                          <div className="div-name">
                            <div>{item.name}</div>
                            <div>{item.market}</div>
                          </div>
                        </td>

                        {/* 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
                        {item.change === "RISE" ? (
                          <td className="lightMode">
                            <span className={`td-rise ${priceClass_rise}`}>
                              {item.price.toLocaleString()}
                            </span>
                          </td>
                        ) : item.change === "FALL" ? (
                          <td className="lightMode">
                            <span className={`td-fall ${priceClass_fall}`}>
                              {item.price.toLocaleString()}
                            </span>
                          </td>
                        ) : (
                          <td className="lightMode">
                            <span>{item.price.toLocaleString()}</span>
                          </td>
                        )}
                        {item.change === "RISE" ? (
                          <td className="lightMode">
                            <span className="td-rise">
                              +{(item.change_rate * 100).toFixed(2)}% <br />{" "}
                              {item.change_price.toLocaleString()}
                            </span>
                          </td>
                        ) : item.change === "FALL" ? (
                          <td className="lightMode">
                            <span className="td-fall">
                              -{(item.change_rate * 100).toFixed(2)}% <br />{" "}
                              {item.change_price.toLocaleString()}
                            </span>
                          </td>
                        ) : (
                          <td className="lightMode">
                            <span>
                              {(item.change_rate * 100).toFixed(2)}% <br />{" "}
                              {item.change_price.toLocaleString()}
                            </span>
                          </td>
                        )}
                        <td className="lightMode">
                          <span className="td-volume">
                            {Number(
                              String(Math.floor(item.trade_price)).slice(0, -6)
                            ).toLocaleString()}
                            백만
                          </span>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </PerfectScrollbar>
        ) : (
          <div className="crypto-notice">
            관심 화폐를 확인하시려면 로그인 해주세요.
          </div>
        )
      }
    </div >
  );
};

export { CryptoList };
