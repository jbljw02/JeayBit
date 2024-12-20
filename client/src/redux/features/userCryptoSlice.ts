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
        },
        addOwnedCrypto: (state, action) => {
            const targetCrypto = state.find(crypto => crypto.name === action.payload.name);
            if (targetCrypto) {
                targetCrypto.is_owned = action.payload.is_owned;
                targetCrypto.owned_quantity = action.payload.owned_quantity;
            }
            else {
                state.push(action.payload);
            }
        }
    }
})

export const { setFavoriteCrypto } = favoriteCryptoSlice.actions;
export const { setOwnedCrypto, addOwnedCrypto } = ownedCryptoSlice.actions;

const reducers = {
    favoriteCrypto: favoriteCryptoSlice.reducer,
    ownedCrypto: ownedCryptoSlice.reducer,
}

export default reducers;