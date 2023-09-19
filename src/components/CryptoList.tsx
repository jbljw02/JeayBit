import { useDispatch, useSelector } from "react-redux";
import { RootState, setFilteredData, setStar, Crypto, setCr_names_selected, setCr_markets_selected, setCr_price_selected, setCr_change_selected, setCr_change_rate_selected, setCr_change_price_selected, setSortedData, setCr_trade_price_selected, setCr_trade_volume_selected, setCr_open_price_selected, setCr_high_price_selected, setCr_low_price_selected, Market, setCandle_per_date, setCandle_per_week, setCandle_per_month, setSelectedChartSort, setCandle_per_minute, setCr_names, setCr_price, setCr_markets, setCr_change, setCr_change_rate, setCr_change_price, setCr_trade_price, setCr_trade_volume, setCr_open_price, setCr_high_price, setCr_low_price, setCandle_per_date_BTC, setClosed_data, setAsking_data, setAsking_dateTime, setAsking_totalAskSize, setAsking_totalBidSize } from "../store";
import { useEffect, useState } from "react";
import img_sort from '../assets/images/sort.png';
import img_sort_up from '../assets/images/sort-up.png';
import img_sort_down from '../assets/images/sort-down.png';
import starOn from '../assets/images/star-on.png';
import starOff from '../assets/images/star-off.png';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import axios from "axios";

