import { useEffect, useState } from 'react';
import { MarketPrice } from '../../types/crypto.type';
import { subscribe, unsubscribe } from '../../services/ws/baseWebSocket';
import { marketInfoMap } from '../../services/ws/marketService';

// 실시간 가격 데이터에 API 응답 형식 추가
interface TickerData extends MarketPrice {
    type: string;
    code: string;
}

// 특정 마켓의 실시간 가격을 구독
export const useMarketPrice = (market: string = 'KRW-BTC') => {
    const [price, setPrice] = useState<MarketPrice | null>(null);

    useEffect(() => {
        const marketPriceUpdate = (data: TickerData) => {
            if (data.code !== market) return;

            setPrice({
                name: marketInfoMap[market],
                price: data.tradePrice,
                market: data.code,
                change: data.change,
                changeRate: data.changeRate,
                changePrice: data.changePrice,
                tradePrice: data.tradePrice,
                tradeVolume: data.tradeVolume,
                openingPrice: data.openingPrice,
                highPrice: data.highPrice,
                lowPrice: data.lowPrice,
            });
        };

        subscribe("ticker", marketPriceUpdate, market);

        return () => {
            unsubscribe("ticker", marketPriceUpdate, market);
        };
    }, [market]);

    return price;
};

// 마켓 목록을 반환하는 훅 (필요한 경우에만 사용)
export const useMarketList = () => {
    return Object.keys(marketInfoMap);
};

// 마켓 정보를 반환하는 훅 (필요한 경우에만 사용)
export const useMarketInfo = (market: string) => {
    return marketInfoMap[market];
};