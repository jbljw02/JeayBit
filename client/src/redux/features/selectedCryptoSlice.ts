import { createSlice } from "@reduxjs/toolkit";

const selectedCryptoSlice = createSlice({
    name: 'selectedCrypto',
    initialState: {
        name: '비트코인',
        market: 'KRW-BTC',
    },
    reducers: {
        setSelectedCrypto: (state, action) => {
            return action.payload;
        }
    }
})

export const cryptoRealTimeSlice = createSlice({
    name: 'cryptoRealTime',
    initialState: {
        name: '비트코인',
        market: 'KRW-BTC',
    },
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