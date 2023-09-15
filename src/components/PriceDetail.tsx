import { useDispatch, useSelector } from "react-redux";
import { RootState, setAsking_dateTime } from "../store";
import { useState } from "react";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const PriceDetail = () => {

  const [changeTitle, setChangeTitle] = useState<boolean>(true);

  const changeTo_closedPrice = () => {
    if (!changeTitle) {
      setChangeTitle(true);
    }
  }

  const changeTo_askingPrice = () => {
    if (changeTitle) {
      setChangeTitle(false);
    }
  }

  return (
    <>
      <div className="priceDetail-title">호가내역</div>
      <AskingPrice />
      <div className="priceDetail-title">체결내역</div>
      <ClosedPrice />
    </>
  );
}

const AskingPrice = () => {

  const dispatch = useDispatch();

  const asking_data = useSelector((state: RootState) => state.asking_data);
  const cr_markets_selected = useSelector((state: RootState) => state.cr_markets_selected);
  const asking_dateTime = useSelector((state: RootState) => state.asking_dateTime);

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
    <table className="askingPrice-table">
      <thead>
        <tr>
          <th>등록시간</th>
          <th>호가</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        {
          asking_data.map((item, i) => {
            return (
              <tr>
                <td>{asking_dateTime}</td>
                <td>{(item.bid_price).toLocaleString()}</td>
                <td>{(item.bid_size).toFixed(3)}
                  <span>{(cr_markets_selected).slice(4)}</span>
                </td>
              </tr>
            )
          })
        }
        {
          asking_data.map((item, i) => {
            return (
              <tr>
                <td>{asking_dateTime}</td>
                <td>{(item.bid_price).toLocaleString()}</td>
                <td>{(item.bid_size).toFixed(3)}
                  <span>{(cr_markets_selected).slice(4)}</span>
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
  const cr_markets_selected = useSelector((state: RootState) => state.cr_markets_selected);
  return (
    <>
      {/* 스크롤바를 넣기 위해 테이블을 두 개로 구성 */}
      <table className="closedPrice-table">
        <thead>
          <tr>
            <th>체결시간</th>
            <th>체결가격</th>
            <th>체결량</th>
          </tr>
        </thead>
      </table>
      <table className="closedPrice-table">
        <SimpleBar className="scrollBar-closedPriceTable">
          <tbody>
            {
              closed_data.map((item, i) => {
                return (
                  <tr>
                    <td>{((item.trade_date_utc).slice(5)).replace("-", "/")} {String(item.trade_time_utc).slice(0, 5)}</td>
                    <td>{(item.trade_price).toLocaleString()}</td>
                    <td>{(item.trade_volume).toFixed(3)}
                      <span>{(cr_markets_selected).slice(4)}</span>
                    </td>
                  </tr>
                )
              }
              )
            }
          </tbody>
        </SimpleBar>
      </table>
    </>
  )
}



export { PriceDetail };