import { createSlice } from "@reduxjs/toolkit";
import { Crypto } from "./cryptoListSlice";

export type FavoriteCrypto = {
    crypto_name: string,
    isFavorited: boolean
}

export type OwnedCrypto = {
    name: string,
    is_owned: boolean,
    owned_quantity: number,
}

const initialFavoriteCrypto: Crypto[] = [];
const initialOwnedCrypto: Crypto[] = [];

const favoriteCryptoSlice = createSlice({
    name: 'favoriteCrypto',
    initialState: initialFavoriteCrypto,
    reducers: {
        setFavoriteCrypto: (state, action) => {
            return action.payload;
        }
    }
})

const ownedCryptoSlice = createSlice({
    name: 'ownedCrypto',
    initialState: initialOwnedCrypto,
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