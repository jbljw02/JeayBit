import { configureStore, createSlice } from '@reduxjs/toolkit'
import starOn from './img/star-on.png';
import starOff from './img/star-off.png';

export type RootState = {
  cr_names : string[],
  cr_price: string[], 
  cr_markets: string[],
  star : string,
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

const star = createSlice({
  name: 'star',
  initialState: starOff,
  reducers: {
    setStar: (state) => {
      return state === starOff ? starOn : starOff;  
    }
  }
})


export default configureStore({
  reducer: {
    cr_names: cr_names.reducer,
    cr_price: cr_price.reducer,
    cr_markets: cr_markets.reducer,
    star: star.reducer,
  }
})

export const { setCr_names } = cr_names.actions;
export const { setCr_price } = cr_price.actions;
export const { setCr_markets } = cr_markets.actions;
export const { setStar } = star.actions;