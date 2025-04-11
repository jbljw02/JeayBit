import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from '../api/axios';
import camelcaseKeys from 'camelcase-keys';

// 체결내역
interface TradeData {
    tradePrice: number,
    tradeVolume: number,
    askBid: string,
    timestamp: number,
}

// 호가내역
interface OrderbookData {
    askPrice: number,
    askSize: number,
    bidPrice: number,
    bidSize: number,
    timestamp: number,
}

// 캔들 데이터
interface CandleData {
    market: string;
    candleDateTimeUtc: string;
    candleDateTimeKst: string;
    openingPrice: number;
    highPrice: number;
    lowPrice: number;
    tradePrice: number;
    timestamp: number;
}

// 가격 정보
interface MarketPrice {
    name: string,
    price: number,
    market: string,
    change: string,
    changeRate: number,
    changePrice: number,
    tradePrice: number,
    tradeVolume: number,
    openPrice: number,
    highPrice: number,
    lowPrice: number,
}

// 마켓 정보
type MarketInfo = {
    market: string;
    koreanName: string;
}

// 전역 변수로 웹소켓 인스턴스와 구독자 관리
let websocket: WebSocket | null = null;

// 실시간 가격 업데이트 구독자 관리
const subscribers = new Set<(market: string, price: MarketPrice) => void>();
// 체결내역 업데이트 구독자 관리
const tradeSubscribers = new Set<(trade: TradeData) => void>();
// 호가내역 업데이트 구독자 관리
const orderbookSubscribers = new Set<(orderbook: OrderbookData) => void>();
// 초 단위 캔들 업데이트 구독자 관리
const candleSubscribers = new Set<(candle: CandleData) => void>();

// 모든 마켓의 현재가 관리
let currentMarketPrices: Record<string, MarketPrice> = {};
// 전체 마켓 목록을 전역 변수로 관리
let markets: string[] = [];

let isConnecting = false; // 연결 중인지 여부
let reconnectTimeout: NodeJS.Timeout; // 재연결 타이머

// 마켓 목록 조회 및 웹소켓 연결 초기화
export const useMarkets = () => {
    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                // 전체 마켓 목록 조회
                const marketResponse = await axios.get<MarketInfo[]>('https://api.upbit.com/v1/market/all');
                const marketList = camelcaseKeys(marketResponse.data, { deep: true });

                // 전체 원화 마켓 데이터를 배열 및 맵 형태로 반환
                const { krwMarkets, marketInfoMap } = marketList
                    .reduce<{ krwMarkets: string[], marketInfoMap: Record<string, string> }>((acc, item) => {
                        if (item.market.startsWith('KRW-')) {
                            acc.krwMarkets.push(item.market);
                            acc.marketInfoMap[item.market] = item.koreanName;
                        }
                        return acc;
                    }, { krwMarkets: [], marketInfoMap: {} });

                // 초기 화폐 가격 요청
                const cryptoResponse = await axios.get('https://api.upbit.com/v1/ticker?markets=' + krwMarkets.join(','));
                const cryptoList = camelcaseKeys(cryptoResponse.data, { deep: true });

                // 초기 데이터에 화폐명 추가
                cryptoList.forEach((item: any) => {
                    const market = item.market;
                    currentMarketPrices[market] = {
                        name: marketInfoMap[market], // 화폐명(한글)
                        price: item.tradePrice,
                        market: market,
                        change: item.change,
                        changeRate: item.changeRate,
                        changePrice: item.changePrice,
                        tradePrice: item.accTradePrice24h,
                        tradeVolume: item.accTradeVolume24h,
                        openPrice: item.openingPrice,
                        highPrice: item.highPrice,
                        lowPrice: item.lowPrice,
                    };
                });

                // 모든 데이터가 설정된 후 구독자들에게 한 번에 알림
                Object.entries(currentMarketPrices).forEach(([market, price]) => {
                    subscribers.forEach(callback => callback(market, price));
                });

                markets = krwMarkets;
                initializeWebSocket(krwMarkets);
            } catch (error) {
                console.error('Failed to fetch market data:', error);
            }
        };

        fetchMarkets();
    }, []);

    return markets;
};

