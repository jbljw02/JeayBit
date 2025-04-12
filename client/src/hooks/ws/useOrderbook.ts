import { useState, useEffect } from 'react';
import { Orderbook } from '../../types/crypto.type';
import { initializeWebSocket } from '../../services/ws/baseWebSocket';

// 호가내역 업데이트 구독자 관리
const orderbookSubscribers = new Set<(orderbook: Orderbook) => void>();

const orderbookUpdate = (data: any) => {
    if (data.type !== "orderbook") return;

    const orderbookData: Orderbook = {
        askPrice: data.orderbookUnits[0].askPrice,
        askSize: data.orderbookUnits[0].askSize,
        bidPrice: data.orderbookUnits[0].bidPrice,
        bidSize: data.orderbookUnits[0].bidSize,
        timestamp: data.timestamp,
    };

    orderbookSubscribers.forEach(callback => callback(orderbookData));
};

// 특정 마켓의 호가내역을 구독
export const useOrderbook = (selectedMarket: string) => {
    const [orderbook, setOrderbook] = useState<Orderbook | null>(null);

    useEffect(() => {
        const messageConfig = {
            type: "orderbook",
            codes: [selectedMarket]
        };

        // 구독자 등록
        orderbookSubscribers.add(setOrderbook);

        // 마켓 변경 시 웹소켓 구독 정보 업데이트
        initializeWebSocket([messageConfig], orderbookUpdate);

        return () => {
            orderbookSubscribers.delete(setOrderbook);
        };
    }, [selectedMarket]);

    return orderbook;
};