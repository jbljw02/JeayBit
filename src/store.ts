import { configureStore, createSlice } from '@reduxjs/toolkit'

export type crypto = {
  name: string,
  price: number,
  f_price: string,
  markets: string,
  change: string,
  changeRate: number,
  f_changeRate: string,
  changePrice: number,
  f_changePrice: string,
  tradePrice: number,
  f_tradePrice: string,
  star: string;
}

export type RootState = {
  cr_names: string[],
  cr_price: number[],
  cr_markets: string[],
  cr_change: string[],
  cr_change_rate: number[],
  cr_change_price: number[],
  cr_trade_price: number[],
  cr_trade_volume: number[],
  cr_opening_price: number[],
  cr_high_price: number[],
  cr_low_price: number[],
  star: string[],
  filteredData: crypto[],
  cr_names_selected: string,
  cr_markets_selected: string,
  cr_price_selected: string,
  cr_change_selected: string,
  cr_change_rate_selected: string,
  cr_change_price_selected: string,
  sortedData: crypto[]
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

const cr_trade_price = createSlice({
  name: 'cr_trade_price',
  initialState: [],
  reducers: {
    setCr_trade_price: (state, action) => {
      return action.payload;
    }
  }
})

const cr_trade_volume = createSlice({
  name: 'cr_trade_volume',
  initialState: [],
  reducers: {
    setCr_trade_volume: (state, action) => {
      return action.payload;
    }
  }
})

const cr_opening_price = createSlice({
  name: 'cr_opening_pirce',
  initialState: [],
  reducers: {
    setCr_opening_price: (state, action) => {
      return action.payload;
    }
  }
})

const cr_high_price = createSlice({
  name: 'cr_high_price',
  initialState: [],
  reducers: {
    setCr_high_price: (state, action) => {
      return action.payload;
    }
  }
})

const cr_low_price = createSlice({
  name: 'cr_low_price',
  initialState: [],
  reducers: {
    setCr_low_price: (state, action) => {
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
      
      // 별의 on일 때 클릭하면 off로, off일 때 클릭하면 on으로 변경
      state[index] = state[index] === 'starOn' ? 'starOff' : 'starOn';
    }
  }
});

const filteredData = createSlice({
  name: 'filteredData',
  initialState: [] as crypto[],
  reducers: {
    setFilteredData: (state, action) => {
      return action.payload;
    }
  }
})

const cr_names_selected = createSlice({
  name: 'cr_selected',
  initialState: '',
  reducers: {
    setCr_names_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_markets_selected = createSlice({
  name: 'cr_markets_selected',
  initialState: '',
  reducers: {
    setCr_markets_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_price_selected = createSlice({
  name: 'cr_price_selected',
  initialState: '',
  reducers: {
    setCr_price_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_change_selected = createSlice({
  name: 'cr_change_selected',
  initialState: '',
  reducers: {
    setCr_change_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_change_rate_selected = createSlice({
  name: 'cr_change_rate_selected',
  initialState: '',
  reducers: {
    setCr_change_rate_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_change_price_selected = createSlice({
  name: 'cr_change_price_selected',
  initialState: '',
  reducers: {
    setCr_change_price_selected: (state, action) => {
      return action.payload;
    }
  }
})

const sortedData = createSlice({
  name: 'sortedData',
  initialState: [] as crypto[],
  reducers: {
    setSortedData: (state, action) => {
      return action.payload;
    }
  }
})

export default configureStore({
  reducer: {
    cr_names: cr_names.reducer,
    cr_price: cr_price.reducer,
    cr_markets: cr_markets.reducer,
    cr_change: cr_change.reducer,
    cr_change_rate: cr_change_rate.reducer,
    cr_change_price: cr_change_price.reducer,
    cr_trade_price: cr_trade_price.reducer,
    cr_trade_volume: cr_trade_volume.reducer,
    cr_opening_price: cr_opening_price.reducer,
    cr_high_price: cr_high_price.reducer,
    cr_low_price: cr_low_price.reducer,
    star: star.reducer,
    filteredData: filteredData.reducer,
    cr_names_selected: cr_names_selected.reducer,
    cr_markets_selected: cr_markets_selected.reducer,
    cr_price_selected: cr_price_selected.reducer,
    cr_change_selected: cr_change_selected.reducer,
    cr_change_rate_selected: cr_change_rate_selected.reducer,
    cr_change_price_selected: cr_change_price_selected.reducer,
    sortedData: sortedData.reducer
  }
})

// const rootReducer = {
//   cr_names: cr_names.reducer,
//   cr_price: cr_price.reducer,
//   cr_markets: cr_markets.reducer,
//   cr_change: cr_change.reducer,
//   cr_change_rate: cr_change_rate.reducer,
//   cr_change_price: cr_change_price.reducer,
//   cr_trade_price: cr_trade_price.reducer,
//   star: star.reducer,
//   filteredData: filteredData.reducer,
// };

// const store = configureStore({
//   reducer: rootReducer,
// });

export const { setCr_names } = cr_names.actions;
export const { setCr_price } = cr_price.actions;
export const { setCr_markets } = cr_markets.actions;
export const { setCr_change } = cr_change.actions;
export const { setCr_change_rate } = cr_change_rate.actions;
export const { setCr_change_price } = cr_change_price.actions;
export const { setCr_trade_price } = cr_trade_price.actions;
export const { setCr_trade_volume } = cr_trade_volume.actions;
export const { setCr_opening_price } = cr_opening_price.actions;
export const { setCr_high_price } = cr_high_price.actions;
export const { setCr_low_price } = cr_low_price.actions;
export const { setStar } = star.actions;
export const { setFilteredData } = filteredData.actions;
export const { setCr_names_selected } = cr_names_selected.actions;
export const { setCr_markets_selected } = cr_markets_selected.actions;
export const { setCr_price_selected } = cr_price_selected.actions;
export const { setCr_change_selected } = cr_change_selected.actions;
export const { setCr_change_rate_selected } = cr_change_rate_selected.actions;
export const { setCr_change_price_selected } = cr_change_price_selected.actions;
export const { setSortedData } = sortedData.actions;

// export default store;