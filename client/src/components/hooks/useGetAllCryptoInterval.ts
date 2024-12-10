import axios from "axios";
import { setAllCrypto } from "../../redux/features/cryptoListSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { showNoticeModal } from "../../redux/features/modalSlice";
import { useEffect } from "react";
import useRequestCandle from "./useRequestCandle";
import useSelectAskingPrice from "./useSelectAskingPrice";
import useSelectClosedPrice from "./useSelectClosedPrice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useGetAllCryptoInterval() {
    const dispatch = useAppDispatch();

    const selectAskingPrice = useSelectAskingPrice();
    const selectClosedPrice = useSelectClosedPrice();
    const { requestCandleMinute, requestCandleDate } = useRequestCandle();

    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const chartSortTime = useAppSelector(state => state.chartSortTime);
    const chartSortDate = useAppSelector(state => state.chartSortDate);
    const chartSpinner = useAppSelector(state => state.chartSpinner);
    const askingSpinner = useAppSelector(state => state.askingSpinner);

    const getAllCrypto = async () => {
        try {
          const response = await axios.post(`${API_URL}/get_all_crypto/`, {}, {
            withCredentials: true,
          });
    
          dispatch(setAllCrypto(response.data.all_crypto));
        } catch (error) {
            dispatch(showNoticeModal({
                content: '서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.',
            }));
        }
    };

     // 초기 렌더링시 화폐 정보를 받아오고, 주기적으로 업데이트
     useEffect(() => {
      // 초기 마운트시 즉시 실행
      const fetchCryptoData = () => {
          getAllCrypto();

          // 호가 및 체결 내역 요청
          // 이미 내역을 불러오는 중이 아닐 때만 요청
          if (!askingSpinner) {
              selectClosedPrice(selectedCrypto.market || 'KRW-BTC');
              selectAskingPrice(selectedCrypto.market || 'KRW-BTC');
          }

          // 캔들 정보를 요청
          // 이미 내역을 불러오는 중이 아닐 때만 요청
          if (!chartSpinner) {
              if (chartSortTime) {
                  requestCandleMinute(selectedCrypto.market || 'KRW-BTC', chartSortTime);
              }
              else if (chartSortDate && !chartSortTime) {
                  requestCandleDate(selectedCrypto.market || 'KRW-BTc', chartSortDate);
              }
          }
      };

      // 초기 실행
      fetchCryptoData();

      // 3초마다 반복 실행
      const interval = setInterval(fetchCryptoData, 3000);

      return () => clearInterval(interval);
  }, [selectedCrypto, chartSortTime, chartSortDate, askingSpinner, chartSpinner]);

    return getAllCrypto;
}