import CryptoList from '../components/cryptoList/CryptoList';
import '../assets/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogIn from '../components/auth/LogIn';
import PriceDetail from '../components/priceDetail/PriceDetail';
import SignUp from '../components/auth/SignUp';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from '../components/chart/Chart';
import CryptoDetail from '../components/cryptoDetail/CryptoDetail';
import Header from '../header/Header';
import axios from 'axios';
import useFunction from '../components/useFuction';
import { setUser } from '../redux/features/userSlice';
import { setSelectedCrypto, setCryptoRealTime } from '../redux/features/selectedCryptoSlice';
import NoticeModal from '../components/modal/common/NoticeModal';
import { RootState } from '../redux/store';
import { setErrorModal } from '../redux/features/modalSlice';
import CryptoHeader from '../components/cryptoDetail/CryptoHeader';
import WorkingSpinnerModal from '../components/modal/trade/WorkingSpinnerModal';
import { setWorkingSpinner } from '../redux/features/placeholderSlice';

export default function Home() {
    const dispatch = useDispatch();

    const { checkLogin,
        getAllCrypto,
        getTradeHistory,
        selectAskingPrice,
        selectClosedPrice,
        requestCandleMinute,
        requestCandleDate,
        renderTransferModal } = useFunction();

    const errorModal = useSelector((state: RootState) => state.errorModal)
    const user = useSelector((state: RootState) => state.user);
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const workingSpinner = useSelector((state: RootState) => state.workingSpinner);
    const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
    const chartSortDate = useSelector((state: RootState) => state.chartSortDate);

    const selectedCryptoRef = useRef(selectedCrypto);
    const chartSortTimeRef = useRef(chartSortTime);
    const chartSortDateRef = useRef(chartSortDate);

    // 초기 데이터를 비트코인으로 설정
    const getInitialData = async () => {
        try {
            const response = await axios.post("https://jeaybit.onrender.com/get_all_crypto/", {}, {
                withCredentials: true,
            });
            dispatch(setSelectedCrypto(response.data.all_crypto[0]));
            dispatch(setCryptoRealTime(response.data.all_crypto[0]));
        } catch (error) {
            dispatch(setErrorModal(true));
            throw error;
        }
    };

    // 상태 값이 변경될 때마다 ref에 최신 값 저장
    useEffect(() => {
        selectedCryptoRef.current = selectedCrypto;
        chartSortTimeRef.current = chartSortTime;
        chartSortDateRef.current = chartSortDate;
    }, [selectedCrypto, chartSortTime, chartSortDate]);

    // 초기 렌더링시 화폐 정보를 받아오고, 주기적으로 업데이트
    useEffect(() => {
        getAllCrypto();

        const interval = setInterval(() => {
            getAllCrypto();

            selectClosedPrice(selectedCryptoRef.current.market);
            selectAskingPrice(selectedCryptoRef.current.market);

            if (chartSortTimeRef.current && selectedCryptoRef.current.market) {
                requestCandleMinute(selectedCryptoRef.current.market, chartSortTimeRef.current);
            } else if (chartSortDateRef.current && !chartSortTimeRef.current && selectedCryptoRef.current.market) {
                requestCandleDate(selectedCryptoRef.current.market);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (user.email) {
            getTradeHistory(user.email);
        }
    }, [user]);

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
            <WorkingSpinnerModal
                isModalOpen={workingSpinner}
                setIsModalOpen={() => dispatch(setWorkingSpinner(false))} />
            <NoticeModal
                isModalOpen={errorModal}
                setIsModalOpen={() => dispatch(setErrorModal(false))}
                content='서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.' />
            {renderTransferModal()}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <header className="header">
                                <Header />
                            </header>
                            <div className='contents-container'>
                                <article className='cryptoDetail'>
                                    <CryptoHeader />
                                    <CryptoDetail />
                                    <Chart />
                                </article>
                                <article className='priceDetail'>
                                    <PriceDetail />
                                </article>
                                <aside className="cryptoList">
                                    <CryptoList />
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