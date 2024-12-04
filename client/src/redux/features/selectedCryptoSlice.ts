import { createSlice } from "@reduxjs/toolkit";
import { Crypto } from "./cryptoListSlice";

export type SelectedCrypto = {
    name: string,
    market: string,
}

const initialSelectedCrypto: Crypto = {
    name: '',
    price: 0,
    market: '',
    change: '',
    change_rate: 0,
    change_price: 0,
    trade_price: 0,
    trade_volume: 0,
    open_price: 0,
    high_price: 0,
    low_price: 0,
    is_favorited: false,
    is_owned: false,
    owned_quantity: 0,
}

const selectedCryptoSlice = createSlice({
    name: 'selectedCrypto',
    initialState: initialSelectedCrypto,
    reducers: {
        setSelectedCrypto: (state, action) => {
            return action.payload;
        }
    }
})

export const cryptoRealTimeSlice = createSlice({
    name: 'cryptoRealTime',
    initialState: initialSelectedCrypto,
    reducers: {
        setCryptoRealTime: (state, action) => {
            return action.payload;
        }
    }
})

export const { setSelectedCrypto } = selectedCryptoSlice.actions;
export const { setCryptoRealTime } = cryptoRealTimeSlice.actions;

const reducers = {
    selectedCrypto: selectedCryptoSlice.reducer,
    cryptoRealTime: cryptoRealTimeSlice.reducer,
}

export default reducers;