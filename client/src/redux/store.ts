import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { User } from './features/userSlice'
import { ChartSortDate, ChartSortTime, Market } from './features/chartSlice';
import { AskingData, ClosedData } from './features/askingSlice';
import { ScheduleCancel, UserTradeHistory } from './features/tradeSlice';
import { Crypto, ListCategory } from './features/cryptoListSlice';
import userReducers from './features/userSlice';
import askingReducers from './features/askingSlice';
import chartReducers from './features/chartSlice';
import cryptoListReducers from './features/cryptoListSlice';
import selectedCryptoReducers from './features/selectedCryptoSlice';
import tradeReducers from './features/tradeSlice';
import userCryptoReducers from './features/userCryptoSlice';
import walletReducers from './features/walletSlice';
import modalReducers from './features/modalSlice';
import placeholderReducers from './features/placeholderSlice';

export type RootState = {
  filteredData: Crypto[],
  selectedCrypto: Crypto,
  sortedData: Crypto[],
  delimitedTime: string[],
  delimitedDate: string[],
  candlePerMinute: Market[],
  candlePerDate: Market[],
  closedData: ClosedData[],
  askingData: AskingData[],
  totalAskSize: number,
  totalBidSize: number,
  chartSortDate: ChartSortDate,
  chartSortTime: ChartSortTime,
  favoriteCrypto: Crypto[],
  ownedCrypto: Crypto[],
  walletHover: boolean,
  userWallet: number,
  buyingPrice: number,
  balanceUpdate: boolean,
  buyingCrypto: string,
  sellingPrice: number,
  userTradeHistory: UserTradeHistory[],
  userTradeHistory_unSigned: UserTradeHistory[],
  transferSort: string,
  successTransfer: boolean,
  failTransfer: boolean,
  transferCategory: string,
  askHide: boolean,
  closeHide: boolean,
  listCategory: ListCategory,
  user: User,
  allCrypto: Crypto[],
  scheduledCancel: ScheduleCancel,
  searchedCrypto: Crypto[],
  sortStates: number[],
  cryptoRealTime: Crypto,
  errorModal: boolean,
  askingSpinner: boolean,
  workingSpinner: boolean,
}

const combinedReducer = combineReducers({
  closedData: askingReducers.closedData,
  askingData: askingReducers.askingData,
  totalAskSize: askingReducers.totalAskSize,
  totalBidSize: askingReducers.totalBidSize,
  delimitedTime: chartReducers.delimitedTime,
  delimitedDate: chartReducers.delimitedDate,
  chartSortTime: chartReducers.chartSortTime,
  chartSortDate: chartReducers.chartSortDate,
  candlePerMinute: chartReducers.candlePerMinute,
  candlePerDate: chartReducers.candlePerDate,
  allCrypto: cryptoListReducers.allCrypto,
  listCategory: cryptoListReducers.listCategory,
  filteredData: cryptoListReducers.filteredData,
  sortedData: cryptoListReducers.sortedData,
  searchedCrypto: cryptoListReducers.searchedCrypto,
  sortStates: cryptoListReducers.sortStates,
  selectedCrypto: selectedCryptoReducers.selectedCrypto,
  cryptoRealTime: selectedCryptoReducers.cryptoRealTime,
  buyingPrice: tradeReducers.buyingPrice,
  sellingPrice: tradeReducers.sellingPrice,
  userTradeHistory: tradeReducers.userTradeHistory,
  userTradeHistory_unSigned: tradeReducers.userTradeHistory_unSigned,
  scheduledCancel: tradeReducers.scheduledCancel,
  favoriteCrypto: userCryptoReducers.favoriteCrypto,
  ownedCrypto: userCryptoReducers.ownedCrypto,
  user: userReducers.user,
  walletHover: walletReducers.walletHover,
  userWallet: walletReducers.userWallet,
  balanceUpdate: walletReducers.balanceUpdate,
  transferSort: walletReducers.transferSort,
  successTransfer: walletReducers.successTransfer,
  failTransfer: walletReducers.failTransfer,
  transferCategory: walletReducers.transferCategory,
  errorModal: modalReducers.errorModal,
  askingSpinner: placeholderReducers.askingSpinner,
  workingSpinner: placeholderReducers.workingSpinner,
});

export const makeStore = () => {
  return configureStore({
    reducer: combinedReducer,
  })
}

const store = makeStore();

export default store;