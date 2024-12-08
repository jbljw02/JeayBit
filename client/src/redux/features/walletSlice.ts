import { createSlice } from "@reduxjs/toolkit";

export type TransferSort = '입금' | '출금' | '잔고';

const walletHoverSlice = createSlice({
    name: 'walletHover',
    initialState: false,
    reducers: {
        setWalletHover: (state, action) => {
            return action.payload;
        }
    }
})

const balanceUpdateSlice = createSlice({
    name: 'balanceUpdate',
    initialState: false,
    reducers: {
        setBalanceUpdate: (state, action) => {
            return action.payload;
        }
    }
})

const transferSortSlice = createSlice({
    name: 'transferSort',
    initialState: '입금' as TransferSort,
    reducers: {
        setTransferSort: (state, action) => {
            return action.payload;
        }
    }
})

const successTransferSlice = createSlice({
    name: 'successTransfer',
    initialState: false,
    reducers: {
        setSuccessTransfer: (state, action) => {
            return action.payload;
        }
    }
})

const failTransferSlice = createSlice({
    name: 'failTransfer',
    initialState: false,
    reducers: {
        setFailTransfer: (state, action) => {
            return action.payload;
        }
    }
})

const transferCategorySlice = createSlice({
    name: 'transferCategory',
    initialState: '',
    reducers: {
        setTransferCategory: (state, action) => {
            return action.payload;
        }
    }
})

export const { setWalletHover } = walletHoverSlice.actions;
export const { setBalanceUpdate } = balanceUpdateSlice.actions;
export const { setTransferSort } = transferSortSlice.actions;
export const { setSuccessTransfer } = successTransferSlice.actions;
export const { setFailTransfer } = failTransferSlice.actions;
export const { setTransferCategory } = transferCategorySlice.actions;


const reducers = {
    walletHover: walletHoverSlice.reducer,
    balanceUpdate: balanceUpdateSlice.reducer,
    transferSort: transferSortSlice.reducer,
    successTransfer: successTransferSlice.reducer,
    failTransfer: failTransferSlice.reducer,
    transferCategory: transferCategorySlice.reducer,
}

export default reducers;