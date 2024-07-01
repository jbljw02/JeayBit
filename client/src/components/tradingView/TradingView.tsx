import { useDispatch, useSelector } from "react-redux";
import { RootState, setChartSortDate, setChartSortTime, setSelectedChartSort } from "../../redux/store";
import price_rise from '../../assets/images/price-up.png'
import price_fall from '../../assets/images/price-down.png'
import TradingChart from "../TradingChart";
import useFunction from "../../utils/useFuction";
import { useEffect } from "react";
import CryptoDetail from "./child/CryptoDetail";
import formatWithComas from "../../utils/format/formatWithComas";
import ChangeRate from "./child/title/ChangeRate";
import CryptoTitle from "./child/title/CryptoTitle";
import ChartHeader from "./child/chart/ChartHeader";

export default function TradingView() {
  const dispatch = useDispatch();

  const delimitedTime = useSelector((state: RootState) => state.delimitedTime);
  const delimitedDate = useSelector((state: RootState) => state.delimitedDate);
  const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
  const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

  const allCrypto = useSelector((state: RootState) => state.allCrypto);
  const filteredData = useSelector((state: RootState) => state.filteredData);

  useEffect(() => {
    if (filteredData.length > 0 && selectedCrypto.market) {

    }
  }, [allCrypto]);

  return (
    <>
      <div className="crypto-name lightMode-title">
        <img
          className="crypto-img"
          src={
            selectedCrypto && selectedCrypto.market &&
            (`https://static.upbit.com/logos/${(selectedCrypto.market).slice(4)}.png`)
          }
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          alt="" />
        {
          selectedCrypto && selectedCrypto.name &&
          selectedCrypto.name
        }
        <span className="crypto-market lightMode">
          {
            selectedCrypto && selectedCrypto.market &&
            selectedCrypto.market
          }
        </span>
      </div>
      {/* 선택된 화폐의 가격과 변화율 및 24시간 동안의 상세정보 */}
      <CryptoTitle />
      <ChartHeader />
      <div className="trading-chart">
        <TradingChart />
      </div>
    </>
  );
}
