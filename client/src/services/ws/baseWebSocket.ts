import { v4 as uuidv4 } from 'uuid';

export let websocket: WebSocket | null = null;
let isConnecting = false;
let reconnectTimeout: NodeJS.Timeout;

interface WebSocketMessage {
    type: string;
    codes: string[];
}

export const initializeWebSocket = (
    messages: WebSocketMessage[],
    onMessage: (data: any) => void
) => {
    if (isConnecting) return;

    const createMessage = () => JSON.stringify([
        { ticket: uuidv4() },
        ...messages
    ]);

    if (websocket?.readyState === WebSocket.OPEN) {
        try {
            websocket.send(createMessage());
            return;
        } catch (error) {
            console.error("웹소켓 메시지 전송 에러: ", error);
        }
    }

    if (websocket) {
        clearTimeout(reconnectTimeout);
        websocket.close();
        websocket = null;
    }

    isConnecting = true;
    websocket = new WebSocket('wss://api.upbit.com/websocket/v1');

    websocket.onopen = () => {
        isConnecting = false;
        try {
            websocket?.send(createMessage());
        } catch (error) {
            console.error("웹소켓 메시지 전송 에러: ", error);
        }
    };

    websocket.onerror = (error) => {
        isConnecting = false;
        console.error("웹소켓 연결 에러: ", error);
    };

    websocket.onclose = (event) => {
        isConnecting = false;
        if (!event.wasClean) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(() => {
                initializeWebSocket(messages, onMessage);
            }, 3000);
        }
    };

    websocket.onmessage = async (event) => {
        const data = JSON.parse(await event.data.text());
        onMessage(data);
    };
};