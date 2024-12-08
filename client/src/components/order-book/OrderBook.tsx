import AskingPrice from "./child/asking/AskingPrice";
import ClosedPrice from "./child/closed/ClosedPrice";
import CustomScrollbars from "../scrollbar/CustomScorllbars";

export default function OrderBook() {
  return (
    <>
      <CustomScrollbars
        hideScrollBar={true}
        style={{ width: '100%', height: '100%' }}>
        <AskingPrice />
        <ClosedPrice />
      </CustomScrollbars>
    </>
  );
}
