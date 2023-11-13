import { useDispatch, useSelector } from "react-redux";
import { AskingData, RootState, setAsking_data, setAsking_dateTime, setBuyingCrypto, setBuyingPrice, setIsBuying, setSectionChange, setSellingPrice } from "../store";
import { SetStateAction, useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import axios from "axios";
import useFunction from "./useFuction";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, makeStyles } from '@material-ui/core';

const PriceDetail = () => {

  const dispatch = useDispatch();

  const sectionChange = useSelector((state: RootState) => state.sectionChange);

  return (
    <>
      <div className="lightMode">
        <div className="priceDetail-title askingTitle lightMode">호가내역</div>
        <AskingPrice />
        <div className="priceDetail-title closedTitle lightMode">체결내역</div>
        <ClosedPrice />
        <div className="trading-section lightMode-title">
          <span className={`${sectionChange === '매수' ?
            'buyingSection' :
            ''
            }`} onClick={() => (dispatch(setSectionChange('매수')))}>매수</span>
          <span className={`${sectionChange === '매도' ?
            'sellingSection' :
            ''
            }`} onClick={() => (dispatch(setSectionChange('매도')))}>매도</span>
          <span className={`${sectionChange === '거래내역' ?
            'tradingHistorySection' :
            ''
            }`} onClick={() => (dispatch(setSectionChange('거래내역')))}>거래내역</span>
        </div>
        {
          sectionChange === '매수' ?
            <BuyingSection /> :
            (
              sectionChange === '매도' ?
                <SellingSection /> :
                <TradeHistory />
            )
        }
      </div>
    </>
  );
}

