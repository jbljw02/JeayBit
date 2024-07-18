import { createSlice } from "@reduxjs/toolkit";

export type UserTradeHistory = {
    id: string,
    crypto_market: string,
    crypto_name: string,
    crypto_price: number,
    trade_amount: string,
    trade_category: string,
    trade_price: string,
    trade_time: any,
    user: string,
    is_signed: boolean,
}

export type ScheduleCancel = {
    id: string,
    index: number,
}[]

const buyingPriceSlice = createSlice({
    name: 'buyingPrice',
    initialState: 0,
    reducers: {
        setBuyingPrice: (state, action) => {
            return action.payload;
        }
    }
})

const sellingPriceSlice = createSlice({
    name: 'sellingPrice',
    initialState: 0,
    reducers: {
        setSellingPrice: (state, action) => {
            return action.payload;
        }
    }
})

const userTradeHistorySlice = createSlice({
    name: 'userTradeHisotry',
    initialState: [] as UserTradeHistory[],
    reducers: {
        setUserTradeHistory: (state, action) => {
            return action.payload
        }
    }
})

const userTradeHistory_unSignedSlice = createSlice({
    name: 'userTradeHistory_unSigned',
    initialState: [] as UserTradeHistory[],
    reducers: {
        setUserTradeHistory_unSigned: (state, action) => {
            return action.payload;
        }
    }
})

export const scheduledCancelSlice = createSlice({
    name: 'scheduledCancel',
    initialState: [],
    reducers: {
        setScheduledCancel: (state, action) => {
            return action.payload;
        }
    }
})

export const { setBuyingPrice } = buyingPriceSlice.actions;
export const { setSellingPrice } = sellingPriceSlice.actions;
export const { setUserTradeHistory } = userTradeHistorySlice.actions;
export const { setUserTradeHistory_unSigned } = userTradeHistory_unSignedSlice.actions;
export const { setScheduledCancel } = scheduledCancelSlice.actions;

const reducers = {
    buyingPrice: buyingPriceSlice.reducer,
    sellingPrice: sellingPriceSlice.reducer,
    userTradeHistory: userTradeHistorySlice.reducer,
    userTradeHistory_unSigned: userTradeHistory_unSignedSlice.reducer,
    scheduledCancel: scheduledCancelSlice.reducer,

}

export default reducers;