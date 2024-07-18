import { createSlice } from "@reduxjs/toolkit";

const errorModalSlice = createSlice({
    name: 'errorModal',
    initialState: false,
    reducers: {
        setErrorModal: (state, action) => {
            return action.payload;
        }
    }
})

export const { setErrorModal } = errorModalSlice.actions;

const reducers = {
    errorModal: errorModalSlice.reducer,
}

export default reducers;