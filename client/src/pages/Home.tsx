import CryptoList from '../components/cryptoList/CryptoList';
import '../assets/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PriceDetail from '../components/priceDetail/PriceDetail';
import SignUp from '../components/auth/SignUp';
import { useEffect } from 'react';
import Chart from '../components/chart/Chart';
import CryptoDetail from '../components/cryptoDetail/CryptoDetail';
import Header from '../header/Header';
import axios from 'axios';
import { setUserInfo } from '../redux/features/userSlice';
import { setSelectedCrypto, setCryptoRealTime } from '../redux/features/selectedCryptoSlice';
import NoticeModal from '../components/modal/common/NoticeModal';
import CryptoHeader from '../components/cryptoDetail/CryptoHeader';
import WorkingSpinnerModal from '../components/modal/trade/WorkingSpinnerModal';
import { setWorkingSpinner } from '../redux/features/placeholderSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import useCheckLogin from '../components/hooks/useCheckLogin';
import useGetAllCrypto from '../components/hooks/useGetAllCrypto';
import useSelectAskingPrice from '../components/hooks/useSelectAskingPrice';
import useSelectClosedPrice from '../components/hooks/useSelectClosedPrice';
import useTradeHistory from '../components/hooks/useTradeHistory';
import useRequestCandle from '../components/hooks/useRequestCandle';
import KakaoCallback from '../components/auth/child/KakaoCallback';
import { hideNoticeModal, showNoticeModal } from '../redux/features/modalSlice';
import Login from '../components/auth/Login';

const API_URL = process.env.REACT_APP_API_URL;

export default function Home() {
    const dispatch = useAppDispatch();

    const checkLogin = useCheckLogin();
    const getAllCrypto = useGetAllCrypto();
    const { getTradeHistory } = useTradeHistory();
    const selectAskingPrice = useSelectAskingPrice();
    const selectClosedPrice = useSelectClosedPrice();
    const { requestCandleMinute, requestCandleDate } = useRequestCandle();

    const user = useAppSelector(state => state.user);
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const workingSpinner = useAppSelector(state => state.workingSpinner);
    const chartSortTime = useAppSelector(state => state.chartSortTime);
    const chartSortDate = useAppSelector(state => state.chartSortDate);
    const chartSpinner = useAppSelector(state => state.chartSpinner);
    const askingSpinner = useAppSelector(state => state.askingSpinner);
    const noticeModal = useAppSelector(state => state.noticeModal);

    // 초기 렌더링시 화폐 정보를 받아오고, 주기적으로 업데이트
    useEffect(() => {
        // 초기 마운트시 즉시 실행
        const fetchCryptoData = () => {
            getAllCrypto();

            // 호가 및 체결 내역 요청
            // 이미 내역을 불러오는 중이 아닐 때만 요청
            if (!askingSpinner) {
                selectClosedPrice(selectedCrypto.market || 'KRW-BTC');
                selectAskingPrice(selectedCrypto.market || 'KRW-BTC');
            }

            // 캔들 정보를 요청
            // 이미 내역을 불러오는 중이 아닐 때만 요청
            if (!chartSpinner) {
                if (chartSortTime) {
                    requestCandleMinute(selectedCrypto.market || 'KRW-BTC', chartSortTime);
                }
                else if (chartSortDate && !chartSortTime) {
                    requestCandleDate(selectedCrypto.market || 'KRW-BTc', chartSortDate);
                }
            }
        };

        // 초기 실행
        fetchCryptoData();

        // 3초마다 반복 실행
        const interval = setInterval(fetchCryptoData, 3000);

        return () => clearInterval(interval);
    }, [selectedCrypto, chartSortTime, chartSortDate, askingSpinner, chartSpinner]);

    useEffect(() => {
        if (user.email) {
            getTradeHistory(user.email);
        }
    }, [user.email]);

    // 마운트 초기에 사용자의 로그인 여부를 체크
    useEffect(() => {
        (async () => {
            const response = await checkLogin();
            if (response && response.is_logged_in) {
                dispatch(setUserInfo({
                    name: response.name,
                    email: response.email,
                }));
            }
            else {
                dispatch(setUserInfo({
                    name: '',
                    email: '',
                }))
            }
        })();
    }, []);

    // 초기 데이터를 요청하여 selectedCrypto의 초기값을 비트코인으로 설정
    useEffect(() => {
        // 초기 데이터를 비트코인으로 설정
        const getInitialData = async () => {
            try {
                const response = await axios.post(`${API_URL}/get_all_crypto/`, {}, {
                    withCredentials: true,
                });
                dispatch(setSelectedCrypto(response.data.all_crypto[0]));
                dispatch(setCryptoRealTime(response.data.all_crypto[0]));
            } catch (error) {
                dispatch(showNoticeModal('서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.'));
            }
        };

        getInitialData();
    }, []);

    return (
        <div className="container">
            <WorkingSpinnerModal
                isModalOpen={workingSpinner}
                setIsModalOpen={() => dispatch(setWorkingSpinner(false))} />
            <NoticeModal
                isModalOpen={noticeModal.isOpen}
                setIsModalOpen={() => dispatch(hideNoticeModal())}
                content={noticeModal.content} />
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}