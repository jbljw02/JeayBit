import { createSlice } from "@reduxjs/toolkit";

const favoriteCryptoSlice = createSlice({
    name: 'favoriteCrypto',
    initialState: '',
    reducers: {
        setFavoriteCrypto: (state, action) => {
            return action.payload;
        }
    }
})

const ownedCryptoSlice = createSlice({
    name: 'ownedCrypto',
    initialState: '',
    reducers: {
        setOwnedCrypto: (state, action) => {
            return action.payload;
        }
    }
})

export const { setFavoriteCrypto } = favoriteCryptoSlice.actions;
export const { setOwnedCrypto } = ownedCryptoSlice.actions;

const reducers = {
    favoriteCrypto: favoriteCryptoSlice.reducer,
    ownedCrypto: ownedCryptoSlice.reducer,
}

export default reducers;