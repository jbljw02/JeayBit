import { useDispatch, useSelector } from "react-redux";
import { RootState, setSectionChange } from "../../../../redux/store";
import BuyingSection from "./BuyingSection";
import SellingSection from "./SellingSection";
import TradeHistory from "./history/TradeHistory";
import { useState, useEffect } from "react";
import CeleryCompleteModal from "../../../modal/CeleryCompleteModal";
import CompleteModal from "../../../modal/CompleteModal";

export type CeleryData = {
    name: string,
    tradeTime: Date | string,
    tradeCategory: string,
    price: number,
}

export default function TradeSection() {
    const dispatch = useDispatch();
    const sectionChange = useSelector((state: RootState) => state.sectionChange);

    const [celeryModal, setCeleryModal] = useState(false);
    const [celeryData, setCeleryData] = useState<CeleryData>({
        name: "",
        tradeTime: "",
        tradeCategory: "",
        price: 0,
    });

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/trade_updates/');

        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log("거래 체결: ", data.message);
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

    }, [])

    return (
        <>
            <CeleryCompleteModal
                isModalOpen={celeryModal}
                setIsModalOpen={setCeleryModal}
                celeryData={celeryData} />
            <div className="div-trading">
                <div className="trading-section lightMode-title">
                    <span
                        className={`${sectionChange === '매수' ?
                            'buyingSection' :
                            ''
                            }`}
                        onClick={() => dispatch(setSectionChange('매수'))}>매수</span>
                    <span
                        className={`${sectionChange === '매도' ?
                            'sellingSection' :
                            ''
                            }`}
                        onClick={() => dispatch(setSectionChange('매도'))}>매도</span>
                    <span
                        className={`${sectionChange === '거래내역' ?
                            'tradingHistorySection' :
                            ''
                            }`}
                        onClick={() => dispatch(setSectionChange('거래내역'))}>거래내역</span>
                </div>
                {
                    sectionChange === '매수' ?
                        <BuyingSection /> :
                        (
                            sectionChange === '매도' ?
                                <SellingSection /> :
                                <TradeHistory />
                        )
                }
            </div>
        </>
    )
}