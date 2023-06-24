import React, { useEffect, useState } from 'react';
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
import { RootState, setCr_names, setCr_price, setCr_markets, setStar, setCr_change, setCr_change_rate, setCr_change_price, setCr_trade_volume } from './store';

interface crypto {
  name: string,
  price: number,
  markets: string,
  change: string,
  changeRate: number,
  changePrice: number,
  tradeVolume: number,
  star: string;
}

function App() {

  const dispatch = useDispatch();

  // const [cr_names, setCr_names] = useState<string[]>([]);
  // const [cr_price, setCr_price] = useState<string[]>([]);
  // const [cr_markets, setCr_markets] = useState<string[]>([]);
  // const [bookmark_on, setBookmark_on] = useState<string>(starOn);
  // const [bookmark_off, setBookmark_off] = useState<string>(starOff);
  
  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="App">
      <div className='container'>
        <Header></Header>
        <div className='center'>
          <section className='left'>
            <Left_top></Left_top>
            <Left_Bottom></Left_Bottom>
          </section>
          <aside className='right'>
            <List></List>
          </aside>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className='header'>
      <div className='title'>
        <img src={title} className='img-title'></img>
      </div>
    </header>
  )
}

function Left_top() {
  return (
    <article className='left-top'>
    </article>
  )
}

function Left_Bottom() {
  return (
    <article className='left-bottom'>
    </article>
  )
}

function List() {

  // dispatch 함수를 사용하기 위한 선언
  const dispatch = useDispatch();

  // useSelector훅을 이용해 store에서 state를 가져옴
  const cr_names = useSelector((state: RootState) => { return state.cr_names });
  const cr_price = useSelector((state: RootState) => { return state.cr_price });
  const cr_markets = useSelector((state: RootState) => { return state.cr_markets });
  const cr_change = useSelector((state : RootState) => {return state.cr_change});
  const cr_change_rate = useSelector((state : RootState) => {return state.cr_change_rate});
  const cr_change_price = useSelector((state : RootState) => {return state.cr_change_price});
  const cr_trade_volume = useSelector((state: RootState) => { return state.cr_trade_volume });
  const star = useSelector((state: RootState) => { return state.star });

  const [search_cr, setSearch_cr] = useState<string>('');
  const [filteredData, setFilteredData] = useState<crypto[]>([]);
  const [sort_states, setSort_states] = useState<number[]>([0, 0, 0, 0]);
  const sort_images = [
    img_sort,
    img_sort_up,
    img_sort_down
  ]

  useEffect(() => {
    // 검색어 또는 정렬 상태가 변경되었을 때 실행
    // 필터링 및 정렬된 데이터를 새로운 배열로 생성 -> setFilteredData로 상태를 업데이트
    const updatedData = cr_names.map((name, i) => ({
      name,
      price: cr_price[i],
      markets: cr_markets[i],
      change: cr_change[i],
      changeRate: cr_change_rate[i],
      changePrice: cr_change_price[i],
      tradeVolume: cr_trade_volume[i],
      star: star[i],
    })).filter((item) => (
      item.name.toLowerCase().includes(search_cr.toLowerCase())
    )
    );
    setFilteredData(updatedData);

    // 의존성 배열 추가(배열에 포함된 값들 중 하나라도 변경되면 useEffect 함수가 실행되며 재렌더링 발생)
  }, [cr_names, cr_price, cr_markets, cr_change, cr_change_rate, cr_change_price, cr_trade_volume, star, search_cr]
  );

  // 별 이미지를 클릭하면 on off
  const starClick = (index: number) => {
    dispatch(setStar(index));
  }

  const sortClick = (index: number) => {

    // 정렬 이미지 순환
    setSort_states((prevStates) => {
      const states_copy = [...prevStates];
      states_copy[index] = (states_copy[index] + 1) % sort_images.length;

      switch (index) {

        // 화폐 이름순 정렬
        case 0:
          if (states_copy[index] === 1) {
            const sortedData = [...filteredData]
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            setFilteredData(sortedData)
          }
          if (states_copy[index] === 2) {
            const sortedData = [...filteredData]
            sortedData.sort((a, b) => b.name.localeCompare(a.name));
            setFilteredData(sortedData)
          }
          break;

        // 화폐 가격순 정렬
        case 1:
          if (states_copy[index] === 1) {
            const sortedData = [...filteredData]
            sortedData.sort((a, b) => a.price - b.price)
            setFilteredData(sortedData)
          }
          if (states_copy[index] === 2) {
            const sortedData = [...filteredData]
            sortedData.sort((a, b) => b.price - a.price)
            setFilteredData(sortedData)
          }
          break;

        // 화폐 전일대비 변화순 정률
        case 2:
          if (states_copy[index] === 1) {
            const sortedData = [...filteredData].sort((a, b) => a.changePrice - b.changePrice)
            sortedData.sort((a, b) => a.changePrice - b.changePrice)
            setFilteredData(sortedData)
          }
          if (states_copy[index] === 2) {
            const sortedData = [...filteredData]
            sortedData.sort((a, b) => b.changePrice - a.changePrice)
            setFilteredData(sortedData)
          }
          break;

        // 거래대금순 정렬
        case 3:
          if (states_copy[index] === 1) {
            const sortedData = [...filteredData]
            sortedData.sort((a, b) => a.tradeVolume - b.tradeVolume)
            setFilteredData(sortedData)
          }
          if (states_copy[index] === 2) {
            const sortedData = [...filteredData]
            sortedData.sort((a, b) => b.tradeVolume - a.tradeVolume)
            setFilteredData(sortedData)
          }
          break;
      }

      return states_copy;
    })

  }

  // 화폐정보를 가져온 뒤 검색값을 반환하는 filteredData 변수 선언(검색값이 없다면 기본값 반환)
  // let filteredData = cr_names.map((name, i) => ({
  //   name,
  //   price: cr_price[i],
  //   markets: cr_markets[i],
  //   change: cr_change[i],
  //   changeRate: cr_change_rate[i],
  //   changePrice: cr_change_price[i],
  //   tradeVolume: cr_trade_volume[i],
  //   star: star[i],
  // })).filter(item =>
  //   item.name.toLowerCase().includes(search_cr.toLowerCase())
  // );

  return (
    <div className='div-list'>

      {/* 검색 공간 */}
      <div className='list-search'>
          <img className='img-search' src={search}></img>
        <input type="text" placeholder='검색' value={search_cr} onChange={(e) => setSearch_cr(e.target.value)}></input>
      </div>

      {/* 화폐 구분 목록 */}
      <div className='list-category'>
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
      </div>
      <div className='list-head'>
      </div>

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
        <tbody>

          {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
          {
            filteredData
              .map((item, i) => 
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
                      ? <td className='td-rise'>{item.price}</td>
                      : (item.change === 'FALL'
                        ? <td className='td-fall'>{item.price}</td>
                        : <td className='td-even'>{item.price}</td>)
                }
                {
                    item.change === 'RISE'
                      ? <td className='td-rise'>+{item.changeRate}% <br /> {item.changePrice}</td>
                      : (item.change === 'FALL'
                        ? <td className='td-fall'>-{item.changeRate}% <br /> {item.changePrice}</td>
                        : <td className='td-even'>{item.changeRate}% <br /> {item.changePrice}</td>)
                }
                  <td className='td-volume'>{item.tradeVolume}백만</td>
              </tr>)
          }
        </tbody>
      </table>
    </div>
  )
}

function Footer() {
  return (
    <footer className='footer'>
      {/* <p>{data.map((item) => item).join(', ')}</p> */}
    </footer>
  )
}

export default App;