import { createSlice } from "@reduxjs/toolkit";

const askingSpinnerSlice = createSlice({
    name: 'askingSpinner',
    initialState: false,
    reducers: {
        setAskingSpinner: (state, action) => {
            return action.payload;
        }
    }
})

export const { setAskingSpinner } = askingSpinnerSlice.actions;

const reducers = {
    askingSpinner: askingSpinnerSlice.reducer,
}

export default reducers;