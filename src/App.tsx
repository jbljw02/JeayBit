import React from 'react';
import './App.css';

function App() {
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
        </footer>
      </div>
    </div>
  );
}

export default App;
