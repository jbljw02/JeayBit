import { useDispatch, useSelector } from "react-redux";
import { AskingData, RootState, setAskHide, setAsking_dateTime, setBuyingPrice, setCloseHide, setIsBuying, setIsSelling, setSectionChange, setSelectedCrypto, setSellingPrice } from "../../redux/store";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import useFunction from "../useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AskingPrice from "./child/asking/AskingPrice";
import ClosedPrice from "./child/closed/ClosedPrice";
import TradeSection from "./child/trading/TradeSection";

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
      <PerfectScrollbar
        className='scrollBar-priceDetail hide-scrollBar'>
        <AskingPrice />
        <ClosedPrice />
        <TradeSection />
      </PerfectScrollbar>
    </>
  );
}
