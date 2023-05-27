import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import img_search from './img/search.png';

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
                  <img className='img-search' src={img_search}></img>
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
              
              {/* 화폐 정보 테이블 */}
              <table className='list-table'>
                <thead className='table-thead'>
                  <tr>
                    <th className='name'>
                      화폐명
                    </th>
                    <th className='price'>
                      현재가
                    </th>
                    <th className='previous'>
                      전일대비
                    </th>
                    <th className='transaction'>
                      거래대금
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* map 반복문을 이용해 <tr><td>생성, 화폐 정보 출력 */}
                  {
                    cr_names.map((item, i) => 
                    <tr><td>{item}</td><td>{cr_price[i]}</td></tr>)
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

<div>
  <span>

  </span>
  <span>

  </span>
</div>