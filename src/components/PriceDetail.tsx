import { useDispatch, useSelector } from "react-redux";
import { AskingData, RootState, setAsking_data, setAsking_dateTime, setBuyingCrypto, setBuyingPrice } from "../store";
import { SetStateAction, useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import axios from "axios";
import useFunction from "./useFuction";

const PriceDetail = () => {

  const [sectionChange, setSectionChange] = useState<string>('매수');

  return (
    <div className="lightMode">
      <div className="priceDetail-title askingTitle lightMode">호가내역</div>
      <AskingPrice />
      <div className="priceDetail-title closedTitle lightMode">체결내역</div>
      <ClosedPrice />
      <div className="trading-section lightMode-title">
        <span className={`${sectionChange === '매수' ?
          'buyingSection' :
          ''
          }`} onClick={() => (setSectionChange('매수'))}>매수</span>
        <span className={`${sectionChange === '매도' ?
          'sellingSection' :
          ''
          }`} onClick={() => (setSectionChange('매도'))}>매도</span>
        {/* <span className={`${sectionChange === '거래내역' ?
          'tradingHistorySection' :
          ''
          }`} onClick={() => (setSectionChange('거래내역'))}>거래내역</span> */}
      </div>
      {
        sectionChange === '매수' ?
          <BuyingSection /> :
          (
            sectionChange === '매도' ?
              <SellingSection /> :
              null
          )
      }
    </div>
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
                  <tr style={{ background: `linear-gradient(270deg, rgba(34,171,148, .2) ${percentage}%, transparent ${percentage}%)` }}>
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
                  <tr style={{ background: `linear-gradient(270deg, rgba(242,54,69, .2) ${percentage}%, transparent ${percentage}%)` }}>
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
                  <tr>
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

  const { getBalance, getOwnedCrypto } = useFunction();

  useEffect(() => {
    setBuyingInputValue(buyingPrice.toString())
  }, [buyingPrice])

  const buyCrypto = (email: string, cryptoName: string, cryptoQuantity: number, buyTotal: number) => {

    // 호가중에서 구매하려는 가격과 일치하는 값이 있는지 찾음
    let matchedItem = asking_data.find(item => item.ask_price === buyingPrice);
    console.log("매치여부 : ", matchedItem)

    // 일치하는 값이 있을 시에만 서버로 요청 전송
    if (matchedItem !== undefined) {
      (async (email, cryptoName, cryptoQuantity, buyTotal) => {
        try {
          const response = await axios.post("http://127.0.0.1:8000/buy_crypto/", {
            email: email,
            crypto_name: cryptoName,
            crypto_quantity: cryptoQuantity,
            buy_total: buyTotal,
          });
          console.log("구매 화폐 전송 성공", response.data)
          getBalance(logInEmail);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
          getOwnedCrypto(logInEmail);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
        }
        catch (error) {
          console.log("구매 화폐 전송 실패: ", error)
        }
      })(email, cryptoName, cryptoQuantity, buyTotal);
    }
  }

  const selectPercentage = (percentage: string) => {
    setSelectedPercentage(percentage)

    // 매수가격이 0이면 주문수량/주문총액은 의미가 없으므로 
    if (buyingInputValue !== '0') {

      // 현재 잔고 기준 퍼센테이지를 '주문총액'에 할당하고, 주문총액이 구매하려는 화폐 가격에 대해 어느 정도의 비율을 가지는지 계산
      if (percentage === '10%') {
        let dividedTotal = userWallet * 0.1;
        setBuyTotal(dividedTotal);
        setTotalInputvalue(dividedTotal.toString())
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
        console.log("값 : ", buyQuantity);
      }
      if (percentage === '25%') {
        let dividedTotal = userWallet * 0.25;
        setBuyTotal(dividedTotal);
        setTotalInputvalue(dividedTotal.toString())
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
        console.log("값 : ", buyQuantity);
      }
      if (percentage === '50%') {
        let dividedTotal = userWallet * 0.50;
        setBuyTotal(dividedTotal);
        setTotalInputvalue(dividedTotal.toString())
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
        console.log("값 : ", buyQuantity);
      }
      if (percentage === '75%') {
        let dividedTotal = userWallet * 0.75;
        setBuyTotal(dividedTotal);
        setTotalInputvalue(dividedTotal.toString())
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
        console.log("값 : ", buyQuantity);
      }
      if (percentage === '100%') {
        let dividedTotal = userWallet;
        setBuyTotal(dividedTotal);
        setTotalInputvalue(dividedTotal.toString())
        let dividedQuantity = dividedTotal / buyingPrice;

        // 소수점 아래 8자리로 제한
        if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
          dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
        }

        setBuyQuantity(dividedQuantity);
        setQuantityInputValue(dividedQuantity.toString());
        console.log("값 : ", buyQuantity);
      }

    }
  }

  return (
    <>
      <table className="trading-headTable">
        <tr className="trading-choice">
          <td className="radio">
            주문구분
          </td>
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
        // 매수 - 지정가 영역
        bidSort === '지정가' ?
          <>
            <table className="trading-table">
              <tr>
                <td className="trading-category">주문가능</td>
                <td className="trading-availableTrade">{userWallet}
                  <span>KRW</span>
                </td>
              </tr>
              <tr>
                <td className="trading-category">매수가격</td>
                <td className="td-input">
                  <input type="text" onChange={(e) => {
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

                    dispatch(setBuyingPrice(Number(value)));
                    setBuyingInputValue(value);
                    setBuyTotal(Math.floor(parseFloat(value) * buyQuantity));
                    setTotalInputvalue((Math.floor(parseFloat(value) * buyQuantity)).toString());

                  }} value={buyingInputValue}>
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
                      setBuyTotal(Math.floor(buyingPrice * parseFloat(value)))
                      setTotalInputvalue((Math.floor(buyingPrice * parseFloat(value))).toString())
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
                  <input type="text" value={totalInputValue} onChange={(e) => {
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
            </table>
            {
              logInEmail !== '' ?
                <div className="trading-submit-buy designate">
                  <span onClick={() => buyCrypto(logInEmail, cr_selected.name, buyQuantity, buyTotal)}>매수</span>
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
                    <td className="trading-availableTrade">{userWallet}
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
                      <span>매수</span>
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

  const navigate = useNavigate();

  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [selectedPercentage, setSelectedPercentage] = useState<string>('');
  const [bidSort, setBidSort] = useState<string>('지정가');

  const cr_selected = useSelector((state: RootState) => state.cr_selected);
  const logInEmail = useSelector((state: RootState) => state.logInEmail);

  const buyingPriceChange = (event: { target: { value: SetStateAction<number>; }; }) => {
    setSellingPrice(event.target.value)
  }

  const selectPercentage = (percentage: string) => {
    setSelectedPercentage(percentage)
  }

  return (
    <>
      <table className="trading-headTable">
        <tr className="trading-choice">
          <td className="radio">
            주문구분
          </td>
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
                <td className="trading-availableTrade">0
                  <span>BTC</span>
                </td>
              </tr>
              <tr>
                <td className="trading-category">매도가격</td>
                <td className="td-input">
                  <input onChange={(e) => setSellingPrice(Number(e.target.value))} value={sellingPrice}>
                  </input>
                  <span>KRW</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => setSellingPrice(Number(e.target.value))} />
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
                <div className="trading-submit-sell designate">
                  <span>매도</span>
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
                    <td className="trading-availableTrade">0
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
                      <input>
                      </input>
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
                      <span>매도</span>
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
                      <input onChange={(e) => setSellingPrice(Number(e.target.value))} value={sellingPrice}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => setSellingPrice(Number(e.target.value))} />
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">매도가격</td>
                    <td className="td-input">
                      <input onChange={(e) => setSellingPrice(Number(e.target.value))} value={sellingPrice}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => setSellingPrice(Number(e.target.value))} />
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

export { PriceDetail };