import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import search from './img/search.png';
import starOn from './img/star-on.png'
import starOff from './img/star-off.png'
import sort from './img/sort.png'
import title from './img/title.png'
import { useSelector } from 'react-redux';
import { RootState } from './store';

function App() {

  const crNames = useSelector((state: RootState) => state.cr_names);

  const [cr_names, setCr_names] = useState<string[]>([]);
  const [cr_price, setCr_price] = useState<string[]>([]);
  const [cr_markets, setCr_markets] = useState<string[]>([]);
  const [bookmark_on, setBookmark_on] = useState<string>(starOn);
  const [bookmark_off, setBookmark_off] = useState<string>(starOff);
  
  useEffect(() => {
    fetchData();
  }, []);

  // = async function () {}
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000')
      setCr_names(response.data.names);
      setCr_price(response.data.cur_price);
      setCr_markets(response.data.markets)
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
            <List cr_names={cr_names} cr_price={cr_price} cr_markets={cr_markets} bookmark_on={bookmark_on} bookmark_off={bookmark_off}></List>
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

function List(props: { cr_names: string[], cr_price: string[], cr_markets: string[], bookmark_on: string, bookmark_off: string }) {

  function bookmark_change() {
    console.log("변경")
  }

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
            props.cr_names.map((item, i) =>
              <tr key={i}>
                <td className='td-star'>
                  <img onClick={() => {
                    bookmark_change();
                  }} src={props.bookmark_off}>
                  </img>
                </td>
                <td className='td-name'>{item} <br /> {props.cr_markets[i]}</td>
                <td className='td-price'>{props.cr_price[i]}</td>
                <td className='td-compare'>+0.68% <br />526,000</td>
                <td className='td-transaction'>96,555백만</td>
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