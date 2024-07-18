import { createSlice } from "@reduxjs/toolkit";

export type Market = {
    market: string;
    candle_date_time_utc: string;
    candle_date_time_kst: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    timestamp: number;
};

export type ChartSortDate = '1일' | '1주' | '1개월';
export type ChartSortTime = '1분' | '5분' | '10분' | '30분' | '1시간' | '4시간';

const delimitedTimeSlice = createSlice({
    name: 'delimitedTime',
    initialState: ['1분', '5분', '10분', '30분', '1시간', '4시간'] as ChartSortTime[],
    reducers: {
        setDelimitedTime: (state, action) => {
            return action.payload;
        }
    }
});

const delimitedDateSlice = createSlice({
    name: 'delimitedDate',
    initialState: ['1일', '1주', '1개월'] as ChartSortDate[],
    reducers: {
        setDelimitedDate: (state, action) => {
            return action.payload;
        }
    }
});

const chartSortTimeSlice = createSlice({
    name: 'chartSortTime',
    initialState: '' as ChartSortTime | '',
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
    initialState: [] as Market[],
    reducers: {
        setCandlePerMinute: (state, action) => {
            return action.payload;
        }
    }
});

const candlePerDateSlice = createSlice({
    name: 'candlePerDate',
    initialState: [] as Market[],
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