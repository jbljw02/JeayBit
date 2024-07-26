import AskingPrice from "./child/asking/AskingPrice";
import ClosedPrice from "./child/closed/ClosedPrice";
import TradeSection from "./child/trading/TradeSection";
import CustomScrollbars from "../scrollbar/CustomScorllbars";

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
