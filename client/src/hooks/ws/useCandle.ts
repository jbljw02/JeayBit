import { useState, useEffect } from 'react';
import { Candle } from '../../types/crypto.type';
import { subscribe, unsubscribe } from '../../services/ws/baseWebSocket';

// 초 단위 캔들 데이터에 API 응답 형식 추가
interface CandleData extends Candle {
    type: string;
    code: string;
}

// 특정 마켓의 초 단위 캔들 데이터를 구독
export const useCandle = (selectedMarket: string = 'KRW-BTC') => {
    const [candle, setCandle] = useState<Candle | null>(null);

    useEffect(() => {
        const candleUpdate = (data: CandleData) => {
            if (data.code !== selectedMarket) return;
            
            setCandle({
                market: data.code,
                candleDateTimeUtc: data.candleDateTimeUtc,
                candleDateTimeKst: data.candleDateTimeKst,
                openingPrice: data.openingPrice,
                highPrice: data.highPrice,
                lowPrice: data.lowPrice,
                tradePrice: data.tradePrice,
                timestamp: data.timestamp,
            });
        };

        subscribe("candle.1s", candleUpdate, selectedMarket);

        return () => {
            unsubscribe("candle.1s", candleUpdate, selectedMarket);
        };
    }, [selectedMarket]);

    return candle;
};