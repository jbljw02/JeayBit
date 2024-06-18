import { useDispatch, useSelector } from "react-redux";
import { AskingData, RootState, setAskHide, setAsking_dateTime, setBuyingPrice, setCloseHide, setIsBuying, setIsSelling, setSectionChange, setSellingPrice } from "../../redux/store";
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

  const { buyCrypto_unSigned,
    sellCrypto_unSigned,
    selectAskingPrice,
    selectClosedPrice
  } = useFunction();

  const allCrypto = useSelector((state: RootState) => state.allCrypto);
  const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

  useEffect(() => {
    if (selectedCrypto.market) {
      selectAskingPrice(selectedCrypto.market);
      selectClosedPrice(selectedCrypto.market);
    }
  }, [allCrypto]);

  const askingData_unSigned = useSelector((state: RootState) => state.askingData_unSigned);
  const user = useSelector((state: RootState) => state.user);

  const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

  const completeToggleModal = useCallback(() => {
    setCompleteModalOpen(prevState => !prevState);
  }, []);

  // 미체결 화폐 매수 - 구매 대기 상태에서 동작 
  useEffect(() => {
    let localStorageItem: {
      id: string,
      price: number,
      trade_category: string,
      name: string,
      trade_amount: number,
      trade_price: number,
    }[] = [];

    // 로컬 스토리지에 있는 key-value를 꺼냄
    for (let i = 0; i < localStorage.length; i++) {
      let tempKey = localStorage.key(i);

      if (tempKey !== null) {
        let valueItem = localStorage.getItem(tempKey);

        if (valueItem !== null) {
          let tempValue = JSON.parse(valueItem);
          localStorageItem.push({
            id: tempKey,
            price: Number(tempValue.price),
            trade_category: tempValue.trade_category,
            name: tempValue.name,
            trade_amount: tempValue.trade_amount,
            trade_price: tempValue.trade_price,
          });
        }
      }
    }

    // 미체결 화폐 state의 키를 배열로 생성하고, 순차적으로 반복문 실행
    Object.keys(askingData_unSigned).forEach((cryptoName) => {

      // state의 키와 일치하는 화폐명을 가진 값을 로컬 스토리지에서 꺼내와서, 배열에 push
      let scheduledCrypto = [];
      for (let i = 0; i < localStorageItem.length; i++) {
        if (cryptoName === localStorageItem[i].name) {
          scheduledCrypto.push(localStorageItem[i]);
        }
      }

      // 로컬 스토리지에서 가져온 값을 기준으로 반복문 동작 - 호가를 순회하면서 값을 비교하기 위함
      for (let j = 0; j < scheduledCrypto.length; j++) {

        // 이중 for문으로 로컬 스토리지 값 하나당 모든 호가를 비교하며 가격 비교
        for (let k = 0; k < (askingData_unSigned[cryptoName]).length; k++) {

          // console.log("호가 : ", askingData_unSigned[cryptoName][k].ask_price);

          // 로컬 스토리지에서 가져온 값과 호가가 일치한다면 구매 요청
          if (scheduledCrypto[j].trade_category === 'BUY' && scheduledCrypto[j].price === (askingData_unSigned[cryptoName])[k].ask_price) {

            // console.log("매수 - 일치", scheduledCrypto[j].price);
            buyCrypto_unSigned(scheduledCrypto[j].id, user.email, scheduledCrypto[j].name, scheduledCrypto[j].trade_amount, scheduledCrypto[j].trade_price);
            completeToggleModal();
          }
        }

      }
    })

  }, [askingData_unSigned, buyCrypto_unSigned, completeToggleModal, user.email])

  // 미체결 화폐 매도 - 매도 대기 상태에서 동작 
  useEffect(() => {
    let localStorageItem: {
      id: string,
      price: number,
      trade_category: string,
      name: string,
      trade_amount: number,
      trade_price: number,
    }[] = [];

    // 로컬 스토리지에 있는 key-value를 꺼냄
    for (let i = 0; i < localStorage.length; i++) {
      let tempKey = localStorage.key(i);

      if (tempKey !== null) {
        let valueItem = localStorage.getItem(tempKey);

        if (valueItem !== null) {
          let tempValue = JSON.parse(valueItem);
          localStorageItem.push({
            id: tempKey,
            price: Number(tempValue.price),
            trade_category: tempValue.trade_category,
            name: tempValue.name,
            trade_amount: tempValue.trade_amount,
            trade_price: tempValue.trade_price,
          });
        }
      }
    }

    // 미체결 화폐 state의 키를 배열로 생성하고, 순차적으로 반복문 실행
    Object.keys(askingData_unSigned).forEach((cryptoName) => {

      // state의 키와 일치하는 화폐명을 가진 값을 로컬 스토리지에서 꺼내와서, 배열에 push
      let scheduledCrypto = [];
      for (let i = 0; i < localStorageItem.length; i++) {
        if (cryptoName === localStorageItem[i].name) {
          scheduledCrypto.push(localStorageItem[i]);
        }
      }

      // 로컬 스토리지에서 가져온 값을 기준으로 반복문 동작 - 호가를 순회하면서 값을 비교하기 위함
      for (let j = 0; j < scheduledCrypto.length; j++) {

        // 이중 for문으로 로컬 스토리지 값 하나당 모든 호가를 비교하며 가격 비교
        for (let k = 0; k < (askingData_unSigned[cryptoName]).length; k++) {

          // console.log("호가 : ", askingData_unSigned[cryptoName][k].bid_price);

          // 로컬 스토리지에서 가져온 값과 호가가 일치한다면 구매 요청
          if (scheduledCrypto[j].trade_category === 'SELL' && scheduledCrypto[j].price === (askingData_unSigned[cryptoName])[k].bid_price) {

            // console.log("매도 - 일치", scheduledCrypto[j].price);
            sellCrypto_unSigned(scheduledCrypto[j].id, user.email, scheduledCrypto[j].name, scheduledCrypto[j].trade_amount, scheduledCrypto[j].trade_price);
            completeToggleModal();
          }
        }

      }
    })

  }, [askingData_unSigned, completeToggleModal, user.email, sellCrypto_unSigned])

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