// 웹소켓 연결 초기화 및 실시간 데이터 수신
const initializeWebSocket = (markets: string[], selectedMarket: string = "KRW-BTC") => {
    // 이미 연결 시도 중이면 중지
    if (isConnecting) {
        return;
    }

    const createMessage = () => JSON.stringify([
        { ticket: uuidv4() },
        {
            type: "ticker", // 현재가
            codes: markets, // 모든 마켓
        },
        {
            type: "trade", // 체결내역
            codes: [selectedMarket],
        },
        {
            type: "orderbook", // 호가내역
            codes: [selectedMarket],
        },
        {
            type: "candle.1s", // 초 단위 캔들
            codes: [selectedMarket],
        }
    ]);

    // 이미 연결된 경우 메시지만 전송
    if (websocket?.readyState === WebSocket.OPEN) {
        try {
            websocket.send(createMessage());
            return;
        } catch (error) {
            console.error("웹소켓 메시지 전송 에러: ", error);
        }
    }

    // 연결 중이거나 닫는 중인 웹소켓 정리
    if (websocket) {
        clearTimeout(reconnectTimeout); // 재연결 타이머 초기화
        websocket.close(); // 연결 종료
        websocket = null; // 연결 인스턴스 초기화
    }

    // 새로운 웹소켓 연결
    isConnecting = true;
    websocket = new WebSocket('wss://api.upbit.com/websocket/v1');

    // 연결 성공 시
    websocket.onopen = () => {
        isConnecting = false;
        try {
            websocket?.send(createMessage());
        } catch (error) {
            console.error("웹소켓 메시지 전송 에러: ", error);
        }
    };

    // 연결 에러 시
    websocket.onerror = (error) => {
        isConnecting = false;
        console.error("웹소켓 연결 에러: ", error);
    };

    // 연결 종료 시
    websocket.onclose = (event) => {
        isConnecting = false;

        // 정상적인 종료가 아닐 경우 재연결
        if (!event.wasClean) {
            clearTimeout(reconnectTimeout); // 재연결 타이머 초기화
            reconnectTimeout = setTimeout(() => {
                initializeWebSocket(markets, selectedMarket);
            }, 3000); // 3초 대기 후 재연결
        }
    };

    // 메시지 수신 시
    websocket.onmessage = async (event) => {
        const data = camelcaseKeys(JSON.parse(await event.data.text()), { deep: true });
        const market = data.code;

        // 현재가 업데이트
        if (data.type === "ticker") {
            if (currentMarketPrices[market]) {
                const updatedPrice = {
                    ...currentMarketPrices[market],
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

                // 구독자들에게 업데이트된 데이터 전달
                subscribers.forEach(callback => callback(market, updatedPrice));
            }
        }
        // 체결내역 업데이트
        else if (data.type === "trade") {
            const tradeData: TradeData = {
                tradePrice: data.tradePrice,
                tradeVolume: data.tradeVolume,
                askBid: data.askBid,
                timestamp: data.timestamp,
            };

            tradeSubscribers.forEach(callback => callback(tradeData));
        }
        // 호가내역 업데이트
        else if (data.type === "orderbook") {
            const orderbookData: OrderbookData = {
                askPrice: data.orderbookUnits[0].askPrice,
                askSize: data.orderbookUnits[0].askSize,
                bidPrice: data.orderbookUnits[0].bidPrice,
                bidSize: data.orderbookUnits[0].bidSize,
                timestamp: data.timestamp,
            };

            orderbookSubscribers.forEach(callback => callback(orderbookData));
        }
        // 초 단위 캔들 업데이트
        else if (data.type === "candle.1s") {
            const candleData: CandleData = {
                market: data.code,
                candleDateTimeUtc: data.candleDateTimeUtc,
                candleDateTimeKst: data.candleDateTimeKst,
                openingPrice: data.openingPrice,
                highPrice: data.highPrice,
                lowPrice: data.lowPrice,
                tradePrice: data.tradePrice,
                timestamp: data.timestamp,
            };

            candleSubscribers.forEach(callback => callback(candleData));
        }
    };
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

// 특정 마켓의 체결내역을 구독
export const useMarketTrade = (selectedMarket: string) => {
    const [trade, setTrade] = useState<TradeData | null>(null);

    useEffect(() => {
        // 마켓 변경 시 웹소켓 구독 정보 업데이트
        initializeWebSocket(markets, selectedMarket);

        // 체결 내역을 업데이트하는 구독자 등록
        tradeSubscribers.add(setTrade);

        return () => {
            tradeSubscribers.delete(setTrade);
        };
    }, [selectedMarket]);

    return trade;
};

// 특정 마켓의 호가내역을 구독
export const useMarketOrderbook = (selectedMarket: string) => {
    const [orderbook, setOrderbook] = useState<OrderbookData | null>(null);

    useEffect(() => {
        // 디바운스 처리로 빈번한 호출 방지
        const timeoutId = setTimeout(() => {
            initializeWebSocket(markets, selectedMarket);
        }, 100);

        orderbookSubscribers.add(setOrderbook);

        return () => {
            clearTimeout(timeoutId);
            orderbookSubscribers.delete(setOrderbook);
        };
    }, [selectedMarket]);

    return orderbook;
};

// 특정 마켓의 캔들 데이터를 구독
export const useMarketCandle = (selectedMarket: string) => {
    const [candle, setCandle] = useState<CandleData | null>(null);

    useEffect(() => {
        // 마켓 변경 시 웹소켓 구독 정보 업데이트
        initializeWebSocket(markets, selectedMarket);

        // 초 단위 캔들 데이터를 업데이트하는 구독자 등록
        candleSubscribers.add(setCandle);

        return () => {
            candleSubscribers.delete(setCandle);
        };
    }, [selectedMarket]);

    return candle;
};