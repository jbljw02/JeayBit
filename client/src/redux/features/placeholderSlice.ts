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

const workingSpinnerSlice = createSlice({
    name: 'workingSpinner',
    initialState: false,
    reducers: {
        setWorkingSpinner: (state, action) => {
            return action.payload;
        }
    }
})

export const { setAskingSpinner } = askingSpinnerSlice.actions;
export const { setWorkingSpinner } = workingSpinnerSlice.actions;

const reducers = {
    askingSpinner: askingSpinnerSlice.reducer,
    workingSpinner: workingSpinnerSlice.reducer,
}

export default reducers;