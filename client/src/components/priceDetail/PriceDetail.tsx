import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import useFunction from "../useFuction";
import AskingPrice from "./child/asking/AskingPrice";
import ClosedPrice from "./child/closed/ClosedPrice";
import TradeSection from "./child/trading/TradeSection";
import { RootState } from "../../redux/store";
import CustomScrollbars from "../scrollbar/CustomScorllbars";
import { setAskingSpinner } from "../../redux/features/placeholderSlice";

export default function PriceDetail() {
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
