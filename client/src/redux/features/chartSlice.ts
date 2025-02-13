import { createSlice } from "@reduxjs/toolkit";

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

const initialDelimitedTime: ChartSortTime[] = ['1분', '5분', '10분', '30분', '1시간', '4시간'];
const initialDelimitedDate: ChartSortDate[] = ['1일', '1주', '1개월'];

const initialCandlePerMinute: Market[] = [];
const initialCandlePerDate: Market[] = [];

const delimitedTimeSlice = createSlice({
    name: 'delimitedTime',
    initialState: initialDelimitedTime,
    reducers: {
        setDelimitedTime: (state, action) => {
            return action.payload;
        }
    }
});

const delimitedDateSlice = createSlice({
    name: 'delimitedDate',
    initialState: initialDelimitedDate,
    reducers: {
        setDelimitedDate: (state, action) => {
            return action.payload;
        }
    }
});

const chartSortTimeSlice = createSlice({
    name: 'chartSortTime',
    initialState: '' as ChartSortTime,
    reducers: {
        setChartSortTime: (state, action) => {
            return action.payload;
        }
    }
});

const chartSortDateSlice = createSlice({
    name: 'chartSortDate',
    initialState: '1일' as ChartSortDate,
    reducers: {
        setChartSortDate: (state, action) => {
            return action.payload;
        }
    }
});

const candlePerMinuteSlice = createSlice({
    name: 'candlePerMinute',
    initialState: initialCandlePerMinute,
    reducers: {
        setCandlePerMinute: (state, action) => {
            return action.payload;
        }
    }
});

const candlePerDateSlice = createSlice({
    name: 'candlePerDate',
    initialState: initialCandlePerDate,
    reducers: {
        setCandlePerDate: (state, action) => {
            return action.payload;
        }
    }
});

export const { setDelimitedTime } = delimitedTimeSlice.actions;
export const { setDelimitedDate } = delimitedDateSlice.actions;
export const { setChartSortTime } = chartSortTimeSlice.actions;
export const { setChartSortDate } = chartSortDateSlice.actions;
export const { setCandlePerMinute } = candlePerMinuteSlice.actions;
export const { setCandlePerDate } = candlePerDateSlice.actions;

const reducers = {
    delimitedTime: delimitedTimeSlice.reducer,
    delimitedDate: delimitedDateSlice.reducer,
    chartSortTime: chartSortTimeSlice.reducer,
    chartSortDate: chartSortDateSlice.reducer,
    candlePerMinute: candlePerMinuteSlice.reducer,
    candlePerDate: candlePerDateSlice.reducer,
};

export default reducers;