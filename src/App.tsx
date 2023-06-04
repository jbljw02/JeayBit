import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import search from './img/search.png';
import starOn from './img/star-on.png'
import starOff from './img/star-off.png'
import sort from './img/sort.png'
import title from './img/title.png'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCr_names, setCr_price, setCr_markets, setStar, setCr_change, setCr_change_rate, setCr_change_price, setCr_trade_volume } from './store';

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

  // 별 이미지를 클릭하면 on off
  const handleStarClick = (index: number) => {
    dispatch(setStar(index));
  };

  return (
    <div className='div-list'>

      {/* 검색 공간 */}
      <div className='list-search'>
        <input type="text" placeholder='검색'></input>
        <button className='btn-search'>
          <img className='img-search' src={search}></img>
        </button>
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
              <img src={sort}>
              </img>
            </th>
            <th className='price'>
              현재가&nbsp;
              <img src={sort}>
              </img>
            </th>
            <th className='compare'>
              전일대비&nbsp;
              <img src={sort}>
              </img>
            </th>
            <th className='transaction'>
              거래대금&nbsp;
              <img src={sort}>
              </img>
            </th>
          </tr>
        </thead>
        <tbody>

          {/* map 반복문을 이용해 <tr><td>생성, 화폐 정보 출력 */}
          {
            cr_names.map((item, i) =>
              <tr key={i}>
                <td className='td-star'>
                  <img
                    onClick={() => handleStarClick(i)}

                    // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                    src={star[i] === 'starOn' ? starOn : starOff}
                  />
                </td>
                <td className='td-name'>{item} <br /> {cr_markets[i]}</td>

                {/* 삼항연산자 중첩 - 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
                {
                  cr_change[i] === 'RISE'
                    ? <td className='td-rise'>{cr_price[i]}</td>
                    : (cr_change[i] === 'FALL'
                      ? <td className='td-fall'>{cr_price[i]}</td>
                      : <td className='td-even'>{cr_price[i]}</td>)
                }
                {
                  cr_change[i] === 'RISE'
                    ? <td className='td-rise'>+{cr_change_rate[i]}% <br /> {cr_change_price[i]}</td>
                    : (cr_change[i] === 'FALL'
                      ? <td className='td-fall'>-{cr_change_rate[i]}% <br /> {cr_change_price[i]}</td>
                      : <td className='td-even'>{cr_change_rate[i]}% <br /> {cr_change_price[i]}</td>)
                }
                <td className='td-transaction'>{cr_trade_volume[i]}백만</td>
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