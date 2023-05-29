import { configureStore, createSlice } from '@reduxjs/toolkit'

interface RootState {
  cr_names : string[],
  cr_prcie : string[],
  cr_markets : string[]
}

const cr_names = createSlice({
  name: 'cr_names',
  initialState: [],
  reducers: {
    setCr_names: (state, action) => {
      return action.payload;
    }
  }
})

const cr_price = createSlice({
  name: 'cr_price',
  initialState: [],
  reducers: {
    setCr_price: (state, action) => {
      return action.payload;
    }
  }
})

const cr_markets = createSlice({
  name: 'cr_markets',
  initialState: [],
  reducers: {
    setCr_markets: (state, action) => {
      return action.payload;
    }
  }
})

export default configureStore({
  reducer: {
    cr_names: cr_names.reducer,
    cr_price: cr_price.reducer,
    cr_markets: cr_markets.reducer
  }
})