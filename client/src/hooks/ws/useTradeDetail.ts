import { useState, useEffect } from 'react';
import { TradeDetail } from '../../types/crypto.type';
import { initializeWebSocket } from '../../services/ws/baseWebSocket';

// 체결내역 업데이트 구독자 관리
const tradeSubscribers = new Set<(trade: TradeDetail) => void>();

const tradeDetailUpdate = (data: any) => {
    if (data.type !== "trade") return;

    const tradeData: TradeDetail = {
        tradePrice: data.tradePrice,
        tradeVolume: data.tradeVolume,
        askBid: data.askBid,
        timestamp: data.timestamp,
    };

    tradeSubscribers.forEach(callback => callback(tradeData));
};

// 특정 마켓의 체결내역을 구독
export const useTradeDetail = (selectedMarket: string) => {
    const [trade, setTrade] = useState<TradeDetail | null>(null);

    useEffect(() => {
        const messageConfig = {
            type: "trade",
            codes: [selectedMarket]
        };

        // 체결내역 업데이트 구독
        tradeSubscribers.add(setTrade);

        // 마켓 변경 시 웹소켓 구독 정보 업데이트
        initializeWebSocket([messageConfig], tradeDetailUpdate);

        return () => {
            tradeSubscribers.delete(setTrade);
        };
    }, [selectedMarket]);

    return trade;
};