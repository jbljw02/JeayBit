import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector, Provider } from 'react-redux';
import store, { RootState } from "../store";
import { Header } from './Header'
import { TradingView } from './TradingView';
import { CryptoList } from './CryptoList'
import { Footer } from './Footer'
import { PriceDetail } from './PriceDetail';
import '../assets/App.css';

const App = () => {

  const theme = useSelector((state: RootState) => state.theme);

  return (
    <Provider store={store}>
      <div className="App">
        <div className="container lightMode">
          <Header></Header>
          <div className='content-container'>
            <div className='main'>
              <article className='TradingView'>
                <TradingView></TradingView>
              </article>
              <article className='PriceDetail lightMode'>
                <PriceDetail></PriceDetail>
              </article> 
            </div>
            <aside className='aside'>
              <article className="CryptoList">
                <CryptoList></CryptoList>
              </article>
            </aside>
          </div>
          <Footer></Footer>
        </div>
      </div>
    </Provider>
  );
}

export default App;