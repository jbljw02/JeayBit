import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector, Provider } from 'react-redux';
import store, { RootState, crypto, setCr_names, setCr_price, setCr_markets, setStar, setCr_change, setCr_change_rate, setCr_change_price, setCr_trade_volume, setFilteredData } from "../store";
import { Header } from './Header'
import { TradingView } from './TradingView';
import { TradingDetail } from './TradingDetail'
import { CryptoList } from './CryptoList'
import { Footer } from './Footer'
import '../assets/App.css';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  // 비동기 함수 async를 이용하여 데이터를 받아오는 동안에도 다른 작업을 가능하게 함
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
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <Header></Header>
          <div className="center">
            <section className="left">
              <TradingView></TradingView>
              <TradingDetail></TradingDetail>
            </section>
            <aside className="right">
              <CryptoList></CryptoList>
            </aside>
          </div>
          <Footer></Footer>
        </div>
      </div>
    </Provider>
  );
}

export default App;