import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// 전역 변수로 웹소켓 인스턴스와 구독자 관리
// 웹소켓은 앱 전체에서 하나의 연결만 유지
let websocket: WebSocket | null = null;
// Map으로 각 마켓별 구독자 관리 (key: 마켓코드, value: 가격 업데이트 콜백 함수들의 Set)
const priceSubscribers = new Map<string, Set<(price: number) => void>>();

// 웹소켓 연결 초기화 및 실시간 데이터 수신
const initializeWebSocket = (markets: string[]) => {
    // 이미 웹소켓이 연결돼있다면 새로 연결 X
    if (websocket?.readyState === WebSocket.OPEN) return;

    websocket = new WebSocket('wss://api.upbit.com/websocket/v1');

    // 웹소켓 연결 성공 시
    websocket.onopen = () => {
        const message = JSON.stringify([
            { ticket: uuidv4()}, // 식별자
            {
                type: "ticker", // 현재가 정보 요청
                codes: markets // 구독할 마켓 코드들
            }
        ]);
        websocket?.send(message);
    };

    console.log(priceSubscribers)

    // 웹소켓 데이터 수신 처리
    websocket.onmessage = async (event) => {
        // Blob 형태의 데이터를 JSON으로 파싱
        const data = JSON.parse(await event.data.text());
        const market = data.code; // 마켓 코드
        const currentPrice = data.trade_price; // 현재가

        // 해당 마켓을 구독 중인 모든 컴포넌트에 가격 전달
        priceSubscribers.get(market)?.forEach(callback => callback(currentPrice));
    };

    // 연결이 끊어지면 3초 후 재연결 시도
    websocket.onclose = () => {
        setTimeout(() => initializeWebSocket(markets), 3000);
    };
};

// 마켓 목록 조회 및 웹소켓 연결 초기화
export const useMarkets = () => {
    const [markets, setMarkets] = useState<string[]>([]);

    useEffect(() => {
        const fetchMarkets = async () => {
            // 전체 마켓 목록 조회
            const response = await axios.get('https://api.upbit.com/v1/market/all');

            // 원화 마켓만 필터링
            const krwMarkets = response.data
                .filter((item: any) => item.market.startsWith('KRW-'))
                .map((item: any) => item.market);

            setMarkets(krwMarkets);

            // 전체 마켓 목록으로 웹소켓 연결 초기화
            initializeWebSocket(krwMarkets);
        };

        fetchMarkets();
    }, []);

    return markets;
};

// 특정 마켓의 실시간 가격을 구독
export const useMarketPrice = (market: string) => {
    const [price, setPrice] = useState<number>(0);

    useEffect(() => {
        // 해당 마켓에 대한 구독자 Set이 없으면 새로 생성
        if (!priceSubscribers.has(market)) {
            priceSubscribers.set(market, new Set());
        }

        // 구독자 목록에 현재 컴포넌트의 가격 업데이트 함수 추가
        priceSubscribers.get(market)?.add(setPrice);

        return () => {
            priceSubscribers.get(market)?.delete(setPrice);
        };
    }, [market]);

    return price;
};