import { useDispatch, useSelector } from "react-redux";
import { AskingData, RootState, setAsking_data, setAsking_dateTime } from "../store";
import { SetStateAction, useEffect, useState } from "react";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

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

  const [buyingPrice, setBuyingPrice] = useState<number>(0);
  const [selectedPercentage, setSelectedPercentage] = useState<string>('');
  const [bidSort, setBidSort] = useState<string>('지정가');

  const buyingPriceChange = (event: { target: { value: SetStateAction<number>; }; }) => {
    setBuyingPrice(event.target.value)
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
        // 매수 - 지정가 영역
        bidSort === '지정가' ?
          <>
            <table className="trading-table">
              <tr>
                <td className="trading-category">주문가능</td>
                <td className="trading-availableTrade">0
                  <span>KRW</span>
                </td>
              </tr>
              <tr>
                <td className="trading-category">매수가격</td>
                <td className="td-input">
                  <input onChange={(e) => setBuyingPrice(Number(e.target.value))} value={buyingPrice}>
                  </input>
                  <span>KRW</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => setBuyingPrice(Number(e.target.value))} />
                </td>
              </tr>
              <tr>
                <td className="trading-category">주문수량</td>
                <td className="td-input">
                  <input>
                  </input>
                  <span>BTC</span>
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
            <div className="trading-submit-buy designate">
              <span>매수</span>
            </div>
          </> :
          (
            // 매수 - 시장가 영역
            bidSort === '시장가' ?
              <>
                <table className="trading-table">
                  <tr>
                    <td className="trading-category">주문가능</td>
                    <td className="trading-availableTrade">0
                      <span>KRW</span>
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
                <div className="trading-submit-buy market">
                  <span>매수</span>
                </div>
              </> :
              // 매수 - 예약가 영역
              <>
                <table className="trading-table">
                  <tr>
                    <td className="trading-category">주문가능</td>
                    <td className="trading-availableTrade">0
                      <span>KRW</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="trading-category">감시가격</td>
                    <td className="td-input">
                      <input onChange={(e) => setBuyingPrice(Number(e.target.value))} value={buyingPrice}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => setBuyingPrice(Number(e.target.value))} />
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">매수가격</td>
                    <td className="td-input">
                      <input onChange={(e) => setBuyingPrice(Number(e.target.value))} value={buyingPrice}>
                      </input>
                      <span>KRW</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => setBuyingPrice(Number(e.target.value))} />
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">주문수량</td>
                    <td className="td-input">
                      <input>
                      </input>
                      <span>BTC</span>
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
                <div className="trading-submit-buy reserve">
                  <span>예약매수</span>
                </div>
              </>
          )
      }
    </>
  )
}

const SellingSection = () => {

  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [selectedPercentage, setSelectedPercentage] = useState<string>('');
  const [bidSort, setBidSort] = useState<string>('지정가');

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
                  <span>BTC</span>
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
            <div className="trading-submit-sell designate">
              <span>매도</span>
            </div>
          </> :
          (
            // 매도 - 시장가 영역
            bidSort === '시장가' ?
              <>
                <table className="trading-table">
                  <tr>
                    <td className="trading-category">주문가능</td>
                    <td className="trading-availableTrade">0
                      <span>BTC</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="trading-category">주문수량</td>
                    <td className="td-input">
                      <input>
                      </input>
                      <span>BTC</span>
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
                <div className="trading-submit-sell market">
                  <span>매도</span>
                </div>
              </> :
              // 매도 - 예약가 영역
              <>
                <table className="trading-table">
                  <tr>
                    <td className="trading-category">주문가능</td>
                    <td className="trading-availableTrade">0
                      <span>BTC</span>
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
                      <span>BTC</span>
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
                <div className="trading-submit-sell reserve">
                  <span>예약매도</span>
                </div>
              </>

          )
      }
    </>
  )
}

export { PriceDetail };