import { createSlice } from "@reduxjs/toolkit";
import formatDateString from "../../../utils/format/formatDateString";
import { ScheduleCancel, UserTradeHistory } from "../../../types/trade.type";

const initialTradeHistory: UserTradeHistory[] = [];
const initialUnSignedTradeHistory: UserTradeHistory[] = [];
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

const tradeHistorySlice = createSlice({
    name: 'tradeHistory',
    initialState: initialTradeHistory,
    reducers: {
        setTradeHistory: (state, action) => {
            return action.payload
        },
        addTradeHistory: (state, action) => {
            const date = new Date(action.payload.tradeTime);
            const formattedDate = formatDateString(date);

            return [...state, { ...action.payload, trade_time: formattedDate }];
        },
    }
})

const unSignedTradeHistorySlice = createSlice({
    name: 'unSignedTradeHistory',
    initialState: initialUnSignedTradeHistory,
    reducers: {
        setUnSignedTradeHistory: (state, action) => {
            return action.payload;
        },
        addUnSignedTradeHistory: (state, action) => {
            const date = new Date(action.payload.trade_time);
            const formattedDate = formatDateString(date);

            return [...state, { ...action.payload, trade_time: formattedDate }];
        },
        cancelUnSignedOrder: (state, action) => {
            return state.filter(trade => !action.payload.includes(trade.id));
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
export const { setTradeHistory, addTradeHistory } = tradeHistorySlice.actions;
export const { setUnSignedTradeHistory, addUnSignedTradeHistory, cancelUnSignedOrder } = unSignedTradeHistorySlice.actions;
export const { setScheduledCancel } = scheduledCancelSlice.actions;

const reducers = {
    buyingPrice: buyingPriceSlice.reducer,
    sellingPrice: sellingPriceSlice.reducer,
    tradeHistory: tradeHistorySlice.reducer,
    unSignedTradeHistory: unSignedTradeHistorySlice.reducer,
    scheduledCancel: scheduledCancelSlice.reducer,

}

export default reducers;