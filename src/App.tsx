import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000')
      setData(response.data.price);
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <div className='container'>

        <header className='header'>
          머리
        </header>

        <div className='center'>
          <section className='left'>
            <article className='left-top'>
              왼쪽 중간
            </article>
            <article className='left-bottom'>
              왼쪽 하단
            </article>
          </section>

          <aside className='right'>
            오른쪽 전체
          </aside>
        </div>

        <footer className='footer'>
          발
          <p>{data.map((item) => item).join(', ')}</p>
        </footer>
        
      </div>

    </div>
  );
}

export default App;
