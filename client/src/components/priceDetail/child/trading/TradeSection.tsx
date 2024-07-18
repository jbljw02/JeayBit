import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import BuyingSection from "./section/BuyingSection";
import SellingSection from "./section/SellingSection";
import TradeHistory from "./history/TradeHistory";
import { useState, useEffect } from "react";
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
    const dispatch = useDispatch();

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
    }, [user])

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/trade_updates/');

        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const celeryMessage = data.message;
            setCeleryData({
                name: celeryMessage.crypto_name,
                tradeTime: celeryMessage.trade_time,
                tradeCategory: celeryMessage.trade_category,
                price: celeryMessage.crypto_price,
            })
            setCeleryModal(true);
        };

        socket.onerror = function (e) {
            console.error("WebSocket error:", e);
        };
    }, []);

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