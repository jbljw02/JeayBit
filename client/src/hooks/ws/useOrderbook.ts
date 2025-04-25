import { useState, useEffect } from 'react';
import { Orderbook } from '../../types/crypto.type';
import { subscribe, unsubscribe } from '../../services/ws/baseWebSocket';

// 호가내역 데이터에 API 응답 형식 추가
interface OrderbookData {
    type: string;
    code: string;
    orderbookUnits: Orderbook[];
    timestamp: number;
}

// 특정 마켓의 호가내역을 구독
export const useOrderbook = (selectedMarket: string = 'KRW-BTC') => {
    const [orderbook, setOrderbook] = useState<Orderbook | null>(null);

    useEffect(() => {
        const orderbookUpdate = (data: OrderbookData) => {
            if (data.code !== selectedMarket) return;

            setOrderbook({
                askPrice: data.orderbookUnits[0].askPrice,
                askSize: data.orderbookUnits[0].askSize,
                bidPrice: data.orderbookUnits[0].bidPrice,
                bidSize: data.orderbookUnits[0].bidSize,
                timestamp: data.timestamp,
            });
        };

        subscribe("orderbook", orderbookUpdate, selectedMarket);

        return () => unsubscribe("orderbook", orderbookUpdate, selectedMarket);
    }, [selectedMarket]);

    return orderbook;
};