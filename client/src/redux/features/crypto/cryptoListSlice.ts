import { createSlice } from "@reduxjs/toolkit";
import { Crypto, ListCategory } from "../../../types/crypto.type";

const initialCryptoList: Crypto[] = [];

export const allCryptoSlice = createSlice({
    name: 'allCrypto',
    initialState: initialCryptoList,
    reducers: {
        setAllCrypto: (state, action) => {
            return action.payload;
        }
    }
})

export const listCategorySlice = createSlice({
    name: 'listCategory',
    initialState: '원화' as ListCategory,
    reducers: {
        setListCategory: (state, action) => {
            return action.payload;
        }
    }
});

const filteredDataSlice = createSlice({
    name: 'filteredData',
    initialState: initialCryptoList,
    reducers: {
        setFilteredData: (state, action) => {
            return action.payload;
        }
    }
})

const sortedDataSlice = createSlice({
    name: 'sortedData',
    initialState: initialCryptoList,
    reducers: {
        setSortedData: (state, action) => {
            return action.payload;
        }
    }
})

export const searchedCryptoSlice = createSlice({
    name: 'searchedCrypto',
    initialState: initialCryptoList,
    reducers: {
        setSearchedCrypto: (state, action) => {
            return action.payload;
        }
    }
})

export const sortStatesSlice = createSlice({
    name: 'sortStates',
    initialState: [0, 0, 0, 0],
    reducers: {
        setSortStates: (state, action) => {
            return action.payload;
        }
    }
})

export const { setFilteredData } = filteredDataSlice.actions;
export const { setSortedData } = sortedDataSlice.actions;
export const { setAllCrypto } = allCryptoSlice.actions;
export const { setSearchedCrypto } = searchedCryptoSlice.actions;
export const { setSortStates } = sortStatesSlice.actions;
export const { setListCategory } = listCategorySlice.actions;

const reducers = {
    allCrypto: allCryptoSlice.reducer,
    listCategory: listCategorySlice.reducer,
    filteredData: filteredDataSlice.reducer,
    sortedData: sortedDataSlice.reducer,
    searchedCrypto: searchedCryptoSlice.reducer,
    sortStates: sortStatesSlice.reducer,
}

export default reducers;