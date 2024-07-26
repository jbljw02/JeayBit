import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import BuyingSection from "./section/BuyingSection";
import SellingSection from "./section/SellingSection";
import TradeHistory from "./history/TradeHistory";
import { useState, useEffect, useRef } from "react";
import CeleryCompleteModal from "../../../modal/trade/CeleryCompleteModal";
import useFunction from "../../../useFuction";
import '../../../../styles/priceDetail/trading/tradeSection.css'
import PlaceholderDisplay from "../../../placeholder/PlaceholderDisplay";

export type CeleryData = {
    name: string,
    tradeTime: Date | string,
    tradeCategory: string,
    price: number,
}

export const bidSortOptions = [
    { id: 'radio1', value: '지정가', label: '지정가' },
    { id: 'radio2', value: '시장가', label: '시장가' },
];

export default function TradeSection() {
    const { getBalance } = useFunction();

    const [sectionChange, setSectionChange] = useState<'매수' | '매도' | '거래내역'>('매수');
    const user = useSelector((state: RootState) => state.user);

    const [celeryModal, setCeleryModal] = useState(false);
    const [celeryData, setCeleryData] = useState<CeleryData>({
        name: "",
        tradeTime: "",
        tradeCategory: "",
        price: 0,
    });

    useEffect(() => {
        if (user.email && user.name) {
            getBalance(user.email);
        }
    }, [user]);

    // 미체결 거래가 체결될 시 웹소켓을 통해 결과를 받음
    // useEffect(() => {
    //     const socket = new WebSocket('wss://jeaybit.onrender.com/ws/trade_updates/');

    //     socket.onopen = () => {
    //         console.log("WebSocket 연결 성공");
    //     };

    //     socket.onmessage = (e) => {
    //         const data = JSON.parse(e.data);
    //         console.log("메시지 수신: ", data);
    //         const celeryMessage = data.message;
    //         setCeleryData({
    //             name: celeryMessage.crypto_name,
    //             tradeTime: celeryMessage.trade_time,
    //             tradeCategory: celeryMessage.trade_category,
    //             price: celeryMessage.crypto_price,
    //         });
    //         setCeleryModal(true);
    //     };

    //     socket.onerror = (error) => {
    //         console.log("WebSocket 에러: ", error);
    //     };

    //     socket.onclose = (event) => {
    //         if (event.wasClean) {
    //             console.log(`WebSocket 연결이 깨끗하게 종료됨, 코드=${event.code} 이유=${event.reason}`);
    //         } else {
    //             console.log('WebSocket 연결이 비정상적으로 종료됨, ', event);
    //         }
    //     };

    //     return () => {
    //         socket.close();
    //     };
    // }, []);

    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const socketRef = useRef<WebSocket | null>(null);

    const connectWebSocket = () => {
        const socket = new WebSocket('wss://jeaybit.onrender.com/ws/trade_updates/');
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket 연결 성공");
            setConnectionAttempts(0); // 연결 성공 시 재시도 횟수 초기화
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const celeryMessage = data.message;
            setCeleryData({
                name: celeryMessage.crypto_name,
                tradeTime: celeryMessage.trade_time,
                tradeCategory: celeryMessage.trade_category,
                price: celeryMessage.crypto_price,
            });
            setCeleryModal(true);
        };

        socket.onclose = (event) => {
            if (event.wasClean) {
                return;
            } else {
                if (connectionAttempts <= 4) {
                    setConnectionAttempts(prev => prev + 1); // 연결 실패 시 재시도 횟수 증가
                }
            }
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        // 최소한 한 번의 연결 시도가 실패했을 때
        if (connectionAttempts > 0) {
            // 각 재연결 시도 사이 대기 시간을 점진적으로 증가시키되, 10초를 넘기지 않음
            const timeout = Math.min(10000, connectionAttempts * 1000);
            const timer = setTimeout(() => {
                connectWebSocket();
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [connectionAttempts]);

    return (
        <>
            <CeleryCompleteModal
                isModalOpen={celeryModal}
                setIsModalOpen={setCeleryModal}
                celeryData={celeryData} />
            <div className="trade-section">
                <div className="trade-header no-drag">
                    <span
                        className={`${sectionChange === '매수' ?
                            'buying-section' :
                            ''}`}
                        onClick={() => setSectionChange('매수')}>매수</span>
                    <span
                        className={`${sectionChange === '매도' ?
                            'selling-section' :
                            ''}`}
                        onClick={() => setSectionChange('매도')}>매도</span>
                    <span
                        className={`${sectionChange === '거래내역' ?
                            'trading-history-section' :
                            ''}`}
                        onClick={() => setSectionChange('거래내역')}>거래내역</span>
                </div>
                {
                    sectionChange === '매수' ?
                        <BuyingSection /> :
                        (
                            sectionChange === '매도' ?
                                <SellingSection /> :
                                (
                                    user.name && user.email ?
                                        <TradeHistory /> :
                                        <PlaceholderDisplay content="로그인 후 확인하실 수 있습니다." />
                                )
                        )
                }
            </div>
        </>
    )
}