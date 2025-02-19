import { createSlice } from "@reduxjs/toolkit";
import { Crypto } from "../../../types/crypto.type";

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
        adjustOwnedCrypto: (state, action) => {
            const targetCrypto = state.find(crypto => crypto.name === action.payload.name);

            // 보유중인 화폐일 경우 보유량 업데이트
            if (targetCrypto) {
                if (action.payload.is_owned === false) {
                    return state.filter(crypto => crypto.name !== action.payload.name);
                }
                targetCrypto.isOwned = action.payload.isOwned;
                targetCrypto.ownedQuantity = action.payload.ownedQuantity;
            }
            // 보유중이지 않은 화폐일 경우 추가 
            else {
                state.push(action.payload);
            }
        }
    }
})

export const { setFavoriteCrypto } = favoriteCryptoSlice.actions;
export const { setOwnedCrypto, adjustOwnedCrypto } = ownedCryptoSlice.actions;

const reducers = {
    favoriteCrypto: favoriteCryptoSlice.reducer,
    ownedCrypto: ownedCryptoSlice.reducer,
}

export default reducers;