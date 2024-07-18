import { createSlice } from "@reduxjs/toolkit";

const userWalletSlice = createSlice({
    name: 'userWallet',
    initialState: 0,
    reducers: {
        setUserWallet: (state, action) => {
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
    initialState: '입금',
    reducers: {
        setTransferSort: (state, action) => {
            return action.payload;
        }
    }
})

export const { setUserWallet } = userWalletSlice.actions;
export const { setBalanceUpdate } = balanceUpdateSlice.actions;
export const { setTransferSort } = transferSortSlice.actions;

const reducers = {
    userWallet: userWalletSlice.reducer,
    balanceUpdate: balanceUpdateSlice.reducer,
    transferSort: transferSortSlice.reducer,
}

export default reducers;