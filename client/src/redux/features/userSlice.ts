import { createSlice } from "@reduxjs/toolkit";

export type User = {
    name: string,
    email: string
}

const initialState: User = {
    name: '',
    email: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        }
    }
})

export const { setUser } = userSlice.actions;

const reducers = {
    user: userSlice.reducer,
}

export default reducers;