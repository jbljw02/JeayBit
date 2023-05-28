import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import search from './img/search.png';
import starOff from './img/star-off.png'
import starOng from './img/star-on.png'
import sort from './img/sort.png'

function star_change(){
  
  
}

function App() {

  const [cr_names, setCr_names] = useState<string[]>([]);
  const [cr_price, setCr_price] = useState<string[]>([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000')
      setCr_names(response.data.names);
      setCr_price(response.data.cur_price);
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <div className='container'>
        <header className='header'>
        </header>

        <div className='center'>
          <section className='left'>
            <article className='left-top'>
            </article>
            <article className='left-bottom'>
            </article>
          </section>

          <aside className='right'>
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
                          <img onClick={() => {
                            star_change();
                          }} src={starOff}>
                          </img>
                        </td>
                        <td className='td-name'>{item} <br /> KRW-BTC</td>
                        <td className='td-price'>{cr_price[i]}</td>
                        <td className='td-compare'>+0.68% <br />526,000</td>
                        <td className='td-transaction'>96,555백만</td>
                    </tr>)
                  }               
                </tbody>
              </table>
            </div>
          </aside>
        </div>

        <footer className='footer'>
          {/* <p>{data.map((item) => item).join(', ')}</p> */}
        </footer>
        
      </div>

    </div>
  );
}

export default App;