const CryptoList = () => {

  // dispatch 함수를 사용하기 위한 선언
  const dispatch = useDispatch();

  // useSelector훅을 이용해 store에서 state를 가져옴
  const cr_names = useSelector((state: RootState) => { return state.cr_names; });
  const cr_price = useSelector((state: RootState) => { return state.cr_price; });
  const cr_markets = useSelector((state: RootState) => { return state.cr_markets; });
  const cr_change = useSelector((state: RootState) => { return state.cr_change; });
  const cr_change_rate = useSelector((state: RootState) => { return state.cr_change_rate; });
  const cr_change_price = useSelector((state: RootState) => { return state.cr_change_price; });
  const cr_trade_price = useSelector((state: RootState) => { return state.cr_trade_price; });
  const cr_trade_volume = useSelector((state: RootState) => { return state.cr_trade_volume });
  const cr_open_price = useSelector((state: RootState) => { return state.cr_open_price });
  const cr_high_price = useSelector((state: RootState) => { return state.cr_high_price });
  const cr_low_price = useSelector((state: RootState) => { return state.cr_low_price });
  const star = useSelector((state: RootState) => { return state.star; });
  const filteredData = useSelector((state: RootState) => { return state.filteredData; });
  let sortedData = useSelector((state: RootState) => { return state.sortedData });
  const cr_trade_price_selected = useSelector((state: RootState) => { return state.cr_trade_price_selected });
  const cr_markets_selected = useSelector((state: RootState) => { return state.cr_markets_selected });
  const candle_per_date = useSelector((state: RootState) => state.candle_per_date);
  const candle_per_minute = useSelector((state: RootState) => state.candle_per_minute);

  // 검색값을 관리하기 위한 state
  const [search_cr, setSearch_cr] = useState<string>("");

  // 차례로 화폐명, 현재가, 전일대비, 거래대금의 정렬 상태를 관리
  const [sort_states, setSort_states] = useState<number[]>([0, 0, 0, 0]);

  // 정렬하려는 목적에 따라 이미지를 변경하기 위해 배열로 생성
  const sort_images = [img_sort, img_sort_down, img_sort_up];

  const delimitedDate = useSelector((state: RootState) => state.delimitedDate);
  const delimitedTime = useSelector((state: RootState) => state.delimitedTime);
  const selectedChartSort = useSelector((state: RootState) => state.selectedChartSort);
  const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);

  // 체결 내역을 담을 state
  const closedData = useSelector((state: RootState) => state.closed_data);

  // 호가 내역을 담을 state
  const asking_data = useSelector((state: RootState) => state.asking_data);
  const asking_dateTime = useSelector((state: RootState) => state.asking_dateTime);

  // useEffect(() => { 
  //   // const 변수 = setInterval(() => { 콜백함수, 시간 })
  //   // fetchData 함수를 1초마다 실행 - 서버에서 받아오는 값을 1초마다 갱신시킴
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 1000);

  //   // 반복 실행하지 않고 초기 렌더링시 1회만 실행
  //   initialData();

  //   // clearInterval(변수)
  //   // setInterval이 반환하는 interval ID를 clearInterval 함수로 제거
  //   return () => clearInterval(interval);
  // }, []);

  // 화면에 보여질 초기 화폐의 상태 정보(비트코인)
  const initialData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/get_data/')
      dispatch(setCr_names_selected(response.data.names[0]))
      dispatch(setCr_markets_selected(response.data.markets[0]))
      dispatch(setCr_price_selected((response.data.cur_price[0]).toLocaleString()))
      dispatch(setCr_change_selected(response.data.change[0]))
      dispatch(setCr_trade_volume_selected(response.data.trade_volume[0]))
      dispatch(setCr_trade_volume_selected(Number(String(Math.floor(response.data.trade_volume[0]))).toLocaleString()));
      dispatch(setCr_trade_price_selected(Number(String(Math.floor(response.data.trade_price[0]))).toLocaleString()));
      dispatch(setCr_change_rate_selected((response.data.change_rate[0] * 100).toFixed(2)))
      dispatch(setCr_change_price_selected((response.data.change_price[0]).toLocaleString()))
      dispatch(setCr_open_price_selected((response.data.opening_price[0]).toLocaleString()))
      dispatch(setCr_low_price_selected((response.data.low_price[0]).toLocaleString()))
      dispatch(setCr_high_price_selected((response.data.high_price[0]).toLocaleString()))
      dispatch(setCandle_per_date_BTC(response.data.candle_btc_date))
      dispatch(setClosed_data(response.data.closed_price_btc))
      dispatch(setAsking_data(response.data.asking_price_btc[0].orderbook_units))
      dispatch(setAsking_dateTime(response.data.asking_price_btc[0].timestamp))
      dispatch(setAsking_totalAskSize(response.data.asking_price_btc[0].total_ask_size))
      dispatch(setAsking_totalBidSize(response.data.asking_price_btc[0].total_bid_size))
      // dispatch(setAsking_buySize(response.data.asking_price_btc[0].orderbook_units.ask_size))
      // console.log("호출값 :", response.data.asking_price_btc[0])
    } catch (error) {
      console.error(error);
    }
  }

  // 비동기 함수 async를 이용하여 데이터를 받아오는 동안에도 다른 작업을 가능하게 함
  // = async function () {}
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/get_data/');
      dispatch(setCr_names(response.data.names));
      dispatch(setCr_price(response.data.cur_price));
      dispatch(setCr_markets(response.data.markets));
      dispatch(setCr_change(response.data.change));
      dispatch(setCr_change_rate(response.data.change_rate));
      dispatch(setCr_change_price(response.data.change_price));
      dispatch(setCr_trade_price(response.data.trade_price));
      dispatch(setCr_trade_volume(response.data.trade_volume));
      dispatch(setCr_open_price(response.data.opening_price));
      dispatch(setCr_high_price(response.data.high_price));
      dispatch(setCr_low_price(response.data.low_price));
    } catch (error) {
      console.error(error);
    }
  };

  // 검색어 또는 정렬 상태가 변경되었을 때 재렌더링(변경이 없다면 초기 상태를 출력)
  // 필터링 및 정렬된 데이터를 새로운 배열로 생성 -> setFilteredData로 상태를 업데이트
  // price = 숫자형, f_price = 문자형 / 숫자형으로 정렬, 문자형으로 출력
  const updatedData = cr_names.map((name, i) => ({
    name,
    price: cr_price[i],
    f_price: cr_price[i].toLocaleString(),
    markets: cr_markets[i],
    change: cr_change[i],
    changeRate: cr_change_rate[i],
    f_changeRate: (cr_change_rate[i] * 100).toFixed(2),
    changePrice: cr_change_price[i],
    f_changePrice: cr_change_price[i].toLocaleString(),
    tradePrice: cr_trade_price[i],
    f_tradePrice: Number(String(Math.floor(cr_trade_price[i])).slice(0, -6)).toLocaleString(),
    tradeVolume: cr_trade_volume[i],
    openPrice: cr_open_price[i],
    highPrice: cr_high_price[i],
    lowPrice: cr_low_price[i],
    star: star[i]
    // 검색어에 해당하는 데이터를 비교하여 배열을 재생성
  })).filter((item) => (
    item.name.toLowerCase().includes(search_cr.toLowerCase())
  ));

  useEffect(() => {
    if (filteredData.length === 0 && updatedData.length > 0) {
      dispatch(setFilteredData(updatedData));
    }
  });
  
  useEffect(() => {
    initialData();
  }, [])
  
  useEffect(() => {
    fetchData();
    dispatch(setFilteredData(updatedData));
  }, [search_cr]);

  useEffect(() => {
    if (cr_markets_selected) {
      selectMarket_date(cr_markets_selected);
      selectMarket_time(cr_markets_selected, chartSortTime);
    }
  }, [cr_markets_selected, chartSortDate, chartSortTime]);

  // 선택된 화폐에 대한 체결내역 호출
  const selectClosedPrice = (market: string) => { 
    (async (market) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/closed_price/', {
          market: market,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("체결내역 : ", response.data);
        dispatch(setClosed_data(response.data));
      } catch (error) {
        console.error('Failed to send data to Django server', error);
      }
    })(market);
  }

  // 선택된 화폐에 대한 호가내역 호출
  const selectAskingPrice = (market: string) => { 
    (async (market) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/asking_price/', {
          market: market,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // console.log("호가내역 : ", response.data[0].timestamp);
        dispatch(setAsking_data(response.data[0].orderbook_units));
        dispatch(setAsking_dateTime(response.data[0].timestamp));
        dispatch(setAsking_totalAskSize(response.data[0].total_ask_size));
        dispatch(setAsking_totalBidSize(response.data[0].total_bid_size));
      } catch (error) {
        console.error('Failed to send data to Django server', error);
      }
    })(market);
  }

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 분에 따라)
  const selectMarket_time = (market: string, minute: string) => {
    (async (market, minute) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/candle_per_minute/', {
          market: market,
          minute: minute,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(chartSortTime, "당 요청값: ", response.data);
        dispatch(setCandle_per_minute(response.data));
      } catch (error) {
        console.error('Failed to send data to Django server', error);
      }
    })(market, minute);
  }

  // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 일자에 따라)
  const selectMarket_date = (market: string) => {
    if (chartSortDate === '1일') {
      (async (market) => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/candle_per_date/', {
            market: market,
            // date: tempChartSort,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log("1일 요청된 값 : ", response.data)
          dispatch(setCandle_per_date(response.data));
        } catch (error) {
          console.error('Failed to send data to Django server', error);
        }
      })(market);
    }
    else if (chartSortDate === '1주') {
      void (async (market) => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/candle_per_week/', {
            market: market,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log("1주 요청된 값 : ", response.data)
          dispatch(setCandle_per_week(response.data));
        } catch (error) {
          console.error('Failed to send data to Django server', error);
        }
      })(market);
    }
    else if (chartSortDate === '1개월') {
      void (async (market) => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/candle_per_month/', {
            market: market,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log("1개월 요청된 값 : ", response.data)
          dispatch(setCandle_per_month(response.data));
        } catch (error) {
          console.error('Failed to send data to Django server', error);
        }
      })(market);
    }
  }

  // 별 이미지를 클릭하면 on off
  const starClick = (index: number) => {
    dispatch(setStar(index));
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
      sortedData.map((item) => {
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
            rise_crypto.sort((a, b) => b.changeRate - a.changeRate);
            even_crypto.sort((a, b) => b.changeRate - a.changeRate);
            fall_crypto.sort((a, b) => a.changeRate - b.changeRate);

            // 새 배열을 원본 배열의 카피본에 병합 - 내림차순이기 때문에 상승, 동결, 하락순으로 병합
            sortedData = [...rise_crypto, ...even_crypto, ...fall_crypto];
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[3] = 0;
          }
          if (states_copy[index] === 2) {
            fall_crypto.sort((a, b) => b.changeRate - a.changeRate);
            even_crypto.sort((a, b) => b.changeRate - a.changeRate);
            rise_crypto.sort((a, b) => a.changeRate - b.changeRate);

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
            sortedData.sort((a, b) => b.tradePrice - a.tradePrice);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[2] = 0;
          }
          if (states_copy[index] === 2) {
            sortedData.sort((a, b) => a.tradePrice - b.tradePrice);
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

  // 각 값들을 테이블에서 클릭한 화폐의 정보로 변경 -> TradingView, TradingDetail로 전달
  const nameSelect = (value: string) => {
    dispatch(setCr_names_selected(value));
  }
  const marketSelect = (value: string) => {
    dispatch(setCr_markets_selected(value));
  }
  const priceSelect = (value: string) => {
    dispatch(setCr_price_selected(value));
  }
  const openPriceSelect = (value: number) => {
    dispatch(setCr_open_price_selected(value));
  }
  const highPriceSelect = (value: number) => {
    dispatch(setCr_high_price_selected(value));
  }
  const lowPriceSelect = (value: number) => {
    dispatch(setCr_low_price_selected(value));
  }
  const changeSelect = (value: string) => {
    dispatch(setCr_change_selected(value));
  }
  const tradePriceSelect = (value: number) => {
    dispatch(setCr_trade_price_selected(Number(String(Math.floor(value))).toLocaleString()));
  }
  const tradeVolumeSelect = (value: number) => {
    dispatch(setCr_trade_volume_selected(Number(String(Math.floor(value))).toLocaleString()));
  }
  const change_rateSelect = (value: string) => {
    dispatch(setCr_change_rate_selected(value))
  }
  const change_priceSelect = (value: string) => {
    dispatch(setCr_change_price_selected(value));
  }

  return (
    <>
      {/* 검색 공간 */}
      <div className="list-search">
        {/* <img className="img-search" src={search}></img> */}
        <svg className="img-search" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 18 18" width="30" height="30">
          <path fill="currentColor" d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"></path>
        </svg>
        <input type="text" className='crypto-search' placeholder="검색" value={search_cr} onChange={(e) => setSearch_cr(e.target.value)}></input>
      </div>

      {/* 화폐 정보 테이블 */}
      {/* 스크롤바를 넣기 위해 테이블을 두 개로 구성 */}
      <table className='list-table'>
        <thead className="list-thead">
          <tr>
            <th className='name' onClick={() => sortClick(0)}>
              화폐명&nbsp;
              <img className='sort' src={sort_images[sort_states[0]]} alt="화폐명"></img>
            </th>
            <th className='price' onClick={() => sortClick(1)}>
              현재가&nbsp;
              <img className='sort' src={sort_images[sort_states[1]]} alt="현재가"></img>
            </th>
            <th className='compare' onClick={() => sortClick(2)}>
              전일대비&nbsp;
              <img className='sort' src={sort_images[sort_states[2]]} alt="전일대비"></img>
            </th>
            <th className='volume' onClick={() => sortClick(3)}>
              거래대금&nbsp;
              <img className='sort' src={sort_images[sort_states[3]]} alt="거래대금"></img>
            </th>
          </tr>
        </thead>
      </table>

      <SimpleBar className="scrollBar-listTable">
        <table className="list-table">
          <tbody className='scrollable-tbody'>
            {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
            {
              filteredData.map((item, i) => {
                return (
                  <tr key={i} onClick={() => {
                    nameSelect(filteredData[i].name);
                    marketSelect(filteredData[i].markets);
                    priceSelect(filteredData[i].f_price);
                    changeSelect(filteredData[i].change);
                    change_rateSelect(filteredData[i].f_changeRate);
                    change_priceSelect(filteredData[i].f_changePrice);
                    tradePriceSelect(filteredData[i].tradePrice);
                    tradeVolumeSelect(filteredData[i].tradeVolume);
                    openPriceSelect(filteredData[i].openPrice);
                    highPriceSelect(filteredData[i].highPrice);
                    lowPriceSelect(filteredData[i].lowPrice);
                    selectMarket_date(filteredData[i].markets);
                    selectMarket_time(filteredData[i].markets, selectedChartSort);
                    selectAskingPrice(filteredData[i].markets);
                    selectClosedPrice(filteredData[i].markets);
                  }}>
                    {/* <td className='td-star'>
                      <img
                        onClick={() => starClick(i)}
                        // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                        src={star[i] === 'starOn' ? starOn : starOff}
                        alt="star" />
                    </td> */}
                    <td className='td-name'>
                      <span className="span-star">
                        <img
                          onClick={() => starClick(i)}
                          // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                          src={star[i] === 'starOn' ? starOn : starOff}
                          alt="star" />
                      </span>
                      <div className="div-name">
                        <div>
                          {item.name}
                        </div>
                        <div>
                          {item.markets}
                        </div>
                      </div>
                    </td>

                    {/* 삼항연산자 중첩 - 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
                    {
                      item.change === 'RISE' ?
                        <td className='td-rise'>{item.f_price}</td> :
                        (
                          item.change === 'FALL' ?
                            <td className='td-fall'>{item.f_price}</td> :
                            <td className='td-even'>{item.f_price}</td>
                        )
                    }
                    {
                      item.change === 'RISE' ?
                        <td className='td-rise'>+{item.f_changeRate}% <br /> {item.f_changePrice}</td> :
                        (
                          item.change === 'FALL' ?
                            <td className='td-fall'>-{item.f_changeRate}% <br /> {item.f_changePrice}</td> :
                            <td className='td-even'>{item.f_changeRate}% <br /> {item.f_changePrice}</td>
                        )
                    }
                    <td className='td-volume'>{item.f_tradePrice}백만</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </SimpleBar>

      {/* </table> */}
    </>
  );
}

export { CryptoList };