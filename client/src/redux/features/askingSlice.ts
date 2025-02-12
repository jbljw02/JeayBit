import { createSlice } from "@reduxjs/toolkit";

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

const initialClosedData: ClosedData[] = [];
const initialAskingData: AskingData[] = [];

const closedDataSlice = createSlice({
    name: 'closedData',
    initialState: initialClosedData,
    reducers: {
        setClosedData: (state, action) => {
            return action.payload;
        }
    }
})

const askingDataSlice = createSlice({
    name: 'askingData',
    initialState: initialAskingData,
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