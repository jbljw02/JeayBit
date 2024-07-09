import CryptoList from '../components/cryptoList/CryptoList';
import '../assets/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogIn from '../components/auth/LogIn';
import PriceDetail from '../components/priceDetail/PriceDetail';
import SignUp from '../components/auth/SignUp';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCryptoRealTime, setSelectedCrypto, setUser } from '../redux/store';
import Chart from '../components/chart/Chart';
import CryptoDetail from '../components/cryptoDetail/CryptoDetail';
import Header from '../header/Header';
import axios from 'axios';

export default function Home() {
    const dispatch = useDispatch();

    const checkLogin = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/check_login/", {}, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // 초기 데이터를 비트코인으로 설정
    const getInitialData = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/get_all_crypto/", {}, {
                withCredentials: true,
            });
            dispatch(setSelectedCrypto(response.data.all_crypto[0]));
            dispatch(setCryptoRealTime(response.data.all_crypto[0]));
        } catch (error) {
            throw error;
        }
    };

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
                                <Header />
                            </header>
                            <div className='contents-container'>
                                <div className='main'>
                                    <article className='cryptoDetail'>
                                        <CryptoDetail />
                                        <Chart />
                                    </article>
                                    <article className='priceDetail'>
                                        <PriceDetail />
                                    </article>
                                </div>
                                <aside className='aside'>
                                    <article className="cryptoList">
                                        <CryptoList />
                                    </article>
                                </aside>
                            </div>
                        </>
                    } />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/signUp" element={<SignUp />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}