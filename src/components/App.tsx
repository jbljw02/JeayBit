import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector, Provider } from 'react-redux';
import store from "../store";
import { Header } from './Header'
import { TradingView } from './TradingView';
import { CryptoList } from './CryptoList'
import { Footer } from './Footer'
import { ClosedPrice } from './ClosedPrice';
import { AskingPrice } from './AskingPrice';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import '../assets/App.css';

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <Header></Header>
          <div className='content-container'>
            <div className='main'>
              <article className='TradingView'>
                <TradingView></TradingView>
              </article>
              <article className='PriceDetail'>
                <ClosedPrice></ClosedPrice>
                <AskingPrice></AskingPrice>
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