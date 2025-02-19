export type Market = {
    market: string;
    candleDateTimeUtc: string;
    candleDateTimeKst: string;
    openingPrice: number;
    highPrice: number;
    lowPrice: number;
    tradePrice: number;
    timestamp: number;
};

export type ChartSortDate = '1일' | '1주' | '1개월';
export type ChartSortTime = '1분' | '5분' | '10분' | '30분' | '1시간' | '4시간' | '';