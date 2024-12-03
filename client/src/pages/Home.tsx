import CryptoList from '../components/cryptoList/CryptoList';
import '../assets/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogIn from '../components/auth/LogIn';
import PriceDetail from '../components/priceDetail/PriceDetail';
import SignUp from '../components/auth/SignUp';
import { useEffect, useRef } from 'react';
import Chart from '../components/chart/Chart';
import CryptoDetail from '../components/cryptoDetail/CryptoDetail';
import Header from '../header/Header';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';
import { setSelectedCrypto, setCryptoRealTime } from '../redux/features/selectedCryptoSlice';
import NoticeModal from '../components/modal/common/NoticeModal';
import { setErrorModal } from '../redux/features/modalSlice';
import CryptoHeader from '../components/cryptoDetail/CryptoHeader';
import WorkingSpinnerModal from '../components/modal/trade/WorkingSpinnerModal';
import { setWorkingSpinner } from '../redux/features/placeholderSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import useCheckLogin from '../components/hooks/useCheckLogin';
import useGetAllCrypto from '../components/hooks/useGetAllCrypto';
import useRenderTransferModal from '../components/hooks/useRenderTransferModal';
import useRequestCandleMinute from '../components/hooks/useRequestCandle';
import useSelectAskingPrice from '../components/hooks/useSelectAskingPrice';
import useSelectClosedPrice from '../components/hooks/useSelectClosedPrice';
import useTradeHistory from '../components/hooks/useTradeHistory';
import useRequestCandle from '../components/hooks/useRequestCandle';

const API_URL = process.env.REACT_APP_API_URL;

export default function Home() {
    const dispatch = useAppDispatch();

    const checkLogin = useCheckLogin();
    const getAllCrypto = useGetAllCrypto();
    const { getTradeHistory } = useTradeHistory();
    const selectAskingPrice = useSelectAskingPrice();
    const selectClosedPrice = useSelectClosedPrice();
    const { requestCandleMinute, requestCandleDate } = useRequestCandle();
    const renderTransferModal = useRenderTransferModal();

    const errorModal = useAppSelector(state => state.errorModal)
    const user = useAppSelector(state => state.user);
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const workingSpinner = useAppSelector(state => state.workingSpinner);
    const chartSortTime = useAppSelector(state => state.chartSortTime);
    const chartSortDate = useAppSelector(state => state.chartSortDate);
    const chartSpinner = useAppSelector(state => state.chartSpinner);
    const askingSpinner = useAppSelector(state => state.askingSpinner);

    const selectedCryptoRef = useRef(selectedCrypto);
    const chartSortTimeRef = useRef(chartSortTime);
    const chartSortDateRef = useRef(chartSortDate);
    const chartSpinnerRef = useRef(chartSpinner);
    const askingSpinnerRef = useRef(askingSpinner);

    // 초기 데이터를 비트코인으로 설정
    const getInitialData = async () => {
        try {
            const response = await axios.post(`${API_URL}/get_all_crypto/`, {}, {
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
        chartSpinnerRef.current = chartSpinner;
        askingSpinnerRef.current = askingSpinner;
    }, [selectedCrypto, chartSortTime, chartSortDate, chartSpinner, askingSpinner]);

    // 초기 렌더링시 화폐 정보를 받아오고, 주기적으로 업데이트
    useEffect(() => {
        getAllCrypto();

        const interval = setInterval(() => {
            getAllCrypto();

            if (!askingSpinnerRef.current) {
                selectClosedPrice(selectedCryptoRef.current.market);
                selectAskingPrice(selectedCryptoRef.current.market);
            }

            if (!chartSpinnerRef.current) {
                if (chartSortTimeRef.current && selectedCryptoRef.current.market) {
                    requestCandleMinute(selectedCryptoRef.current.market, chartSortTimeRef.current);
                } else if (chartSortDateRef.current && !chartSortTimeRef.current && selectedCryptoRef.current.market) {
                    requestCandleDate(selectedCryptoRef.current.market, chartSortDateRef.current);
                }
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