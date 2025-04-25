export type Crypto = {
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
    isFavorited: boolean,
    isOwned: boolean,
    ownedQuantity: number,
}

export type SelectedCrypto = {
    name: string,
    market: string,
}

export type FavoriteCrypto = {
    cryptoName: string,
    isFavorited: boolean
}

export type OwnedCrypto = {
    name: string,
    isOwned: boolean,
    ownedQuantity: number,
}

export type ListCategory = '원화' | '보유' | '관심'

export type AskingData = {
    askPrice: number,
    askSize: number,
    bidPrice: number,
    bidSize: number,
    timestamp: number,
}

export type ClosedData = {
    tradeDateUtc: string,
    tradeTimeUtc: string,
    tradePrice: number,
    tradeVolume: number,
    askBid: string,
    timestamp: number,
}

// 체결내역
export interface TradeDetail {
    tradePrice: number,
    tradeVolume: number,
    askBid: string,
    timestamp: number,
}

// 호가내역
export interface Orderbook {
    askPrice: number,
    askSize: number,
    bidPrice: number,
    bidSize: number,
    timestamp: number,
}

// 캔들 데이터
export interface Candle {
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
export interface MarketPrice {
    name: string,
    price: number,
    market: string,
    change: string,
    changeRate: number,
    changePrice: number,
    tradePrice: number,
    tradeVolume: number,
    openingPrice: number,
    highPrice: number,
    lowPrice: number,
}