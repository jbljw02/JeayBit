import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducers from './features/user/userSlice';
import askingReducers from './features/crypto/askingSlice';
import chartReducers from './features/chart/chartSlice';
import cryptoListReducers from './features/crypto/cryptoListSlice';
import selectedCryptoReducers from './features/crypto/selectedCryptoSlice';
import tradeReducers from './features/trade/tradeSlice';
import userCryptoReducers from './features/crypto/userCryptoSlice';
import walletReducers from './features/user/walletSlice';
import modalReducers from './features/ui/modalSlice';
import placeholderReducers from './features/ui/placeholderSlice';

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
  tradeHistory: tradeReducers.tradeHistory,
  unSignedTradeHistory: tradeReducers.unSignedTradeHistory,
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