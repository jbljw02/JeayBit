import { useDispatch, useSelector } from "react-redux";
import { AskingData, RootState, setAskHide, setAsking_dateTime, setBuyingPrice, setCloseHide, setIsBuying, setIsSelling, setSectionChange, setSelectedCrypto, setSellingPrice } from "../../redux/store";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import useFunction from "../../utils/useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AskingPrice from "./child/asking/AskingPrice";
import ClosedPrice from "./child/closed/ClosedPrice";
import TradeSection from "./child/trading/TradeSection";

export default function PriceDetail() {
  const dispatch = useDispatch();

  const { selectAskingPrice, selectClosedPrice } = useFunction();

  const allCrypto = useSelector((state: RootState) => state.allCrypto);
  const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

  useEffect(() => {
    if (selectedCrypto.market) {
      selectAskingPrice(selectedCrypto.market);
      selectClosedPrice(selectedCrypto.market);
    }
  }, [allCrypto]);

  return (
    <>
      <PerfectScrollbar
        className='scrollBar-priceDetail hide-scrollBar'>
        <AskingPrice />
        <ClosedPrice />
        <TradeSection />
      </PerfectScrollbar>
    </>
  );
}
