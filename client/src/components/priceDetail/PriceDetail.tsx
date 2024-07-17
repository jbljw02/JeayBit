import { useSelector } from "react-redux";
import { useEffect } from "react";
import useFunction from "../useFuction";
import AskingPrice from "./child/asking/AskingPrice";
import ClosedPrice from "./child/closed/ClosedPrice";
import TradeSection from "./child/trading/TradeSection";
import { RootState } from "../../redux/store";
import CustomScrollbars from "../scrollbar/CustomScorllbars";

export default function PriceDetail() {
  const { selectAskingPrice, selectClosedPrice } = useFunction();

  const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime);

  // 선택한 화폐가 변경 될 때
  useEffect(() => {
    // 호가 및 체결내역 호출
    if (cryptoRealTime.market) {
      selectClosedPrice(cryptoRealTime.market);
      selectAskingPrice(cryptoRealTime.market);
    }
  }, [cryptoRealTime]);

  return (
    <>
      <CustomScrollbars
        hideScrollBar={true}
        style={{ width: '100%', height: '100%' }}>
        <AskingPrice />
        <ClosedPrice />
        <TradeSection />
      </CustomScrollbars>
    </>
  );
}
