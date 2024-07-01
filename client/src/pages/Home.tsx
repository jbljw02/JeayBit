import CryptoList from '../components/cryptoList/CryptoList';
import '../assets/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from '../components/Header';
import LogIn from '../components/LogIn';
import PriceDetail from '../components/priceDetail/PriceDetail';
import SignUp from '../components/SignUp';
import { useEffect } from 'react';
import useFunction from '../utils/useFuction';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/store';
import Chart from '../components/chart/Chart';
import CryptoDetail from '../components/cryptoDetail/CryptoDetail';

export default function Home() {
    const dispatch = useDispatch();

    const { checkLogin, getInitialData } = useFunction();

    // 마운트 초기에 사용자의 로그인 여부를 체크
    useEffect(() => {
        (async () => {
            const response = await checkLogin();
            if (response && response.is_logged_in) {
                dispatch(setUser({
                    name: response.name,
                    email: response.email,
                }));
            }
            else {
                dispatch(setUser({
                    name: '',
                    email: '',
                }))
            }
        })();
    }, []);

    // 초기 데이터를 요청하여 selectedCrypto의 초기값을 비트코인으로 설정
    useEffect(() => {
        getInitialData();
    }, []);

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
                                        <CryptoDetail />
                                        <Chart />
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