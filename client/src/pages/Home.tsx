import CryptoList from '../components/cryptoList/CryptoList';
import '../assets/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from '../components/Header';
import LogIn from '../components/LogIn';
import PriceDetail from '../components/PriceDetail';
import SignUp from '../components/SignUp';
import TradingView from '../components/TradingView';

export default function Home() {
    return (
        <div className="container">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <header className="header">
                                <Header></Header>
                            </header>
                            <div className='content-container'>
                                <div className='main'>
                                    <article className='TradingView'>
                                        <TradingView></TradingView>
                                    </article>
                                    <article className='PriceDetail'>
                                        <PriceDetail></PriceDetail>
                                    </article>
                                </div>
                                <aside className='aside'>
                                    <article className="CryptoList">
                                        <CryptoList></CryptoList>
                                    </article>
                                </aside>
                            </div>
                        </>
                    } />
                    <Route path="/logIn" element={<LogIn />} />
                    <Route path="/signUp" element={<SignUp />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}