import CryptoList from '../components/crypto-list/CryptoList';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from '../components/auth/SignUp';
import Chart from '../components/chart/Chart';
import CryptoDetail from '../components/crypto-info/CryptoDetail';
import NoticeModal from '../components/modal/common/NoticeModal';
import CryptoHeader from '../components/crypto-info/CryptoHeader';
import WorkingSpinnerModal from '../components/modal/trade/WorkingSpinnerModal';
import { setWorkingSpinner } from '../redux/features/ui/placeholderSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import KakaoCallback from '../components/auth/child/KakaoCallback';
import { hideNoticeModal } from '../redux/features/ui/modalSlice';
import Login from '../components/auth/Login';
import Header from '../components/header/Header';
import TradeSection from '../components/trading/TradeSection';
import '../styles/App.css';
import OrderBook from '../components/order-book/OrderBook';
import useGetTradeHistory from '../hooks/trade/useGetTradeHistory';
import useGetAllCryptoInterval from '../hooks/crypto/useGetAllCryptoInterval';
import useInitialWork from '../hooks/crypto/useInitialWork';
import { useEffect } from 'react';
import checkCurrentScreen from '../utils/responsive/checkCurrentScreen';
import MobileDetail from '../components/responsive/components/MobileDetail';

export default function Home() {
    const dispatch = useAppDispatch();

    const workingSpinner = useAppSelector(state => state.workingSpinner);
    const noticeModal = useAppSelector(state => state.noticeModal);

    useEffect(() => {
        // 실제 뷰포트 높이를 계산하고 CSS 변수로 설정하는 함수
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        // 초기 실행
        setVH();

        // 화면 크기가 변할 때마다 뷰포트 높이 계산
        window.addEventListener('resize', setVH);

        // orientationchange 이벤트 리스너(화면 회전)
        window.addEventListener('orientationchange', setVH);

        return () => {
            window.removeEventListener('resize', setVH);
            window.removeEventListener('orientationchange', setVH);
        };
    }, []);

    useInitialWork();
    useGetTradeHistory();
    useGetAllCryptoInterval();

    return (
        <div className="container">
            <WorkingSpinnerModal
                isModalOpen={workingSpinner}
                setIsModalOpen={() => dispatch(setWorkingSpinner(false))} />
            <NoticeModal
                isModalOpen={noticeModal.isOpen}
                setIsModalOpen={() => dispatch(hideNoticeModal())} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <header className="header">
                                <Header />
                            </header>
                            {
                                checkCurrentScreen().device === 'mobile' || checkCurrentScreen().device === 'tablet' ? (
                                    <div className='contents-container'>
                                        <aside className="crypto-list">
                                            <CryptoList />
                                        </aside>
                                    </div>
                                ) :
                                    (
                                        <div className='contents-container'>
                                            <article className='crypto-info'>
                                                <CryptoHeader />
                                                <CryptoDetail />
                                                <Chart />
                                            </article>
                                            <article className='price-detail'>
                                                <OrderBook />
                                                <TradeSection />
                                            </article>
                                            <aside className="crypto-list">
                                                <CryptoList />
                                            </aside>
                                        </div>
                                    )
                            }
                        </>
                    } />
                    <Route path="/detail/*" element={
                        checkCurrentScreen().device !== 'desktop' ?
                            <MobileDetail /> :
                            <Navigate to="/" replace />
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}