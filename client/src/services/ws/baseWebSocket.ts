import { v4 as uuidv4 } from 'uuid';
import camelcaseKeys from 'camelcase-keys';
import { initializeMarkets } from './marketService';

// 웹소켓 연결 관리
export let websocket: WebSocket | null = null;

let isConnecting = false; // 연결 중인지 여부
let reconnectTimeout: NodeJS.Timeout; // 재연결 타이머
let isInitialized = false; // 웹소켓 초기화 여부

interface WebSocketMessage {
    type: "ticker" | "trade" | "orderbook" | "candle.1s"
    codes: string[];
}

// 구독 관리를 위한 Map
const subscriptions = new Map<string, Set<(data: any) => void>>();

// 구독 중인 마켓 코드 관리
const subscribedMarkets = new Map<WebSocketMessage['type'], Set<string>>();

// 특정 마켓의 웹소켓 데이터 구독
export const subscribe = async (type: WebSocketMessage['type'], callback: (data: any) => void, marketCode: string) => {
    // 해당 타입의 구독자 목록을 가져오거나 새로 생성
    const subscribers = subscriptions.get(type) || new Set();

    // 새로운 콜백 함수를 구독자 목록에 추가
    subscribers.add(callback);

    // 업데이트된 구독자 목록을 저장
    subscriptions.set(type, subscribers);

    // 해당 타입의 구독 중인 마켓 목록을 가져오거나 새로 생성
    const markets = subscribedMarkets.get(type) || new Set();

    // 새로운 마켓 코드를 구독 목록에 추가
    markets.add(marketCode);

    // 업데이트된 마켓 목록을 저장
    subscribedMarkets.set(type, markets);

    // 웹소켓이 초기화되지 않았다면 초기화 진행
    if (!isInitialized) {
        await initializeWebSocket();
    }
    // 이미 초기화되어 있고 연결이 열려있다면 새로운 구독 정보 전송
    else if (websocket?.readyState === WebSocket.OPEN) {
        sendSubscriptionMessage();
    }
};

// 특정 마켓의 웹소켓 데이터 구독 해제
export const unsubscribe = (type: WebSocketMessage['type'], callback: (data: any) => void, marketCode: string) => {
    // 구독 콜백 제거
    const subscribers = subscriptions.get(type);
    if (subscribers) {
        subscribers.delete(callback);
    }

    // 마켓 코드 구독 해제
    const markets = subscribedMarkets.get(type);
    if (markets) {
        markets.delete(marketCode);
        // 해당 타입의 구독 중인 마켓이 없다면 타입 자체를 제거
        if (markets.size === 0) {
            subscribedMarkets.delete(type);
        }
    }

    // 구독 정보가 변경되었으므로 업데이트된 구독 정보 전송
    if (websocket?.readyState === WebSocket.OPEN) {
        sendSubscriptionMessage();
    }
};

// 구독 메시지 생성 및 전송
const sendSubscriptionMessage = () => {
    const messages = Array.from(subscribedMarkets.entries()).map(([type, markets]) => ({
        type,
        codes: Array.from(markets)
    }));

    if (messages.length === 0) return;

    const message = JSON.stringify([
        { ticket: uuidv4() },
        ...messages
    ]);

    try {
        websocket?.send(message);
    } catch (error) {
        console.error("웹소켓 메시지 전송 에러:", error);
    }
};

// 웹소켓 초기화
export const initializeWebSocket = async () => {
    if (isInitialized) return;

    try {
        await initializeMarkets();

        const messageConfigs = Array.from(subscribedMarkets.entries()).map(([type, markets]) => ({
            type,
            codes: Array.from(markets)
        }));

        manageWebSocket(messageConfigs, (data) => {
            const subscribers = subscriptions.get(data.type);
            subscribers?.forEach(callback => callback(data));
        });

        isInitialized = true;
    } catch (error) {
        console.error("웹소켓 초기화 실패:", error);
        throw error;
    }
};

// 웹소켓 연결 초기화 및 실시간 데이터 수신
export const manageWebSocket = (
    messages: WebSocketMessage[],
    onMessage: (data: any) => void
) => {
    if (isConnecting) return; // 이미 연결 시도 중이면 중지
    const createMessage = () => JSON.stringify([
        { ticket: uuidv4() },
        ...messages
    ]);

    // 이미 연결된 경우 메시지 전송
    if (websocket?.readyState === WebSocket.OPEN) {
        try {
            websocket.send(createMessage());
            return;
        } catch (error) {
            console.error("웹소켓 메시지 전송 에러: ", error);
        }
    }

    // 이미 연결된 경우 종료
    if (websocket) {
        clearTimeout(reconnectTimeout); // 재연결 타이머 초기화
        websocket.close(); // 연결 종료
        websocket = null; // 연결 객체 초기화
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
                manageWebSocket(messages, onMessage);
            }, 3000); // 3초 후 재연결
        }
    };

    // 메시지 수신 시
    websocket.onmessage = async (event) => {
        const data = camelcaseKeys(JSON.parse(await event.data.text()), { deep: true });
        const subscribers = subscriptions.get(data.type);
        subscribers?.forEach(callback => callback(data));
    };
};