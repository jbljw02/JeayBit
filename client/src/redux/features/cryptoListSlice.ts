import { createSlice } from "@reduxjs/toolkit";

export type ListCategory = '원화' | '보유' | '관심'

export const listCategorySlice = createSlice({
    name: 'listCategory',
    initialState: '원화',
    reducers: {
        setListCategory: (state, action) => {
            return action.payload;
        }
    }
});

export const { setListCategory } = listCategorySlice.actions;

const reducers = {
    listCategory: listCategorySlice.reducer,
};

export default reducers;