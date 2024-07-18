import { createSlice } from "@reduxjs/toolkit";

export type AskingData = {
    ask_price: number,
    ask_size: number,
    bid_price: number,
    bid_size: number,
    timestamp: number,
}

export type ClosedData = {
    trade_date_utc: string,
    trade_time_utc: string,
    trade_price: number,
    trade_volume: number,
    ask_bid: string,
    timestamp: number,
}

const closedDataSlice = createSlice({
    name: 'closedData',
    initialState: [] as ClosedData[],
    reducers: {
        setClosedData: (state, action) => {
            return action.payload;
        }
    }
})

const askingDataSlice = createSlice({
    name: 'askingData',
    initialState: [],
    reducers: {
        setAskingData: (state, action) => {
            return action.payload;
        }
    }
})

const totalAskSizeSlice = createSlice({
    name: 'totalAskSize',
    initialState: '',
    reducers: {
        setTotalAskSize: (state, action) => {
            return action.payload;
        }
    }
})

const totalBidSizeSlice = createSlice({
    name: 'totalBidSize',
    initialState: '',
    reducers: {
        setTotalBidSize: (state, action) => {
            return action.payload;
        }
    }
})

export const { setClosedData } = closedDataSlice.actions;
export const { setAskingData } = askingDataSlice.actions;
export const { setTotalAskSize } = totalAskSizeSlice.actions;
export const { setTotalBidSize } = totalBidSizeSlice.actions;

const reducers = {
    closedData: closedDataSlice.reducer,
    askingData: askingDataSlice.reducer,
    totalAskSize: totalAskSizeSlice.reducer,
    totalBidSize: totalBidSizeSlice.reducer,
}

export default reducers;