// bid = 매수, ask = 매도
const AskingPrice = () => {

  const dispatch = useDispatch();

  const asking_data = useSelector((state: RootState) => state.asking_data);
  const cr_market_selected = useSelector((state: RootState) => state.cr_market_selected);
  const asking_dateTime = useSelector((state: RootState) => state.asking_dateTime);
  const asking_totalAskSize = useSelector((state: RootState) => state.asking_totalAskSize);
  const asking_totalBidSize = useSelector((state: RootState) => state.asking_totalBidSize);
  const cr_selected = useSelector((state: RootState) => state.cr_selected);

  const [prevData, setPrevData] = useState<AskingData[]>();

  const [differences_ask, setDifferences_ask] = useState<{
    new_ask_price: number,
    new_ask_size: number
  }[]>([]);

  const [differences_bid, setDifferences_bid] = useState<{
    new_bid_price: number,
    new_bid_size: number,
  }[]>([]);

  // 호가 수량의 변화를 감지하고 이전 값과 비교하여 변화가 생긴 값을 상태에 업데이트
  useEffect(() => {
    setPrevData(asking_data);  // state의 업데이트는 비동기적이기 때문에 값이 즉시 바뀌지 않음. 그러므로 이 useEffect() 안에서 prevData는 아직 이전의 값을 가지고 있기 때문에 cr_price와 prevData는 다른 값을 가짐. (cr_price = 현재값, prevData = 이전값)

    let newDifferences_ask: {
      new_ask_price: number,
      new_ask_size: number,
    }[] = [];
    let newDifferences_bid: {
      new_bid_price: number,
      new_bid_size: number,
    }[] = [];

    if (prevData !== undefined) {
      prevData.forEach((value, index) => {
        if (value.ask_size !== asking_data[index].ask_size) {
          newDifferences_ask.push({ new_ask_price: asking_data[index].ask_price, new_ask_size: asking_data[index].ask_size });
        }
        if (value.bid_size !== asking_data[index].bid_size) {
          newDifferences_bid.push({ new_bid_price: asking_data[index].bid_price, new_bid_size: asking_data[index].bid_size });
        }
      })
    }

    setDifferences_ask(newDifferences_ask)
    setDifferences_bid(newDifferences_bid);
  }, [asking_data])

  if (asking_dateTime) {
    const date = new Date(asking_dateTime);
    let newDateString = new Intl.DateTimeFormat('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

    dispatch(setAsking_dateTime(newDateString.replace(". ", "/").replace(".", "").replace("오전 ", "").replace("오후 ", "")))
  }

  return (
    <>
      <table className="askingPrice-table lightMode">
        <thead className="lightMode-title">
          <tr>
            <th>등록시간</th>
            <th>호가</th>
            <th>
              수량<span>({(cr_market_selected).slice(4)})</span>
            </th>
          </tr>
        </thead>
      </table>
      <SimpleBar className="scrollBar-askingPriceTable">
        <table className="askingPrice-table lightMode">
          <tbody>
            {
              asking_data.map((item, i) => {
                // 이전 호가와 현재 호가를 비교한 값을 이용 - 변경된 호가가 현재 state를 순회하면서 일치하는 값에 대해서 스타일 지정
                let isChanged_bid = differences_bid.some((value, index) => {
                  return value.new_bid_size === item.bid_size;
                })
                let bidClass = isChanged_bid ? 'change-bid' : '';
                const percentage = (item.bid_size / asking_totalBidSize) * 100;  // 전체호가를 각각 호가로 나누어 비울을 환산한 후 해당 비율만큼 스타일 설정
                return (
                  <tr
                    key={i}
                    style={{ background: `linear-gradient(270deg, rgba(34,171,148, .2) ${percentage}%, transparent ${percentage}%)` }}>
                    <td>{asking_dateTime}</td>
                    <td>{(item.bid_price).toLocaleString()}</td>
                    <td className={bidClass}>{(item.bid_size).toFixed(5)}
                    </td>
                  </tr>
                )
              })
            }
            {
              asking_data.map((item, i) => {
                // 이전 호가와 현재 호가를 비교한 값을 이용 - 변경된 호가가 현재 state를 순회하면서 일치하는 값에 대해서 스타일 지정
                let isChange_ask = differences_ask.some((value, index) => {
                  return value.new_ask_size === item.ask_size;
                })
                let askClass = isChange_ask ? 'change-ask' : '';
                const percentage = (item.ask_size / asking_totalAskSize) * 100;  // 전체호가를 각각 호가로 나누어 비울을 환산한 후 해당 비율만큼 스타일 설정
                return (
                  <tr
                    key={i}
                    style={{ background: `linear-gradient(270deg, rgba(242,54,69, .2) ${percentage}%, transparent ${percentage}%)` }}>
                    <td>{asking_dateTime}</td>
                    <td>{(item.ask_price).toLocaleString()}</td>
                    <td className={askClass}>{(item.ask_size).toFixed(5)}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </SimpleBar>
    </>
  )
}

const ClosedPrice = () => {

  const closed_data = useSelector((state: RootState) => state.closed_data);
  const cr_market_selected = useSelector((state: RootState) => state.cr_market_selected);
  const cr_selected = useSelector((state: RootState) => state.cr_selected);

  return (
    <>
      {/* 스크롤바를 넣기 위해 테이블을 두 개로 구성 */}
      <table className="closedPrice-table lightMode-title">
        <thead>
          <tr>
            <th>체결시간</th>
            <th>체결가격</th>
            <th>
              체결량<span>({(cr_market_selected).slice(4)})</span>
            </th>
          </tr>
        </thead>
      </table>
      <SimpleBar className="scrollBar-closedPriceTable">
        <table className="closedPrice-table">
          <tbody>
            {
              closed_data.map((item, i) => {
                const date = new Date(item.timestamp);
                let trade_time = new Intl.DateTimeFormat('ko-KR', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(date);
                trade_time = trade_time.replace(". ", "/").replace(".", "").replace("오전 ", "").replace("오후 ", "")
                return (
                  <tr key={i}>
                    <td>{trade_time}</td>
                    <td>{(item.trade_price).toLocaleString()}</td>
                    {
                      item.ask_bid === 'BID' ?
                        <td className="td-rise">{(item.trade_volume).toFixed(5)}</td> :
                        <td className="td-fall">{(item.trade_volume).toFixed(5)}</td>
                    }
                  </tr>
                )
              }
              )
            }
          </tbody>
        </table>
      </SimpleBar>
    </>
  )
}

const BuyingSection = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cr_selected = useSelector((state: RootState) => state.cr_selected);
  const cr_name_selected = useSelector((state: RootState) => state.cr_name_selected);
  const logInEmail = useSelector((state: RootState) => state.logInEmail);
  const userWallet = useSelector((state: RootState) => state.userWallet);
  const asking_data = useSelector((state: RootState) => state.asking_data);  // bid = 매수, ask = 매도

  const buyingPrice = useSelector((state: RootState) => state.buyingPrice);
  const [selectedPercentage, setSelectedPercentage] = useState<string>('');
  const [bidSort, setBidSort] = useState<string>('지정가');

  const [buyTotal, setBuyTotal] = useState<number>(0);
  const [buyQuantity, setBuyQuantity] = useState<number>(0);

  const [quantityInputValue, setQuantityInputValue] = useState('0');
  const [totalInputValue, setTotalInputvalue] = useState('0');
  const [buyingInputValue, setBuyingInputValue] = useState('0');

  // 구매하려는 화폐의 가격과 호가 사이의 일치 여부
  const [matchedItem, setMatchedItem] = useState<AskingData | null>(null);

  // 화폐를 구매하기 위해 대기중인지 여부
  // const [isBuying, setIsBuying] = useState<boolean>(false);
  const isBuying = useSelector((state: RootState) => state.isBuying);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

  // 화폐 거래내역에 '매수'로 저장할지 '매도'로 저장할지를 지정
  const [tradeCategory, setTradeCategory] = useState<string>('매수');

  // 현재 시간을 저장하는 state
  const [time, setTime] = useState(new Date());

  const [key, setKey] = useState<{
    id: string,
    price: number
  }[]>([]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const completeToggleModal = () => {
    setCompleteModalOpen(!completeModalOpen);
  }

  const { getBalance, getOwnedCrypto, addTradeHistory, getTradeHistory, getCryptoName } = useFunction();

  useEffect(() => {
    getCryptoName();
  }, [])

  // 매수가가 바뀌면 그에 따라 입력값도 변경
  useEffect(() => {
    setBuyingInputValue(buyingPrice.toString())
  }, [buyingPrice])

  // 선택 화폐가 바뀔 때마다 매수 가격을 해당 화폐의 가격으로 변경하고, 주문 수량 및 총액을 초기화
  useEffect(() => {
    // 주문 수량
    setBuyQuantity(0);
    setQuantityInputValue('0');

    // 주문 총액
    setBuyTotal(0);
    setTotalInputvalue('0');
  }, [cr_name_selected])

  // 호가가 변화할 때마다 실행하지만, 사용자의 구매 대기 여부가 true일 때만 로직을 동작
  useEffect(() => {

    // 사용자의 구매 대기 여부가 true일 때만 호가와 구매가격이 일치하는지 검사 
    if (isBuying[cr_name_selected]) {

      // 로컬 스토리지에 있는 key-value를 꺼냄
      let localStorageItem = [];
      for (let i = 0; i < localStorage.length; i++) {
        let tempKey = localStorage.key(i);
        if (tempKey !== null) {
          let tempValue = localStorage.getItem(tempKey);
          if (tempValue !== null) {
            tempValue = tempValue.replace(/"/g, '');
            localStorageItem.push({ id: tempKey, price: Number(tempValue) });
          }
        }
      }

      // 호가와 로컬 스토리지에서 꺼낸 값을 비교하여 일치하는 값만 state에 할당
      let tempState = [];
      for (let i = 0; i < asking_data.length; i++) {
        for (let j = 0; j < localStorageItem.length; j++) {
          if (asking_data[i].ask_price === localStorageItem[j].price) {
            tempState.push({ id: localStorageItem[j].id, price: localStorageItem[j].price })
          }
        }
      }

      setKey(tempState);

      if(key.length !== 0) {
        buyCrypto_unSigned(logInEmail, cr_selected.name, buyQuantity, buyTotal);
        key.forEach(item => {
          localStorage.removeItem(item.id);
        })
      }

      console.log("key 일치 여부 : ", key);
    }
  }, [asking_data, isBuying])

  // 호가와 구매가가 일치할 때
  const buyCrypto = (email: string, cryptoName: string, cryptoQuantity: number, buyTotal: number) => {
    (async (email, cryptoName, cryptoQuantity, buyTotal) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/buy_crypto/", {
          email: email,
          crypto_name: cryptoName,
          crypto_quantity: cryptoQuantity,
          buy_total: buyTotal,
        });
        console.log("구매 화폐 전송 성공", response.data);
        getBalance(logInEmail);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
        getOwnedCrypto(logInEmail);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
      }
      catch (error) {
        console.log("구매 화폐 전송 실패: ", error)
      }
    })(email, cryptoName, cryptoQuantity, buyTotal);
    completeToggleModal();
  }

  // 호가와 구매가가 일치하지 않을 때
  const buyCrypto_unSigned = (email: string, cryptoName: string, cryptoQuantity: number, buyTotal: number) => {
    (async (email, cryptoName, cryptoQuantity, buyTotal) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/buy_crypto_unSigned/", {
          id: key,
          email: email,
          crypto_name: cryptoName,
          crypto_quantity: cryptoQuantity,
          buy_total: buyTotal,
        });
        console.log("구매 화폐 전송 성공", response.data);
        getBalance(logInEmail);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
        getOwnedCrypto(logInEmail);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
      }
      catch (error) {
        console.log("구매 화폐 전송 실패: ", error)
      }
    })(email, cryptoName, cryptoQuantity, buyTotal);

    if (localStorage.length <= 1) {
      let updatedIsBuying = { ...isBuying };
      updatedIsBuying[cr_name_selected] = false;
      dispatch(setIsBuying(updatedIsBuying));
    }
    completeToggleModal();
  }

  const selectPercentage = (percentage: string) => {
    setSelectedPercentage(percentage)

    // 매수가격이 0이면 주문수량/주문총액은 의미가 없으므로 
    if (buyingInputValue !== '0') {

      // 현재 잔고 기준 퍼센테이지를 '주문총액'에 할당하고, 주문총액이 구매하려는 화폐 가격에 대해 어느 정도의 비율을 가지는지 계산
      if (percentage === '10%') {
        let dividedTotal = userWallet * 0.1;
        setBuyTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
      }
      if (percentage === '25%') {
        let dividedTotal = userWallet * 0.25;
        setBuyTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
      }
      if (percentage === '50%') {
        let dividedTotal = userWallet * 0.50;
        setBuyTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
      }
      if (percentage === '75%') {
        let dividedTotal = userWallet * 0.75;
        setBuyTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
      }
      if (percentage === '100%') {
        let dividedTotal = userWallet;
        setBuyTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
      }

    }
  }

  return (
    <>
      <ModalSumbit modalOpen={modalOpen} setModalOpen={setModalOpen} toggleModal={toggleModal} />
      <ModalComplete completeModalOpen={completeModalOpen} setCompleteModalOpen={setCompleteModalOpen} completeToggleModal={completeToggleModal} />
      <table className="trading-headTable">
        <tbody>
          <tr className="trading-choice">
            <td className="radio">
              주문구분
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="radio">
              <input type="radio" name="radio" id="radio1" className="radio-input" onChange={() => (setBidSort('지정가'))} checked={bidSort === '지정가'}></input>
              <label className="radio-designate radio-label" htmlFor="radio1">
                지정가
              </label>
            </td>
            <td className="radio">
              <input type="radio" name="radio" id="radio2" className="radio-input" onChange={() => (setBidSort('시장가'))} checked={bidSort === '시장가'}></input>
              <label className="radio-market radio-label" htmlFor="radio2">
                시장가
              </label>
            </td>
            <td className="radio">
              <input type="radio" name="radio" id="radio3" className="radio-input" onChange={() => (setBidSort('예약가'))} checked={bidSort === '예약가'}></input>
              <label className="radio-reserve radio-label" htmlFor="radio3">
                예약/지정가
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      {
        // 매수 - 지정가 영역
        bidSort === '지정가' ?
          <>
            <table className="trading-table">
              <tbody>
                <tr>
                  <td className="trading-category">주문가능</td>
                  <td className="trading-availableTrade">{(Number(userWallet).toLocaleString())}
                    <span>KRW</span>
                  </td>
                </tr>
                <tr>
                  <td className="trading-category">매수가격</td>
                  <td className="td-input">
                    <input type="text"
                      value={buyingInputValue}
                      onChange={(e) => {
                        let value = e.target.value;

                        // 매수가격을 변경했음에도 구매 대기 여부가 true이면 의도치 않게 매수가 완료될 수 있으니, 매수가를 변경했을 때는 구매 대기 여부를 false로 처리
                        // let updatedIsBuying = { ...isBuying };
                        // updatedIsBuying[cr_name_selected] = false;
                        // dispatch(setIsBuying(updatedIsBuying));

                        // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                        if (value[0] === '0' && value.length > 1) {
                          if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                            value = value.substring(1);
                          }
                        }

                        // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
                        value = value.replace(/(\..*)\./g, "$1");

                        // 숫자와 "." 외의 문자를 제거
                        value = value.replace(/[^0-9.]/g, "");

                        // "."이 맨 처음에 오지 않도록 함
                        if (value[0] === '.') {
                          value = '0' + value;
                        }

                        // value값이 비게 되면 '0'으로 설정(NaN값 방지)
                        if (value === '') {
                          value = '0';
                        }

                        dispatch(setBuyingPrice(Number(value)));
                        setBuyingInputValue(value);
                        setBuyTotal(Math.floor(parseFloat(value) * buyQuantity));
                        setTotalInputvalue((Math.floor(parseFloat(value) * buyQuantity)).toString());
                      }} />
                    <span>KRW</span>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} />
                  </td>
                </tr>
                <tr>
                  <td className="trading-category">주문수량</td>
                  <td className="td-input">
                    <input type="text"
                      value={quantityInputValue}
                      onChange={(e) => {
                        let value = e.target.value;

                        // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                        if (value[0] === '0' && value.length > 1) {
                          if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                            value = value.substring(1);
                          }
                        }

                        // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
                        value = value.replace(/(\..*)\./g, "$1");

                        // 숫자와 "." 외의 문자를 제거
                        value = value.replace(/[^0-9.]/g, "");

                        // "."이 맨 처음에 오지 않도록 함
                        if (value[0] === '.') {
                          value = '0' + value;
                        }

                        // value값이 비게 되면 '0'으로 설정(NaN값 방지)
                        if (value === '') {
                          value = '0';
                        }

                        const decimalPart = (value.split('.')[1] || '').length;

                        // 소수점 자릿수가 8자리 이하인 경우만
                        if (decimalPart <= 8) {
                          setQuantityInputValue(value);
                          setBuyQuantity(parseFloat(value));
                        }
                        setBuyTotal(Math.floor(buyingPrice * parseFloat(value)));
                        setTotalInputvalue((Math.floor(buyingPrice * parseFloat(value))).toString());
                      }}
                    />
                    <span>
                      {
                        cr_selected && cr_selected.market ?
                          (cr_selected.market).slice(4) :
                          null
                      }
                    </span>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td className="count-percentage">
                    <span className={
                      selectedPercentage === '10%' ?
                        'buy-percentage' :
                        'nonSelected-percentage'
                    } onClick={() => (selectPercentage('10%'))}>10%</span>
                    <span className={
                      selectedPercentage === '25%' ?
                        'buy-percentage' :
                        'nonSelected-percentage'
                    } onClick={() => (selectPercentage('25%'))}>25%</span>
                    <span className={
                      selectedPercentage === '50%' ?
                        'buy-percentage' :
                        'nonSelected-percentage'
                    } onClick={() => (selectPercentage('50%'))}>50%</span>
                    <span className={
                      selectedPercentage === '75%' ?
                        'buy-percentage' :
                        'nonSelected-percentage'
                    } onClick={() => (selectPercentage('75%'))}>75%</span>
                    <span className={
                      selectedPercentage === '100%' ?
                        'buy-percentage' :
                        'nonSelected-percentage'
                    } onClick={() => (selectPercentage('100%'))}>100%</span>
                  </td>
                </tr>
                <tr>
                  <td className="trading-category">주문총액</td>
                  <td className="td-input">
                    <input type="text"
                      value={totalInputValue}
                      onChange={(e) => {
                        let value = e.target.value;

                        // 첫 번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                        if (value[0] === '0' && value.length > 1) {
                          if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                            value = value.substring(1);
                          }
                        }

                        // 입력값이 숫자인지 확인하고, 숫자 이외의 문자가 포함되어 있는지 확인
                        const isNumber = /^[0-9]*$/.test(value);

                        if (value === '') {
                          value = '0';
                        }

                        if (buyingInputValue !== '0') {

                          if (isNumber) {
                            setTotalInputvalue(value);
                            setBuyTotal(parseFloat(value));

                            let dividiedQuantity = Number(value) / buyingPrice;

                            // 소수점 아래 8자리로 제한
                            if ((dividiedQuantity.toString().split('.')[1] || '').length > 8) {
                              dividiedQuantity = parseFloat(dividiedQuantity.toFixed(8));
                            }

                            setBuyQuantity(dividiedQuantity);
                            setQuantityInputValue(dividiedQuantity.toString());
                          }
                        }
                      }} />
                    <span>KRW</span>
                  </td>
                </tr>
              </tbody>
            </table>
            {
              logInEmail !== '' ?
                <div className="trading-submit-buy designate">
                  <span onClick={() => {
                    // 호가와 구매가가 일치하는지 확인
                    let item = asking_data.find(item => item.ask_price === buyingPrice);
                    if (item !== undefined) {
                      // 일치한다면 바로 매수 요청을 전송
                      buyCrypto(logInEmail, cr_selected.name, buyQuantity, buyTotal);

                      addTradeHistory(logInEmail, cr_selected.name, tradeCategory, time, cr_selected.market, buyingPrice, buyTotal, buyQuantity, true);
                      getTradeHistory(logInEmail);
                    }
                    else {
                      // 선택한 화폐에 대한 구매 대기 여부를 true로 설정
                      let updatedIsBuying = { ...isBuying };
                      updatedIsBuying[cr_name_selected] = true;
                      dispatch(setIsBuying(updatedIsBuying));

                      // 일치하지 않는다면 대기 모달 팝업
                      toggleModal();
                      setModalOpen(!modalOpen);

                      addTradeHistory(logInEmail, cr_selected.name, tradeCategory, time, cr_selected.market, buyingPrice, buyTotal, buyQuantity, false);
                      getTradeHistory(logInEmail);
                    }
                  }}>매수</span>
                </div> :
                <div className="trading-submit-nonLogIn-buy designate">
                  <span onClick={() => { navigate('/logIn') }}>로그인</span>
                  <span onClick={() => { navigate('/signUp') }} >회원가입</span>
                </div>
            }
          </> :
          (
            // 매수 - 시장가 영역
            bidSort === '시장가' ?
              <>
                <table className="trading-table">
                  <tr>
                    <td className="trading-category">주문가능</td>
                    <td className="trading-availableTrade">{(Number(userWallet).toLocaleString())}
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">주문총액</td>
                    <td className="td-input">
                      <input value={buyTotal}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="count-percentage">
                      <span className={
                        selectedPercentage === '10%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('10%'))}>10%</span>
                      <span className={
                        selectedPercentage === '25%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('25%'))}>25%</span>
                      <span className={
                        selectedPercentage === '50%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('50%'))}>50%</span>
                      <span className={
                        selectedPercentage === '75%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('75%'))}>75%</span>
                      <span className={
                        selectedPercentage === '100%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('100%'))}>100%</span>
                    </td>
                  </tr>
                </table>
                {
                  logInEmail !== '' ?
                    <div className="trading-submit-buy market">
                      <span onClick={
                        // 호가와의 일치 여부를 확인하지 않음
                        () => buyCrypto(logInEmail, cr_selected.name, buyQuantity, buyTotal)}>매수
                      </span>
                    </div> :
                    <div className="trading-submit-nonLogIn-buy market">
                      <span onClick={() => { navigate('/logIn') }}>로그인</span>
                      <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                    </div>
                }
              </> :
              // 매수 - 예약가 영역
              <>
                <table className="trading-table">
                  <tr>
                    <td className="trading-category">주문가능</td>
                    <td className="trading-availableTrade">{userWallet}
                      <span>KRW</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="trading-category">감시가격</td>
                    <td className="td-input">
                      <input onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} value={buyingPrice}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} />
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">매수가격</td>
                    <td className="td-input">
                      <input onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} value={buyingPrice}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} />
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">주문수량</td>
                    <td className="td-input">
                      <input>
                      </input>
                      <span>
                        {
                          cr_selected && cr_selected.market ?
                            (cr_selected.market).slice(4) :
                            null
                        }</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="count-percentage">
                      <span className={
                        selectedPercentage === '10%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('10%'))}>10%</span>
                      <span className={
                        selectedPercentage === '25%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('25%'))}>25%</span>
                      <span className={
                        selectedPercentage === '50%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('50%'))}>50%</span>
                      <span className={
                        selectedPercentage === '75%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('75%'))}>75%</span>
                      <span className={
                        selectedPercentage === '100%' ?
                          'buy-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('100%'))}>100%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">주문총액</td>
                    <td className="td-input">
                      <input>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                </table>
                {
                  logInEmail !== '' ?
                    <div className="trading-submit-buy reserve">
                      <span>예약매수</span>
                    </div> :
                    <div className="trading-submit-nonLogIn-buy reserve">
                      <span onClick={() => { navigate('/logIn') }}>로그인</span>
                      <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                    </div>
                }
              </>
          )
      }
    </>
  )
}

const SellingSection = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cr_selected = useSelector((state: RootState) => state.cr_selected);
  const cr_market_selected = useSelector((state: RootState) => state.cr_market_selected);
  const cr_name_selected = useSelector((state: RootState) => state.cr_name_selected);
  const logInEmail = useSelector((state: RootState) => state.logInEmail);
  const userWallet = useSelector((state: RootState) => state.userWallet);
  const asking_data = useSelector((state: RootState) => state.asking_data);  // bid = 매수, ask = 매도
  const ownedCrypto = useSelector((state: RootState) => state.ownedCrypto);

  const [selectedPercentage, setSelectedPercentage] = useState<string>('');
  const [bidSort, setBidSort] = useState<string>('지정가');
  // const [availableQuantity, setAvailableQuantity] = useState<any>(0);

  const sellingPrice = useSelector((state: RootState) => state.sellingPrice);
  const [sellTotal, setSellTotal] = useState<number>(0);
  const [sellQuantity, setSellQuantity] = useState<number>(0);

  const [quantityInputValue, setQuantityInputValue] = useState('0');
  const [totalInputValue, setTotalInputvalue] = useState('0');
  const [sellingInputValue, setSellingInputValue] = useState('0');

  // 매도하려는 화폐의 가격과 호가 사이의 일치 여부
  const [matchedItem, setMatchedItem] = useState<AskingData | null>(null);

  // 화폐를 매도하기 위해 대기중인지 여부
  const [isSelling, setIsSelling] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

  // 화폐 거래내역에 '매수'로 저장할지 '매도'로 저장할지를 지정
  const [tradeCategory, setTradeCategory] = useState<string>('매도');

  // 현재 시간을 저장하는 state
  const [time, setTime] = useState(new Date());

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const completeToggleModal = () => {
    setCompleteModalOpen(!completeModalOpen);
  }

  const { getBalance, getOwnedCrypto, addTradeHistory, getTradeHistory } = useFunction();

  // 매도가가 바뀌면 그에 따라 입력값도 변경
  useEffect(() => {
    setSellingInputValue(sellingPrice.toString());
  }, [sellingPrice])

  // 선택 화폐가 바뀔 때마다 주문 가능한 보유 화폐량을 변경하고, 주문 수량 및 총액을 초기화
  useEffect(() => {
    // 주문 수량
    setSellQuantity(0);
    setQuantityInputValue('0');

    // 주문 총액
    setSellTotal(0);
    setTotalInputvalue('0');
  }, [cr_name_selected])

  // 호가가 변화할 대마다 실행하지만, 사용자의 매도 대기 여부가 true일 때만 로직 동작
  useEffect(() => {
    // 사용자의 매도 대기 여부가 true일 때만 호가와 매도가격이 일치하는지 검사
    if (isSelling) {
      let item = asking_data.find(item => item.bid_price === sellingPrice);
      if (item !== undefined) {
        setMatchedItem(item);
      }
    }

  }, [asking_data, isSelling])

  useEffect(() => {
    if (matchedItem !== null) {
      sellCrypto(logInEmail, cr_selected.name, sellQuantity, sellTotal);
    }
  }, [matchedItem])

  const sellCrypto = (email: string, cryptoName: string, cryptoQuantity: number, sellTotal: number) => {
    (async (email, cryptoName, cryptoQuantity, sellTotal) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/sell_crypto/", {
          email: email,
          crypto_name: cryptoName,
          crypto_quantity: cryptoQuantity,
          sell_total: sellTotal,
        });
        console.log("매도 화폐 전송 성공", response.data);
        getBalance(logInEmail);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
        getOwnedCrypto(logInEmail);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
        getTradeHistory(logInEmail);  // 매도했으니 업데이트 됐을 거래내역을 가져옴 
      } catch (error) {
        console.log("매도 화폐 전송 실패: ", error);
      }
    })(email, cryptoName, cryptoQuantity, sellTotal);
    setIsSelling(false);
    completeToggleModal();
  }

  const selectPercentage = (percentage: string) => {
    setSelectedPercentage(percentage)

    // 선택된 화폐의 보유 수량
    let availableQuantity = ownedCrypto.find((item) => item.crypto_name === cr_name_selected)?.quantity

    // 매수가격이 0이면 주문수량/주문총액은 의미가 없고, 보유 화폐량이 undefined이면 연산이 불가능 
    if (sellingInputValue !== '0' && availableQuantity !== undefined) {

      // 현재 화폐 보유량 기준 퍼센테이지를 '주문수량'에 할당하고, 주문수량이 매도 가격의 어느 정도 비율을 차지하는지를 계산하여 '주문총액'에 할당
      if (percentage === '10%') {
        let dividedQuantity = availableQuantity * 0.10;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        let dividedTotal = sellingPrice * dividedQuantity
        dividedTotal = Math.ceil(dividedTotal);

        // 주문 수량
        setSellQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());

        // 주문 총액
        setSellTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
      }
      if (percentage === '25%') {
        let dividedQuantity = availableQuantity * 0.25;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        let dividedTotal = sellingPrice * dividedQuantity
        dividedTotal = Math.ceil(dividedTotal);

        // 주문 수량
        setSellQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());

        // 주문 총액
        setSellTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
      }
      if (percentage === '50%') {
        let dividedQuantity = availableQuantity * 0.50;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        let dividedTotal = sellingPrice * dividedQuantity
        dividedTotal = Math.ceil(dividedTotal);

        // 주문 수량
        setSellQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());

        // 주문 총액
        setSellTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
      }
      if (percentage === '75%') {
        let dividedQuantity = availableQuantity * 0.75;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        let dividedTotal = sellingPrice * dividedQuantity
        dividedTotal = Math.ceil(dividedTotal);

        // 주문 수량
        setSellQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());

        // 주문 총액
        setSellTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
      }
      if (percentage === '100%') {
        let dividedQuantity = availableQuantity;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        let dividedTotal = sellingPrice * dividedQuantity
        dividedTotal = Math.ceil(dividedTotal);

        // 주문 수량
        setSellQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());

        // 주문 총액
        setSellTotal(Math.floor(dividedTotal));
        setTotalInputvalue((Math.floor(dividedTotal)).toString());
      }
    }
    else if (availableQuantity === undefined) {
      // 주문 수량
      setSellQuantity(0);
      setQuantityInputValue('0');

      // 주문 총액
      setSellTotal(0);
      setTotalInputvalue('0');
    }
  }

  return (
    <>
      <ModalSumbit modalOpen={modalOpen} setModalOpen={setModalOpen} toggleModal={toggleModal} />
      <ModalComplete completeModalOpen={completeModalOpen} setCompleteModalOpen={setCompleteModalOpen} completeToggleModal={completeToggleModal} />
      <table className="trading-headTable">
        <tr className="trading-choice">
          <td className="radio">
            주문구분
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td className="radio">
            <input type="radio" name="radio" id="radio1" className="radio-input" onClick={() => (setBidSort('지정가'))} checked={bidSort === '지정가'}></input>
            <label className="radio-designate radio-label" htmlFor="radio1">
              지정가
            </label>
          </td>
          <td className="radio">
            <input type="radio" name="radio" id="radio2" className="radio-input" onClick={() => (setBidSort('시장가'))} checked={bidSort === '시장가'}></input>
            <label className="radio-market radio-label" htmlFor="radio2">
              시장가
            </label>
          </td>
          <td className="radio">
            <input type="radio" name="radio" id="radio3" className="radio-input" onClick={() => (setBidSort('예약가'))} checked={bidSort === '예약가'}></input>
            <label className="radio-reserve radio-label" htmlFor="radio3">
              예약/지정가
            </label>
          </td>
        </tr>
      </table>
      {
        // 매도 - 지정가 영역
        bidSort === '지정가' ?
          <>
            <table className="trading-table">
              <tr>
                <td className="trading-category">주문가능</td>
                <td className="trading-availableTrade">
                  {
                    // 보유수량이 undefined 또는 null일 때 0 반환
                    ownedCrypto.find((item) => item.crypto_name === cr_name_selected)?.quantity ??
                    0
                  }
                  <span>{(cr_market_selected).slice(4)}</span>
                </td>
              </tr>
              <tr>
                <td className="trading-category">매도가격</td>
                <td className="td-input">
                  <input type="text"
                    value={sellingInputValue}
                    onChange={(e) => {
                      let value = e.target.value;

                      // 매도가격을 변경했음에도 매도 대기 여부가 true이면 의도치 않게 매도가 완료될 수 있으니, 매도가를 변경했을 때는 매도 대기 여부를 false로 처리
                      setIsSelling(false);

                      // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                      if (value[0] === '0' && value.length > 1) {
                        if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                          value = value.substring(1);
                        }
                      }

                      // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
                      value = value.replace(/(\..*)\./g, "$1");

                      // 숫자와 "." 외의 문자를 제거
                      value = value.replace(/[^0-9.]/g, "");

                      // "."이 맨 처음에 오지 않도록 함
                      if (value[0] === '.') {
                        value = '0' + value;
                      }

                      // value값이 비게 되면 '0'으로 설정(NaN값 방지)
                      if (value === '') {
                        value = '0';
                      }

                      dispatch(setSellingPrice(Number(value)));
                      setSellingInputValue(value);
                      setSellTotal(Math.floor(parseFloat(value) * sellQuantity));
                      setTotalInputvalue((Math.floor(parseFloat(value) * sellQuantity)).toString());
                    }}
                  />
                  <span>KRW</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} />
                </td>
              </tr>
              <tr>
                <td className="trading-category">주문수량</td>
                <td className="td-input">
                  <input type="text"
                    value={quantityInputValue}
                    onChange={(e) => {
                      let value = e.target.value;

                      // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                      if (value[0] === '0' && value.length > 1) {
                        if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                          value = value.substring(1);
                        }
                      }

                      // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
                      value = value.replace(/(\..*)\./g, "$1");

                      // 숫자와 "." 외의 문자를 제거
                      value = value.replace(/[^0-9.]/g, "");

                      // "."이 맨 처음에 오지 않도록 함
                      if (value[0] === '.') {
                        value = '0' + value;
                      }

                      // value값이 비게 되면 '0'으로 설정(NaN값 방지)
                      if (value === '') {
                        value = '0';
                      }

                      const decimalPart = (value.split('.')[1] || '').length;

                      // 소수점 자릿수가 8자리 이하인 경우만
                      if (decimalPart <= 8) {
                        setQuantityInputValue(value);
                        setSellQuantity(parseFloat(value));
                      }

                      setSellTotal(Math.floor(sellingPrice * parseFloat(value)))
                      setTotalInputvalue((Math.floor(sellingPrice * parseFloat(value))).toString())
                    }}
                  />
                  <span>
                    {
                      cr_selected && cr_selected.market ?
                        (cr_selected.market).slice(4) :
                        null
                    }</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td className="count-percentage">
                  <span className={
                    selectedPercentage === '10%' ?
                      'sell-percentage' :
                      'nonSelected-percentage'
                  } onClick={() => (selectPercentage('10%'))}>10%</span>
                  <span className={
                    selectedPercentage === '25%' ?
                      'sell-percentage' :
                      'nonSelected-percentage'
                  } onClick={() => (selectPercentage('25%'))}>25%</span>
                  <span className={
                    selectedPercentage === '50%' ?
                      'sell-percentage' :
                      'nonSelected-percentage'
                  } onClick={() => (selectPercentage('50%'))}>50%</span>
                  <span className={
                    selectedPercentage === '75%' ?
                      'sell-percentage' :
                      'nonSelected-percentage'
                  } onClick={() => (selectPercentage('75%'))}>75%</span>
                  <span className={
                    selectedPercentage === '100%' ?
                      'sell-percentage' :
                      'nonSelected-percentage'
                  } onClick={() => (selectPercentage('100%'))}>100%</span>
                </td>
              </tr>
              <tr>
                <td className="trading-category">주문총액</td>
                <td className="td-input">
                  <input type="text"
                    value={totalInputValue}
                    onChange={(e) => {
                      let value = e.target.value;

                      // 첫 번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                      if (value[0] === '0' && value.length > 1) {
                        if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                          value = value.substring(1);
                        }
                      }

                      // 입력값이 숫자인지 확인하고, 숫자 이외의 문자가 포함되어 있는지 확인
                      const isNumber = /^[0-9]*$/.test(value);

                      if (value === '') {
                        value = '0';
                      }

                      if (sellingInputValue !== '0') {

                        if (isNumber) {
                          setTotalInputvalue(value);
                          setSellTotal(parseFloat(value));

                          let dividiedQuantity = Number(value) / sellingPrice;

                          // 소수점 아래 8자리로 제한
                          if ((dividiedQuantity.toString().split('.')[1] || '').length > 8) {
                            dividiedQuantity = parseFloat(dividiedQuantity.toFixed(8));
                          }

                          setSellQuantity(dividiedQuantity);
                          setQuantityInputValue(dividiedQuantity.toString());
                        }
                      }

                    }}
                  />
                  <span>KRW</span>
                </td>
              </tr>
            </table>
            {
              logInEmail !== '' ?
                <div className="trading-submit-sell designate">
                  <span onClick={() => {
                    setIsSelling(true);

                    // 호가와 매도가가 일치하는지 확인
                    let item = asking_data.find(item => item.bid_price === sellingPrice);
                    if (item !== undefined) {
                      // 일치한다면 바로 매도 요청을 전송
                      sellCrypto(logInEmail, cr_selected.name, sellQuantity, sellTotal);
                      addTradeHistory(logInEmail, cr_selected.name, tradeCategory, time, cr_selected.market, sellingPrice, sellTotal, sellQuantity, true);
                    }
                    else {
                      // 일치하지 않는다면 대기 모달 팝업
                      toggleModal();
                      setModalOpen(!modalOpen);

                      addTradeHistory(logInEmail, cr_selected.name, tradeCategory, time, cr_selected.market, sellingPrice, sellTotal, sellQuantity, false);
                    }
                  }}>매도</span>
                </div> :
                <div className="trading-submit-nonLogIn-sell designate">
                  <span onClick={() => { navigate('/logIn') }}>로그인</span>
                  <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                </div>
            }
          </> :
          (
            // 매도 - 시장가 영역
            bidSort === '시장가' ?
              <>
                <table className="trading-table">
                  <tr>
                    <td className="trading-category">주문가능</td>
                    <td className="trading-availableTrade">
                      {
                        // 보유수량이 undefined 또는 null일 때 0 반환
                        ownedCrypto.find((item) => item.crypto_name === cr_name_selected)?.quantity ??
                        0
                      }
                      <span>
                        {
                          cr_selected && cr_selected.market ?
                            (cr_selected.market).slice(4) :
                            null
                        }
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">주문수량</td>
                    <td className="td-input">
                      <input type="text"
                        value={quantityInputValue}
                        onChange={(e) => {
                          let value = e.target.value;

                          // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                          if (value[0] === '0' && value.length > 1) {
                            if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                              value = value.substring(1);
                            }
                          }

                          // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
                          value = value.replace(/(\..*)\./g, "$1");

                          // 숫자와 "." 외의 문자를 제거
                          value = value.replace(/[^0-9.]/g, "");

                          // "."이 맨 처음에 오지 않도록 함
                          if (value[0] === '.') {
                            value = '0' + value;
                          }

                          // value값이 비게 되면 '0'으로 설정(NaN값 방지)
                          if (value === '') {
                            value = '0';
                          }

                          const decimalPart = (value.split('.')[1] || '').length;

                          // 소수점 자릿수가 8자리 이하인 경우만
                          if (decimalPart <= 8) {
                            setQuantityInputValue(value);
                            setSellQuantity(parseFloat(value));
                          }

                          setSellTotal(Math.floor(sellingPrice * parseFloat(value)))
                          setTotalInputvalue((Math.floor(sellingPrice * parseFloat(value))).toString())
                        }}
                      />
                      <span>
                        {
                          cr_selected && cr_selected.market ?
                            (cr_selected.market).slice(4) :
                            null
                        }
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="count-percentage">
                      <span className={
                        selectedPercentage === '10%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('10%'))}>10%</span>
                      <span className={
                        selectedPercentage === '25%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('25%'))}>25%</span>
                      <span className={
                        selectedPercentage === '50%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('50%'))}>50%</span>
                      <span className={
                        selectedPercentage === '75%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('75%'))}>75%</span>
                      <span className={
                        selectedPercentage === '100%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('100%'))}>100%</span>
                    </td>
                  </tr>
                </table>
                {
                  logInEmail !== '' ?
                    <div className="trading-submit-sell market">
                      <span onClick={
                        // 호가와의 일치 여부를 확인하지 않음
                        () => {
                          sellCrypto(logInEmail, cr_selected.name, sellQuantity, sellTotal)
                          addTradeHistory(logInEmail, cr_selected.name, tradeCategory, time, cr_selected.market, sellingPrice, sellTotal, sellQuantity, true);
                        }}>매도
                      </span>
                    </div> :
                    <div className="trading-submit-nonLogIn-sell market">
                      <span onClick={() => { navigate('/logIn') }}>로그인</span>
                      <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                    </div>
                }
              </> :
              // 매도 - 예약가 영역
              <>
                <table className="trading-table">
                  <tr>
                    <td className="trading-category">주문가능</td>
                    <td className="trading-availableTrade">0
                      <span>
                        {
                          cr_selected && cr_selected.market ?
                            (cr_selected.market).slice(4) :
                            null
                        }</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">감시가격</td>
                    <td className="td-input">
                      <input onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} value={sellingPrice}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} />
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">매도가격</td>
                    <td className="td-input">
                      <input onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} value={sellingPrice}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} />
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">주문수량</td>
                    <td className="td-input">
                      <input>
                      </input>
                      <span>
                        {
                          cr_selected && cr_selected.market ?
                            (cr_selected.market).slice(4) :
                            null
                        }</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="count-percentage">
                      <span className={
                        selectedPercentage === '10%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('10%'))}>10%</span>
                      <span className={
                        selectedPercentage === '25%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('25%'))}>25%</span>
                      <span className={
                        selectedPercentage === '50%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('50%'))}>50%</span>
                      <span className={
                        selectedPercentage === '75%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('75%'))}>75%</span>
                      <span className={
                        selectedPercentage === '100%' ?
                          'sell-percentage' :
                          'nonSelected-percentage'
                      } onClick={() => (selectPercentage('100%'))}>100%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">주문총액</td>
                    <td className="td-input">
                      <input>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                </table>
                {
                  logInEmail !== '' ?
                    <div className="trading-submit-sell reserve">
                      <span>예약매도</span>
                    </div> :
                    <div className="trading-submit-nonLogIn-sell reserve">
                      <span onClick={() => { navigate('/logIn') }}>로그인</span>
                      <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                    </div>
                }
              </>

          )
      }
    </>
  )
}

const TradeHistory = () => {

  const userTradeHistory = useSelector((state: RootState) => state.userTradeHistory)
  const userTradeHistory_unSigned = useSelector((state: RootState) => state.userTradeHistory_unSigned)

  const [historySort, setHistorySort] = useState<string>('체결');

  return (
    <>
      <table className="trading-headTable">
        <tbody>
          <tr className="trading-choice">
            <td className="radio">
              체결구분
            </td>
            <td className="radio">
              <input type="radio" name="radio" id="radio1" className="radio-input" onChange={() => (setHistorySort('체결'))} checked={historySort === '체결'}></input>
              <label className="radio-designate radio-label" htmlFor="radio1">
                체결
              </label>
            </td>
            <td className="radio">
              <input type="radio" name="radio" id="radio2" className="radio-input" onChange={() => (setHistorySort('미체결'))} checked={historySort === '미체결'}></input>
              <label className="radio-market radio-label" htmlFor="radio2">
                미체결
              </label>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table-tradingHistory">
        <colgroup>
          <col width={75} />
          <col width={75} />
          <col width={80} />
          <col width={85} />
        </colgroup>
        <thead>
          <tr>
            <th>주문시간</th>
            <th>
              <div>마켓</div>
              <div>구분</div>
            </th>
            <th>
              <div>체결가격</div>
              <div>체결금액</div>
            </th>
            <th>수량</th>
          </tr>
        </thead>
      </table>
      <SimpleBar className="scrollBar-tradingHistoryTable">
        <table className="table-tradingHistory">
          <colgroup>
            <col width={75} />
            <col width={75} />
            <col width={80} />
            <col width={85} />
          </colgroup>
          <tbody>
            {
              // 체결된 화폐들의 거래내역
              historySort === '체결' ?
                userTradeHistory.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        {(item.trade_time).slice(0, 10)} <br />
                        {(item.trade_time).slice(10)}
                      </td>
                      <td>
                        <span className="tradingHistory-market">
                          {item.crypto_market}
                        </span>
                        <br />
                        <span className={`tradingHistory-category ${item.trade_category === 'BUY' ? 'asking-buy' : 'asking-sell'}`}>

                          {
                            item.trade_category === 'BUY' ?
                              '매수' :
                              '매도'
                          }
                        </span>
                      </td>
                      <td>
                        {(item.crypto_price).toLocaleString()} <br />
                        {(Number(item.trade_price)).toLocaleString()}
                      </td>
                      <td>
                        {
                          (item.trade_amount).length <= 10 ?
                            item.trade_amount :
                            (
                              item.trade_amount[9] === '.' ?
                                (item.trade_amount).substring(0, 9) :
                                (item.trade_amount).substring(0, 10)
                            )
                        }
                      </td>
                    </tr>
                  )
                }) :
                // 체결되지 않은 화폐들의 거래내역
                userTradeHistory_unSigned !== undefined && Array.isArray(userTradeHistory_unSigned) ?
                  (
                    userTradeHistory_unSigned.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            {
                              item.trade_time !== undefined ?
                                (item.trade_time).slice(0, 10) :
                                null
                            }
                            <br />
                            {
                              item.trade_time !== undefined ?
                                (item.trade_time).slice(10) :
                                null
                            }
                          </td>
                          <td>
                            <span className="tradingHistory-market">
                              {
                                item.crypto_market !== undefined ?
                                  item.crypto_market :
                                  null
                              }
                            </span>
                            <br />
                            <span className={`tradingHistory-category ${item.trade_category === '매수' ? 'asking-buy' : 'asking-sell'}`}>

                              {
                                item.trade_category !== undefined ? (

                                  item.trade_category === '매수' ?
                                    '매수' :
                                    '매도'
                                ) :
                                  null
                              }
                            </span>
                          </td>
                          <td>
                            {
                              item.crypto_price !== undefined ?
                                (item.crypto_price).toLocaleString() :
                                null
                            }
                            <br />
                            {
                              item.trade_price !== undefined ?
                                (Number(item.trade_price)).toLocaleString() :
                                null
                            }
                          </td>
                          <td>
                            {
                              item.trade_amount !== undefined ?
                                (

                                  (String(item.trade_amount)).length <= 10 ?
                                    item.trade_amount :
                                    (
                                      String(item.trade_amount)[9] === '.' ?
                                        (String(item.trade_amount)).substring(0, 9) :
                                        (String(item.trade_amount)).substring(0, 10)
                                    )
                                ) :
                                null
                            }
                          </td>
                        </tr>
                      )
                    })
                  ) :
                  null
            }
          </tbody>
        </table>
      </SimpleBar>
    </>
  )
}

