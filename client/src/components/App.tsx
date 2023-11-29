import { Provider } from 'react-redux';
import store from "../store";
import { Header } from './Header'
import { TradingView } from './TradingView';
import { CryptoList } from './CryptoList'
import { PriceDetail } from './PriceDetail';
import '../assets/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LogIn } from './LogIn';
import { SignUp } from './SignUp';

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="container lightMode">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <>
                  <header className="header lightMode-title">
                    <Header></Header>
                  </header>
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
                  {/* <Footer></Footer> */}
                </>
              } />
              <Route path="/logIn" element={<LogIn />} />
              <Route path="/signUp" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </Provider>
  );
}

export default App;