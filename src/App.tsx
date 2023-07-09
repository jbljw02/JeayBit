import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import search from './img/search.png';
import starOn from './img/star-on.png'
import starOff from './img/star-off.png'
import img_sort from './img/sort.png'
import img_sort_up from './img/sort-up.png'
import img_sort_down from './img/sort-down.png'
import title from './img/title.png'
import { useDispatch, useSelector } from 'react-redux';
import store, {
  RootState,
  crypto,
  setCr_names,
  setCr_price,
  setCr_markets,
  setStar,
  setCr_change,
  setCr_change_rate,
  setCr_change_price,
  setCr_trade_volume,
  setFilteredData,
} from "./store";

import { Provider } from "react-redux";
import Select from "react-select";
function App() {
  // const [filteredData, setFilteredData] = useState<crypto[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  // 비동기 함수 async를 이용하여 데이터를 받아오는 동안에도 다른 작업을 가능하게 함
  // = async function () {}
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000')
      dispatch(setCr_names(response.data.names));
      dispatch(setCr_price(response.data.cur_price));
      dispatch(setCr_markets(response.data.markets));
      dispatch(setCr_change(response.data.change))
      dispatch(setCr_change_rate(response.data.change_rate))
      dispatch(setCr_change_price(response.data.change_price))
      dispatch(setCr_trade_volume(response.data.trade_volume))
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <Header></Header>
          <div className="center">
            <section className="left">
              <Left_left></Left_left>
              <Left_right></Left_right>
            </section>
            <aside className="right">
              <List></List>
            </aside>
          </div>
          <Footer></Footer>
        </div>
      </div>
    </Provider>
  );
}

function Header() {
  return (
    <header className="header">
      {/* 제목 폰트를 사용하기 위한 구글 폰트 api */}
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Hind&display=swap');
      </style>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Roboto+Flex&display=swap');
      </style>
      <div className="title">
        <img src={title} className="title-img"></img>
        <span className="title-name">J TradingView </span>
      </div>
    </header>
  );
}

function Left_left() {
  return (
    <article className="left-left">
      <div className="tradingView">
        <div className="crypto-name"></div>
        <div className="div-tradingView">
          <div className="trading-header"></div>
          <div className="trading-chart"></div>
        </div>
      </div>
    </article>
  );
}

function Left_right() {
  return (
    <article className="left-right">
      <div className="detailView">
        <div className="crypto-price"></div>
      </div>
    </article>
  );
}

