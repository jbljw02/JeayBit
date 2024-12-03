import { createSlice } from "@reduxjs/toolkit";
import formatDateString from "../../utils/date/formatDateString";

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
}

const initialUserTradeHistory: UserTradeHistory[] = [];
const initialUserTradeHistory_unSigned: UserTradeHistory[] = [];
const initialScheduledCancel: ScheduleCancel[] = [];

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
    initialState: initialUserTradeHistory,
    reducers: {
        setUserTradeHistory: (state, action) => {
            return action.payload
        },
        addUserTradeHistory: (state, action) => {
            const date = new Date(action.payload.trade_time);
            const formattedDate = formatDateString(date);

            return [...state, { ...action.payload, trade_time: formattedDate }];
        }
    }
})

const userTradeHistory_unSignedSlice = createSlice({
    name: 'userTradeHistory_unSigned',
    initialState: initialUserTradeHistory_unSigned,
    reducers: {
        setUserTradeHistory_unSigned: (state, action) => {
            return action.payload;
        },
        addUserTradeHistory_unSigned: (state, action) => {
            return [...state, action.payload];
        }
    }
})

export const scheduledCancelSlice = createSlice({
    name: 'scheduledCancel',
    initialState: initialScheduledCancel,
    reducers: {
        setScheduledCancel: (state, action) => {
            return action.payload;
        }
    }
})

export const { setBuyingPrice } = buyingPriceSlice.actions;
export const { setSellingPrice } = sellingPriceSlice.actions;
export const { setUserTradeHistory, addUserTradeHistory } = userTradeHistorySlice.actions;
export const { setUserTradeHistory_unSigned, addUserTradeHistory_unSigned } = userTradeHistory_unSignedSlice.actions;
export const { setScheduledCancel } = scheduledCancelSlice.actions;

const reducers = {
    buyingPrice: buyingPriceSlice.reducer,
    sellingPrice: sellingPriceSlice.reducer,
    userTradeHistory: userTradeHistorySlice.reducer,
    userTradeHistory_unSigned: userTradeHistory_unSignedSlice.reducer,
    scheduledCancel: scheduledCancelSlice.reducer,

}

export default reducers;