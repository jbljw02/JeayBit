import { createSlice } from "@reduxjs/toolkit";

export type User = {
    name: string,
    email: string,
    balance: number
}

const initialState: User = {
    name: '',
    email: '',
    balance: 0
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            return { ...state, name: action.payload.name, email: action.payload.email };
        },
        setUserBalance: (state, action) => {
            return { ...state, balance: action.payload };
        },
        setUser: (state, action) => {
            return action.payload;
        }
    }
})

export const { setUserInfo, setUserBalance, setUser } = userSlice.actions;

const reducers = {
    user: userSlice.reducer,
}

export default reducers;