function List() {
  // dispatch 함수를 사용하기 위한 선언
  const dispatch = useDispatch();

  // useSelector훅을 이용해 store에서 state를 가져옴
  const cr_names = useSelector((state: RootState) => { return state.cr_names; });
  const cr_price = useSelector((state: RootState) => { return state.cr_price; });
  const cr_markets = useSelector((state: RootState) => { return state.cr_markets; });
  const cr_change = useSelector((state: RootState) => { return state.cr_change; });
  const cr_change_rate = useSelector((state: RootState) => { return state.cr_change_rate; });
  const cr_change_price = useSelector((state: RootState) => { return state.cr_change_price; });
  const cr_trade_volume = useSelector((state: RootState) => { return state.cr_trade_volume; });
  const star = useSelector((state: RootState) => { return state.star; });
  const filteredData = useSelector((state: RootState) => { return state.filteredData; });

  // 검색값을 관리하기 위한 state
  const [search_cr, setSearch_cr] = useState<string>("");

  // 화폐정보를 관리하기 위한 state
  // const [filteredData, setFilteredData] = useState<crypto[]>([]);

  // 차례로 화폐명, 현재가, 전일대비, 거래대금의 정렬 상태를 관리
  const [sort_states, setSort_states] = useState<number[]>([0, 0, 0, 0]);

  // 정렬하려는 목적에 따라 이미지를 변경하기 위해 배열로 생성
  const sort_images = [img_sort, img_sort_down, img_sort_up];

  // 검색어 또는 정렬 상태가 변경되었을 때 재렌더링(변경이 없다면 초기 상태를 출력)
  useEffect(() => {

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
      tradeVolume: cr_trade_volume[i],
      f_tradeVolume: Number(String(Math.floor(cr_trade_volume[i])).slice(0, -6)).toLocaleString(),
      star: star[i],

    // 검색어에 해당하는 데이터를 비교하여 배열을 재생성 후 재렌더링
    })).filter((item) => (
      item.name.toLowerCase().includes(search_cr.toLowerCase())
    ));

    dispatch(setFilteredData(updatedData))

    // 재렌더링 발생X(filter 기능 작동X)
    // if (filteredData.length === 0 && updatedData.length > 0) {
    //   dispatch(setFilteredData(updatedData));
    // }

    // 의존성 배열 추가(배열에 포함된 값들 중 하나라도 변경되면 useEffect 함수가 실행되며 재렌더링 발생 / filteredData가 포함될시 조건문이 없다면 무한 dispatch로 인한 런타임에러 발생)
  }, [cr_names, cr_price, cr_markets, cr_change, cr_change_rate, cr_change_price, cr_trade_volume, star, search_cr]
  );

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

      let sortedData: crypto[] = [...filteredData];

      // 화폐를 전일대비 상승/동결/하락 여부에 따라 구분
      // 값 자체에 양수, 음수 구분이 되어있는 것이 아니기 때문에 정렬하기 전에 구분을 지어줘야 함
      let rise_crypto: crypto[] = [];
      let even_crypto: crypto[] = [];
      let fall_crypto: crypto[] = [];

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
            sortedData.sort((a, b) => b.tradeVolume - a.tradeVolume);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[2] = 0;
          }
          if (states_copy[index] === 2) {
            sortedData.sort((a, b) => a.tradeVolume - b.tradeVolume);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[2] = 0;
          }
          break;
      }
      dispatch(setFilteredData(sortedData));
      return states_copy;

    });
  };

  return (
    <div className="div-list">
      {/* 검색 공간 */}
      <div className="list-search">
        <img className="img-search" src={search}></img>
        <input
          type="text"
          placeholder="검색"
          value={search_cr}
          onChange={(e) => setSearch_cr(e.target.value)}
        ></input>
      </div>

      {/* 화폐 구분 목록 */}
      {/* <div className='list-category'>
        <span className='krw'>
          원화
        </span>
        <span className='btc'>
          BTC
        </span>
        <span className='usdt'>
          USDT
        </span>
        <span className='favorite'>
          관심
        </span>
      </div> */}
      {/* <div className='list-head'>
      </div> */}

      {/* 화폐 정보 테이블 */}
      <table className='list-table'>
        <thead>
          <tr>
            <th className='name'>
              화폐명&nbsp;
              <img className='sort' src={sort_images[sort_states[0]]} onClick={() => sortClick(0)}></img>
            </th>
            <th className='price'>
              현재가&nbsp;
              <img className='sort' src={sort_images[sort_states[1]]} onClick={() => sortClick(1)}></img>
            </th>
            <th className='compare'>
              전일대비&nbsp;
              <img className='sort' src={sort_images[sort_states[2]]} onClick={() => sortClick(2)}></img>
            </th>
            <th className='volume'>
              거래대금&nbsp;
              <img className='sort' src={sort_images[sort_states[3]]} onClick={() => sortClick(3)}></img>
            </th>
          </tr>
        </thead>

        <tbody className='scroll-tbody'>
          {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
          {
            filteredData.map((item, i) => {
              return (
              <tr key={i}>
                <td className='td-star'>
                  <img
                      onClick={() => starClick(i)}
                    // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                    src={star[i] === 'starOn' ? starOn : starOff}
                  />
                </td>
                  <td className='td-name'>{item.name} <br /> {item.markets}</td>
                {/* 삼항연산자 중첩 - 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
                {
                    item.change === 'RISE'
                      ? <td className='td-rise'>{item.f_price}</td>
                      : (item.change === 'FALL'
                        ? <td className='td-fall'>{item.f_price}</td>
                        : <td className='td-even'>{item.f_price}</td>)
                }
                {
                    item.change === 'RISE'
                      ? <td className='td-rise'>+{item.f_changeRate}% <br /> {item.f_changePrice}</td>
                      : (item.change === 'FALL'
                        ? <td className='td-fall'>-{item.f_changeRate}% <br /> {item.f_changePrice}</td>
                        : <td className='td-even'>{item.f_changeRate}% <br /> {item.f_changePrice}</td>)
                }
                  <td className='td-volume'>{item.f_tradeVolume}백만</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

function Footer() {
  return (
    <footer className='footer'>
    </footer>
  )
}

export default App;