import { useDispatch, useSelector } from "react-redux";
import { RootState, setAsking_dateTime } from "../store";
import { useState } from "react";
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
            const percentage = (item.bid_size / asking_totalBidSize) * 100;
            return (
              <tr style={{ background: `linear-gradient(270deg, rgba(34,171,148, .2) ${percentage}%, transparent ${percentage}%)` }}>
                <td>{asking_dateTime}</td>
                <td>{(item.bid_price).toLocaleString()}</td>
                <td>{(item.bid_size).toFixed(5)}
                </td>
              </tr>
            )
          })
        }
        {
          asking_data.map((item, i) => {
            const percentage = (item.ask_size / asking_totalAskSize) * 100;
            return (
              <tr style={{ background: `linear-gradient(270deg, rgba(242,54,69, .2) ${percentage}%, transparent ${percentage}%)` }}>
                <td>{asking_dateTime}</td>
                <td>{(item.ask_price).toLocaleString()}</td>
                <td>{(item.ask_size).toFixed(5)}
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