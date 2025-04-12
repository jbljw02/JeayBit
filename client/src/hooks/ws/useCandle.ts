import { useState, useEffect } from 'react';
import { Candle } from '../../types/crypto.type';
import { initializeWebSocket } from '../../services/ws/baseWebSocket';

// 초 단위 캔들 업데이트 구독자 관리
const candleSubscribers = new Set<(candle: Candle) => void>();

const candleUpdate = (data: any) => {
    if (data.type !== "candle.1s") return;

    const candleData: Candle = {
        market: data.code,
        candleDateTimeUtc: data.candleDateTimeUtc,
        candleDateTimeKst: data.candleDateTimeKst,
        openingPrice: data.openingPrice,
        highPrice: data.highPrice,
        lowPrice: data.lowPrice,
        tradePrice: data.tradePrice,
        timestamp: data.timestamp,
    };
    
    // 구독자들에게 업데이트된 데이터 전달
    candleSubscribers.forEach(callback => callback(candleData));
};

// 특정 마켓의 초 단위 캔들 데이터를 구독
export const useCandle = (selectedMarket: string) => {
    const [candle, setCandle] = useState<Candle | null>(null);

    useEffect(() => {
        const messageConfig = {
            type: "candle.1s",
            codes: [selectedMarket]
        };

        // 초 단위 캔들 데이터 업데이트 구독자 등록
        candleSubscribers.add(setCandle);

        // 마켓 변경 시 웹소켓 구독 정보 업데이트
        initializeWebSocket([messageConfig], candleUpdate);

        return () => {
            candleSubscribers.delete(setCandle);
        };
    }, [selectedMarket]);

    return candle;
};