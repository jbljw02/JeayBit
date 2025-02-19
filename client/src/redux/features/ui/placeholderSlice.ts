import { createSlice } from "@reduxjs/toolkit";

const askingSpinner = createSlice({
    name: 'askingSpinner',
    initialState: false,
    reducers: {
        setAskingSpinner: (state, action) => {
            return action.payload;
        }
    }
})

const chartSpinnerSlice = createSlice({
    name: 'chartSpinner',
    initialState: false,
    reducers: {
        setChartSpinner: (state, action) => {
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

export const { setAskingSpinner } = askingSpinner.actions;
export const { setChartSpinner } = chartSpinnerSlice.actions;
export const { setWorkingSpinner } = workingSpinnerSlice.actions;

const reducers = {
    askingSpinner: askingSpinner.reducer,
    chartSpinner: chartSpinnerSlice.reducer,
    workingSpinner: workingSpinnerSlice.reducer,
}

export default reducers;