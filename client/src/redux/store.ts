import { combineReducers, configureStore } from '@reduxjs/toolkit'
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
  balanceUpdate: walletReducers.balanceUpdate,
  transferSort: walletReducers.transferSort,
  successTransfer: walletReducers.successTransfer,
  failTransfer: walletReducers.failTransfer,
  transferCategory: walletReducers.transferCategory,
  noticeModal: modalReducers.noticeModal,
  askingSpinner: placeholderReducers.askingSpinner,
  chartSpinner: placeholderReducers.chartSpinner,
  workingSpinner: placeholderReducers.workingSpinner,
});

export type RootState = ReturnType<typeof combinedReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: combinedReducer,
  })
}

const store = makeStore();

// AppStore 타입은 configureStore로 생성된 타입
export type AppStore = ReturnType<typeof makeStore>
// AppDispatch는 스토어의 dispatch 타입
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];

export default store;