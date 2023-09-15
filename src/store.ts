import { configureStore, createSlice } from '@reduxjs/toolkit'

export type Crypto = {
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
  tradeVolume: number,
  openPrice: number,
  highPrice: number,
  lowPrice: number,
  star: string,
}

export type ClosedData = {
  trade_date_utc: string,
  trade_time_utc: string,
  trade_price: number,
  trade_volume: number
}

export type AskingData = {
  ask_price: number,
  ask_size: number,
  bid_price: number,
  bid_size: number,
}

export type Market = {
  market: string,
  candle_date_time_utc: string,
  candle_date_time_kst: string,
  opening_price: number,
  high_price: number,
  low_price: number,
  trade_price: number,
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
  cr_open_price: number[],
  cr_high_price: number[],
  cr_low_price: number[],
  star: string[],
  filteredData: Crypto[],
  cr_names_selected: string,
  cr_markets_selected: string,
  cr_price_selected: string,
  cr_change_selected: string,
  cr_change_rate_selected: string,
  cr_change_price_selected: string,
  cr_trade_price_selected: number,
  cr_trade_volume_selected: number,
  cr_open_price_selected: number,
  cr_high_price_selected: number,
  cr_low_price_selected: number,
  sortedData: Crypto[],
  delimitedTime: string[],
  delimitedDate: string[],
  candle_per_minute: Market[],
  candle_per_date: Market[],
  candle_per_date_BTC: Market[],
  candle_per_week: Market[],
  candle_per_month: Market[],
  selectedChartSort: string,
  closed_data: ClosedData[],
  asking_data: AskingData[],
  chartSortTime: string,
  chartSortDate: string,
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

const cr_open_price = createSlice({
  name: 'cr_open_pirce',
  initialState: [],
  reducers: {
    setCr_open_price: (state, action) => {
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
  initialState: [] as Crypto[],
  reducers: {
    setFilteredData: (state, action) => {
      return action.payload;
    }
  }
})

// 테이블에서 선택된 화폐의 정보들에 대한 state
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

const cr_trade_price_selected = createSlice({
  name: 'cr_trade_price_selected',
  initialState: '',
  reducers: {
    setCr_trade_price_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_trade_volume_selected = createSlice({
  name: 'cr_trade_volume_selected',
  initialState: '',
  reducers: {
    setCr_trade_volume_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_open_price_selected = createSlice({
  name: 'cr_trade_price_selected',
  initialState: '',
  reducers: {
    setCr_open_price_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_high_price_selected = createSlice({
  name: 'cr_high_price_selected',
  initialState: '',
  reducers: {
    setCr_high_price_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_low_price_selected = createSlice({
  name: 'cr_low_price_selected',
  initialState: '',
  reducers: {
    setCr_low_price_selected: (state, action) => {
      return action.payload;
    }
  }
})

const sortedData = createSlice({
  name: 'sortedData',
  initialState: [] as Crypto[],
  reducers: {
    setSortedData: (state, action) => {
      return action.payload;
    }
  }
})

const delimitedTime = createSlice({
  name: 'delimitedTime',
  initialState: ['1분', '5분', '10분', '30분', '1시간', '4시간'],
  reducers: {
    setDelimitedTime: (state, action) => {
      return action.payload;
    }
  }
})

const delimitedDate = createSlice({
  name: 'delimitedDate',
  initialState: ['1일', '1주', '1개월'],
  reducers: {
    setDelimitedDate: (state, action) => {
      return action.payload;
    }
  }
})

const candle_per_minute = createSlice({
  name: 'candle_per_minute',
  initialState: [],
  reducers: {
    setCandle_per_minute: (state, action) => {
      return action.payload;
    }
  }
})

const candle_per_date = createSlice({
  name: 'candle_per_date',
  initialState: [] as Market[],
  reducers: {
    setCandle_per_date: (state, action) => {
      return action.payload;
    }
  }
})

const candle_per_date_BTC = createSlice({
  name: 'candle_per_date_BTC',
  initialState: [] as Market[],
  reducers: {
    setCandle_per_date_BTC: (state, action) => {
      return action.payload;
    }
  }
})

const candle_per_week = createSlice({
  name: 'candle_per_week',
  initialState: [],
  reducers: {
    setCandle_per_week: (state, action) => {
      return action.payload;
    }
  }
})

const candle_per_month = createSlice({
  name: 'candle_per_month',
  initialState: [],
  reducers: {
    setCandle_per_month: (state, action) => {
      return action.payload;
    }
  }
})

const selectedChartSort = createSlice({
  name: 'selectedChartSort',
  initialState: '1일',
  reducers: {
    setSelectedChartSort: (state, action) => {
      return action.payload;
    }
  }
})

const chartSortTime = createSlice({
  name: 'chartSortTime',
  initialState: '',
  reducers: {
    setChartSortTime: (state, action) => {
      return action.payload;
    }
  }
})

const chartSortDate = createSlice({
  name: 'chartSortDate',
  initialState: '1일',
  reducers: {
    setChartSortDate: (state, action) => {
      return action.payload;
    }
  }
})

const closed_data = createSlice({
  name: 'closed_data',
  initialState: [] as ClosedData[],
  reducers: {
    setClosed_data: (state, action) => {
      return action.payload;
    }
  }
})

const asking_data = createSlice({
  name: 'asking_data',
  initialState: [],
  reducers: {
    setAsking_data: (state, action) => {
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
    cr_open_price: cr_open_price.reducer,
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
    cr_trade_price_selected: cr_trade_price_selected.reducer,
    cr_trade_volume_selected: cr_trade_volume_selected.reducer,
    cr_open_price_selected: cr_open_price_selected.reducer,
    cr_high_price_selected: cr_high_price_selected.reducer,
    cr_low_price_selected: cr_low_price_selected.reducer,
    sortedData: sortedData.reducer,
    delimitedTime: delimitedTime.reducer,
    delimitedDate: delimitedDate.reducer,
    candle_per_minute: candle_per_minute.reducer,
    candle_per_date: candle_per_date.reducer,
    candle_per_date_BTC: candle_per_date_BTC.reducer,
    candle_per_week: candle_per_week.reducer,
    candle_per_month: candle_per_month.reducer,
    selectedChartSort: selectedChartSort.reducer,
    chartSortTime: chartSortTime.reducer,
    closed_data: closed_data.reducer,
    asking_data: asking_data.reducer,
    chartSortDate: chartSortDate.reducer,    
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
export const { setCr_open_price } = cr_open_price.actions;
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
export const { setCr_trade_price_selected } = cr_trade_price_selected.actions;
export const { setCr_trade_volume_selected } = cr_trade_volume_selected.actions;
export const { setCr_open_price_selected } = cr_open_price_selected.actions;
export const { setCr_high_price_selected } = cr_high_price_selected.actions;
export const { setCr_low_price_selected } = cr_low_price_selected.actions;
export const { setSortedData } = sortedData.actions;
export const { setDelimitedTime } = delimitedTime.actions;
export const { setDelimitedDate } = delimitedDate.actions;
export const { setCandle_per_minute } = candle_per_minute.actions;
export const { setCandle_per_date } = candle_per_date.actions;
export const { setCandle_per_date_BTC } = candle_per_date_BTC.actions;
export const { setCandle_per_week } = candle_per_week.actions;
export const { setCandle_per_month } = candle_per_month.actions;
export const { setSelectedChartSort } = selectedChartSort.actions;
export const { setClosed_data } = closed_data.actions;
export const { setAsking_data } = asking_data.actions;
export const { setChartSortTime } = chartSortTime.actions;
export const { setChartSortDate } = chartSortDate.actions;

// export default store;