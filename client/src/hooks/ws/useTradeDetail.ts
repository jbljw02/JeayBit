import { useState, useEffect } from 'react';
import { TradeDetail } from '../../types/crypto.type';
import { subscribe, unsubscribe } from '../../services/ws/baseWebSocket';

// 체결내역 데이터에 API 응답 형식 추가
interface TradeDetailData extends TradeDetail {
    type: string;
    code: string;
}

// 특정 마켓의 체결내역을 구독
export const useTradeDetail = (selectedMarket: string = 'KRW-BTC') => {
    const [trade, setTrade] = useState<TradeDetail | null>(null);
    
    useEffect(() => {
        const tradeDetailUpdate = (data: TradeDetailData) => {
            if (data.code !== selectedMarket) return;

            setTrade({
                tradePrice: data.tradePrice,
                tradeVolume: data.tradeVolume,
                askBid: data.askBid,
                timestamp: data.timestamp,
            });
        };

        subscribe("trade", tradeDetailUpdate, selectedMarket);

        return () => {
            unsubscribe("trade", tradeDetailUpdate, selectedMarket);
        };
    }, [selectedMarket]);

    return trade;
};