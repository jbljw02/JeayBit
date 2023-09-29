import { useDispatch, useSelector } from "react-redux";
import { AskingData, RootState, setAsking_data, setAsking_dateTime } from "../store";
import { useEffect, useState } from "react";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const PriceDetail = () => {
  return (
    <div className="lightMode">
      <div className="priceDetail-title lightMode">호가내역</div>
      <AskingPrice />
      <div className="priceDetail-title lightMode">체결내역</div>
      <ClosedPrice />
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

  // console.log("에스크 : ", differences_ask)
  // console.log("비드 : ", differences_bid)

  useEffect(() => {

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

  // console.log("호가 : ", asking_data);

  return (
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
      <tbody>
        {
          asking_data.map((item, i) => {
            // 이전 호가와 현재 호가를 비교한 값을 이용 - 변경된 호가가 현재 state를 순회하면서 일치하는 값에 대해서 스타일 지정
            let isChanged_bid = differences_bid.some((value, index) => {
              return value.new_bid_size === item.bid_size;
            })
            // console.log("비드결과 : ", isChanged_bid)
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
  )
}

const ClosedPrice = () => {
  const closed_data = useSelector((state: RootState) => state.closed_data);
  const cr_markets_selected = useSelector((state: RootState) => state.cr_market_selected);

  return (
    <>
      {/* 스크롤바를 넣기 위해 테이블을 두 개로 구성 */}
      <table className="closedPrice-table lightMode-title">
        <thead>
          <tr>
            <th>체결시간</th>
            <th>체결가격</th>
            <th>
              체결량<span>({(cr_markets_selected).slice(4)})</span>
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

export { PriceDetail };