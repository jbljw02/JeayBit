import { createSlice } from "@reduxjs/toolkit";

export type User = {
    name: string,
    email: string
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        email: ''
    },
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