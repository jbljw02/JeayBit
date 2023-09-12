import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector, Provider } from 'react-redux';
import store, { RootState, setCr_names, setCr_price, setCr_markets, setCr_change, setCr_change_rate, setCr_change_price, setCr_trade_price, setCr_names_selected, setCr_markets_selected, setCr_price_selected, setCr_change_selected, setCr_change_rate_selected, setCr_change_price_selected, setCr_trade_volume, setCr_open_price, setCr_high_price, setCr_low_price, setCr_open_price_selected, setCr_high_price_selected, setCr_low_price_selected, setCr_trade_price_selected, setCr_trade_volume_selected, setCandle_per_date_BTC } from "../store";
import { Header } from './Header'
import { TradingView } from './TradingView';
import { CryptoList } from './CryptoList'
import { Footer } from './Footer'
import { ClosedPrice } from './ClosedPrice';
import { AskingPrice } from './AskingPrice';
import '../assets/App.css';

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <Header></Header>
          <div className='content-container'>
            <section className='main'>
              <article className='TradingView'>
                <TradingView></TradingView>
              </article>/
              <article className='ClosedPrice'>
                <ClosedPrice></ClosedPrice>
              </article>
              <article className='AskingPrice'>
                <AskingPrice></AskingPrice>
              </article>
            </section>
            <aside className='aside'>
              <article className="CryptoList">
                <CryptoList></CryptoList>
              </article>
            </aside>
          </div>
          {/* <section className='detail'>
          </section> */}
          <Footer></Footer>
        </div>
      </div>
    </Provider>
  );
}

export default App;