interface ModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  toggleModal: () => void;
}

interface CompleteModalProps {
  completeModalOpen: boolean;
  setCompleteModalOpen: (open: boolean) => void;
  completeToggleModal: () => void;
}

const useStyles = makeStyles({
  dialog: {
    '& .MuiDialog-paper': {
      width: '600px',
      height: '200px'
    },
    '& .MuiDialogTitle-root .MuiTypography-root': {
      marginTop: '10px',
      marginLeft: '10px',
      fontWeight: 'bold',
    },
    '& .MuiDialogContent-root': {
      marginTop: '-10px',
      marginLeft: '10px',
    },
    '& .MuiDialogActions-root': {
      marginBottom: '10px',
    },
    '& .MuiDialogActions-root .MuiButton-root': {
      fontWeight: 'bold',
      fontSize: '14.5px',
    }
  },
});

const ModalSumbit: React.FC<ModalProps> = ({ modalOpen, setModalOpen, toggleModal }) => {

  const classes = useStyles();
  const sectionChange = useSelector((state: RootState) => state.sectionChange);

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={toggleModal}>
        Open dialog
      </Button> */}
      <Dialog open={modalOpen} onClose={toggleModal} className={classes.dialog} maxWidth={false}>
        <DialogTitle>안내</DialogTitle>
        <DialogContent>
          {
            // JSX에서는 +등으로 문자열을 묶을 수 없으므로 하나의 배열로 반환
            sectionChange === '매수' ?
              ["매수 요청이 정상적으로 완료되었습니다.", <br key="buy" />,
                "요청하신 매수 가격과 일치하는 매수 요청이 발생하면 거래가 완료됩니다."] :
              ["매도 요청이 정상적으로 완료되었습니다.", <br key="sell" />,
                "요청하신 매도 가격과 일치하는 매도 요청이 발생하면 거래가 완료됩니다."]
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal} color="primary">확인</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const ModalComplete: React.FC<CompleteModalProps> = ({ completeModalOpen, setCompleteModalOpen, completeToggleModal }) => {

  const classes = useStyles();
  const sectionChange = useSelector((state: RootState) => state.sectionChange);

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={toggleModal}>
        Open dialog
      </Button> */}
      <Dialog open={completeModalOpen} onClose={completeToggleModal} className={classes.dialog} maxWidth={false}>
        <DialogTitle>안내</DialogTitle>
        <DialogContent>
          {
            sectionChange === '매수' ?
              "성공적으로 화폐를 매수했습니다." :
              "성공적으로 화폐를 매도했습니다."
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={completeToggleModal} color="primary">확인</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export { PriceDetail };