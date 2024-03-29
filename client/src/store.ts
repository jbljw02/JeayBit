import { configureStore, createSlice } from '@reduxjs/toolkit'

export type Crypto = {
  name: string,
  price: number,
  market: string,
  change: string,
  change_rate: number,
  change_price: number,
  trade_price: number,
  trade_volume: number,
  open_price: number,
  high_price: number,
  low_price: number,
  star: string,
  isFavorited: boolean,
}

export type ClosedData = {
  trade_date_utc: string,
  trade_time_utc: string,
  trade_price: number,
  trade_volume: number,
  ask_bid: string,
  timestamp: number,
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

export type FavoriteCrypto = {
  crypto_name: string,
  isFavorited: boolean
}

export type OwnedCrypto = {
  crypto_name: string,
  isOwned: boolean,
  quantity: number,
}

export type UserTradeHistory = {
  id: string,
  crypto_market: string,
  crypto_name: string,
  crypto_price: number,
  trade_amount: string,
  trade_category: string,
  trade_price: string,
  trade_time: any,
  user: string,
  is_signed: boolean,
}

export type UnsginedAskingData = {
  ask_price: number,
  bid_price: number,
}

export type RootState = {
  cr_name: string[],
  cr_price: number[],
  cr_market: string[],
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
  cr_selected: Crypto,
  cr_name_selected: string,
  cr_market_selected: string,
  cr_price_selected: number,
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
  asking_dateTime: string,
  asking_totalAskSize: number,
  asking_totalBidSize: number,
  chartSortTime: string,
  chartSortDate: string,
  theme: boolean,
  logInUser: string,
  logInEmail: string,
  favoriteCrypto: FavoriteCrypto[],
  ownedCrypto: OwnedCrypto[],
  isFavorited: boolean,
  userWallet: number,
  cr_clickedIndex: number,
  buyingPrice: number,
  balanceUpdate: boolean,
  buyingCrypto: string,
  sellingPrice: number,
  sectionChange: string,
  userTradeHistory: UserTradeHistory[],
  userTradeHistory_unSigned: UserTradeHistory[],
  isBuying: { [key: string]: boolean },
  isSelling: { [key: string]: boolean },
  askingData_unSigned: { [key: string]: UnsginedAskingData[] },
  transferSort: string,
  depositEmpty: boolean,
  withdrawEmpty: boolean,
  askHide: boolean,
  closeHide: boolean,
  isScrollMove: boolean,
}

const cr_name = createSlice({
  name: 'cr_name',
  initialState: [],
  reducers: {
    setCr_name: (state, action) => {
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

const cr_market = createSlice({
  name: 'cr_market',
  initialState: [],
  reducers: {
    setCr_market: (state, action) => {
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
  name: 'cr_open_price',
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
const cr_selected = createSlice({
  name: 'cr_selected',
  initialState: {},
  reducers: {
    setCr_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_name_selected = createSlice({
  name: 'cr_selected',
  initialState: '',
  reducers: {
    setCr_name_selected: (state, action) => {
      return action.payload;
    }
  }
})

const cr_market_selected = createSlice({
  name: 'cr_market_selected',
  initialState: '',
  reducers: {
    setCr_market_selected: (state, action) => {
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

const asking_dateTime = createSlice({
  name: 'asking_dateTime',
  initialState: '',
  reducers: {
    setAsking_dateTime: (state, action) => {
      return action.payload;
    }
  }
})

const asking_totalAskSize = createSlice({
  name: 'asking_totalAskSize',
  initialState: '',
  reducers: {
    setAsking_totalAskSize: (state, action) => {
      return action.payload;
    }
  }
})

const asking_totalBidSize = createSlice({
  name: 'asking_totalBidSize',
  initialState: '',
  reducers: {
    setAsking_totalBidSize: (state, action) => {
      return action.payload;
    }
  }
})

const theme = createSlice({
  name: 'theme',
  initialState: false,
  reducers: {
    setTheme: (state, action) => {
      return action.payload;
    }
  }
})

const logInUser = createSlice({
  name: 'logInUser',
  initialState: '',
  reducers: {
    setLogInUser: (state, action) => {
      return action.payload;
    }
  }
})

const logInEmail = createSlice({
  name: 'logInEmail',
  initialState: '',
  reducers: {
    setLogInEmail: (state, action) => {
      return action.payload;
    }
  }
})

const favoriteCrypto = createSlice({
  name: 'favoriteCrypto',
  initialState: '',
  reducers: {
    setFavoriteCrypto: (state, action) => {
      return action.payload;
    }
  }
})

const isFavorited = createSlice({
  name: 'isFavorited',
  initialState: false,
  reducers: {
    setIsFavorited: (state, action) => {
      return action.payload;
    }
  }
})

const ownedCrypto = createSlice({
  name: 'ownedCrypto',
  initialState: '',
  reducers: {
    setOwnedCrypto: (state, action) => {
      return action.payload;
    }
  }
})

const isOwned = createSlice({
  name: 'isOwned',
  initialState: false,
  reducers: {
    setIsOwned: (state, action) => {
      return action.payload;
    }
  }
})

const userWallet = createSlice({
  name: 'userWallet',
  initialState: 0,
  reducers: {
    setUserWallet: (state, action) => {
      return action.payload;
    }
  }
})

const cr_clickedIndex = createSlice({
  name: 'cr_clickedIndex',
  initialState: 0,
  reducers: {
    setCr_clickedIndex: (state, action) => {
      return action.payload;
    }
  }
})

const buyingPrice = createSlice({
  name: 'buyingPrice',
  initialState: 0,
  reducers: {
    setBuyingPrice: (state, action) => {
      return action.payload;
    }
  }
})

const balanceUpdate = createSlice({
  name: 'balanceUpdate',
  initialState: false,
  reducers: {
    setBalanceUpdate: (state, action) => {
      return action.payload;
    }
  }
})

const buyingCrypto = createSlice({
  name: 'buyingCrypto',
  initialState: '',
  reducers: {
    setBuyingCrypto: (state, action) => {
      return action.payload;
    }
  }
})

const sellingPrice = createSlice({
  name: 'sellingPrice',
  initialState: 0,
  reducers: {
    setSellingPrice: (state, action) => {
      return action.payload;
    }
  }
})

const sectionChange = createSlice({
  name: 'sectionChange',
  initialState: '매수',
  reducers: {
    setSectionChange: (state, action) => {
      return action.payload;
    }
  }
})

const userTradeHistory = createSlice({
  name: 'userTradeHisotry',
  initialState: [] as UserTradeHistory[],
  reducers: {
    setUserTradeHistory: (state, action) => {
      return action.payload
    }
  }
})

const userTradeHistory_unSigned = createSlice({
  name: 'userTradeHistory_unSigned',
  initialState: [] as UserTradeHistory[],
  reducers: {
    setUserTradeHistory_unSigned: (state, action) => {
      return action.payload;
    }
  }
})

const isBuying = createSlice({
  name: 'isBuying',
  initialState: '',
  reducers: {
    setIsBuying: (state, action) => {
      return action.payload;
    }
  }
})

const isSelling = createSlice({
  name: 'isSelling',
  initialState: '',
  reducers: {
    setIsSelling: (state, action) => {
      return action.payload;
    }
  }
})

const askingData_unSigned = createSlice({
  name: 'askingData_unSigned',
  initialState: {} as { [key: string]: UnsginedAskingData[] },
  reducers: {
    setAskingData_unSigned: (state, action) => {
      state[action.payload.market] = action.payload.data;
    },
  },
});

const transferSort = createSlice({
  name: 'transferSort',
  initialState: '입금',
  reducers: {
    setTransferSort: (state, action) => {
      return action.payload;
    }
  }
})

const askHide = createSlice({
  name: 'askHide',
  initialState: false,
  reducers: {
    setAskHide: (state, action) => {
      return action.payload;
    }
  }
})

const closeHide = createSlice({
  name: 'closeHide',
  initialState: false,
  reducers: {
    setCloseHide: (state, action) => {
      return action.payload;
    }
  }
})

const isScrollMove = createSlice({
  name: 'isScrollMove',
  initialState: false,
  reducers: {
    setIsScrollMove: (state, action) => {
      return action.payload;
    }
  }
})

export default configureStore({
  reducer: {
    cr_name: cr_name.reducer,
    cr_price: cr_price.reducer,
    cr_market: cr_market.reducer,
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
    cr_selected: cr_selected.reducer,
    cr_name_selected: cr_name_selected.reducer,
    cr_market_selected: cr_market_selected.reducer,
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
    asking_dateTime: asking_dateTime.reducer,
    chartSortDate: chartSortDate.reducer,
    asking_totalAskSize: asking_totalAskSize.reducer,
    asking_totalBidSize: asking_totalBidSize.reducer,
    theme: theme.reducer,
    logInUser: logInUser.reducer,
    logInEmail: logInEmail.reducer,
    favoriteCrypto: favoriteCrypto.reducer,
    isFavorited: isFavorited.reducer,
    ownedCrypto: ownedCrypto.reducer,
    isOwned: isOwned.reducer,
    userWallet: userWallet.reducer,
    cr_clickedIndex: cr_clickedIndex.reducer,
    buyingPrice: buyingPrice.reducer,
    balanceUpdate: balanceUpdate.reducer,
    buyingCrypto: buyingCrypto.reducer,
    sellingPrice: sellingPrice.reducer,
    sectionChange: sectionChange.reducer,
    userTradeHistory: userTradeHistory.reducer,
    userTradeHistory_unSigned: userTradeHistory_unSigned.reducer,
    isBuying: isBuying.reducer,
    isSelling: isSelling.reducer,
    askingData_unSigned: askingData_unSigned.reducer,
    transferSort: transferSort.reducer,
    askHide: askHide.reducer,
    closeHide: closeHide.reducer,
    isScrollMove: isScrollMove.reducer,
  }
})

// const rootReducer = {
//   cr_name: cr_name.reducer,
//   cr_price: cr_price.reducer,
//   cr_market: cr_market.reducer,
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

export const { setCr_name } = cr_name.actions;
export const { setCr_price } = cr_price.actions;
export const { setCr_market } = cr_market.actions;
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
export const { setCr_selected } = cr_selected.actions;
export const { setCr_name_selected } = cr_name_selected.actions;
export const { setCr_market_selected } = cr_market_selected.actions;
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
export const { setAsking_dateTime } = asking_dateTime.actions;
export const { setChartSortTime } = chartSortTime.actions;
export const { setChartSortDate } = chartSortDate.actions;
export const { setAsking_totalAskSize } = asking_totalAskSize.actions;
export const { setAsking_totalBidSize } = asking_totalBidSize.actions;
export const { setTheme } = theme.actions;
export const { setLogInUser } = logInUser.actions;
export const { setLogInEmail } = logInEmail.actions;
export const { setFavoriteCrypto } = favoriteCrypto.actions;
export const { setIsFavorited } = isFavorited.actions;
export const { setOwnedCrypto } = ownedCrypto.actions;
export const { setIsOwned } = isOwned.actions;
export const { setUserWallet } = userWallet.actions;
export const { setCr_clickedIndex } = cr_clickedIndex.actions;
export const { setBuyingPrice } = buyingPrice.actions;
export const { setBalanceUpdate } = balanceUpdate.actions;
export const { setBuyingCrypto } = buyingCrypto.actions;
export const { setSellingPrice } = sellingPrice.actions;
export const { setSectionChange } = sectionChange.actions;
export const { setUserTradeHistory } = userTradeHistory.actions;
export const { setUserTradeHistory_unSigned } = userTradeHistory_unSigned.actions;
export const { setIsBuying } = isBuying.actions;
export const { setIsSelling } = isSelling.actions;
export const { setAskingData_unSigned } = askingData_unSigned.actions;
export const { setTransferSort } = transferSort.actions;
export const { setAskHide } = askHide.actions;
export const { setCloseHide } = closeHide.actions;
export const { setIsScrollMove } = isScrollMove.actions;

// export default store;