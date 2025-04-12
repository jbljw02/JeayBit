import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import camelcaseKeys from 'camelcase-keys';
import { MarketPrice } from '../../types/crypto.type';
import { initializeWebSocket } from '../../services/ws/baseWebSocket';

interface MarketInfo {
    market: string;
    koreanName: string;
}

let markets: string[] = [];
let marketInfoMap: Record<string, string> = {};
let currentMarketPrices: Record<string, MarketPrice> = {};

const subscribers = new Set<(market: string, price: MarketPrice) => void>();

const tickerUpdate = (data: any) => {
    if (data.type !== "ticker") return;

    const market = data.code;
    if (!marketInfoMap[market]) return;

    const updatedPrice = {
        name: marketInfoMap[market],
        price: data.tradePrice,
        market: market,
        change: data.change,
        changeRate: data.changeRate,
        changePrice: data.changePrice,
        tradePrice: data.tradePrice,
        tradeVolume: data.tradeVolume,
        openPrice: data.openingPrice,
        highPrice: data.highPrice,
        lowPrice: data.lowPrice,
    };

    currentMarketPrices[market] = updatedPrice;
    subscribers.forEach(callback => callback(market, updatedPrice));
};

// 전체 마켓 목록 조회 및 초기값 설정
export const useMarkets = () => {
    const [marketList, setMarketList] = useState<string[]>([]);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const marketResponse = await axios.get<MarketInfo[]>('https://api.upbit.com/v1/market/all');
                const marketList = camelcaseKeys(marketResponse.data as Record<string, any>, { deep: true });

                const { krwMarkets, newMarketInfoMap } = marketList
                    .reduce<{ krwMarkets: string[], newMarketInfoMap: Record<string, string> }>((acc, item) => {
                        if (item.market.startsWith('KRW-')) {
                            acc.krwMarkets.push(item.market);
                            acc.newMarketInfoMap[item.market] = item.koreanName;
                        }
                        return acc;
                    }, { krwMarkets: [], newMarketInfoMap: {} });

                marketInfoMap = newMarketInfoMap;
                markets = krwMarkets;
                setMarketList(krwMarkets);

                const messageConfig = {
                    type: "ticker",
                    codes: krwMarkets
                };

                // 웹소켓 연결 초기화
                initializeWebSocket([messageConfig], tickerUpdate);

            } catch (error) {
                console.error('Failed to fetch market data:', error);
            }
        };

        fetchMarkets();
    }, []);

    return marketList;
};

// 특정 마켓의 실시간 가격을 구독
export const useMarketPrice = (market: string) => {
    const [price, setPrice] = useState<MarketPrice | null>(null);

    useEffect(() => {
        // 콜백 함수: 실시간 가격 업데이트
        const callback = (updatedMarket: string, updatedPrice: MarketPrice) => {
            if (updatedMarket === market) {
                setPrice(updatedPrice);
            }
        };

        // 구독자 등록
        subscribers.add(callback);

        // 초기 데이터가 있다면 설정
        if (currentMarketPrices[market]) {
            setPrice(currentMarketPrices[market]);
        }

        return () => {
            subscribers.delete(callback);
        };
    }, [market]);

    return price;
};