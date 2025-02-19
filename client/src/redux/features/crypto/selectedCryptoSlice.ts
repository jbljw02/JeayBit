import { createSlice } from "@reduxjs/toolkit";
import { Crypto } from "../../../types/crypto.type";

const initialSelectedCrypto: Crypto = {
    name: '',
    price: 0,
    market: '',
    change: '',
    changeRate: 0,
    changePrice: 0,
    tradePrice: 0,
    tradeVolume: 0,
    openPrice: 0,
    highPrice: 0,
    lowPrice: 0,
    isFavorited: false,
    isOwned: false,
    ownedQuantity: 0,
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