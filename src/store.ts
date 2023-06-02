import { configureStore, createSlice } from '@reduxjs/toolkit'

export type RootState = {
  cr_names: string[],
  cr_price: string[],
  cr_markets: string[],
  cr_change: string[],
  cr_change_rate: string[],
  cr_change_price: string[]
  star: string[],
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

const cr_change = createSlice({
  name: 'cr_change',
  initialState: [],
  reducers: {
    setCr_change: (state, action) => {
      return action.payload;
    }
  }
})

const cr_change_rate = createSlice({
  name: 'cr_change_rate',
  initialState: [],
  reducers: {
    setCr_change_rate: (state, action) => {
      return action.payload;
    }
  }
})
const cr_change_price = createSlice({
  name: 'cr_change_price',
  initialState: [],
  reducers: {
    setCr_change_price: (state, action) => {
      return action.payload;
    }
  }
})

const star = createSlice({
  name: 'star',
  initialState: [] as string[],
  reducers: {
    setStar: (state, action) => {
      const index = action.payload;
      state[index] = state[index] === 'starOn' ? 'starOff' : 'starOn';
    }
  }
});


export default configureStore({
  reducer: {
    cr_names: cr_names.reducer,
    cr_price: cr_price.reducer,
    cr_markets: cr_markets.reducer,
    cr_cr_change: cr_change.reducer,
    cr_change_rate: cr_change_rate.reducer,
    cr_change_price: cr_change_price.reducer,
    star: star.reducer
  }
})

export const { setCr_names } = cr_names.actions;
export const { setCr_price } = cr_price.actions;
export const { setCr_markets } = cr_markets.actions;
export const { setCr_change } = cr_change.actions;
export const { setCr_change_rate } = cr_change_rate.actions;
export const { setCr_change_price } = cr_change_price.actions;
export const { setStar } = star.actions;