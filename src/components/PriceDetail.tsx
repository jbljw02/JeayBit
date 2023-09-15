import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";

const PriceDetail = () => {

  const [changeTitle, setChangeTitle] = useState<boolean>(true);

  const changeTo_closedPrice = () => {
    if(!changeTitle) {
      setChangeTitle(true);
    }
  }

  const changeTo_askingPrice =() => {
    if(changeTitle) {
      setChangeTitle(false);
    }
  }

  return (
    <>
      <div className="priceDetail-title">
        <span onClick={() => changeTo_closedPrice()} className="askingPrice-title">호가내역</span>
        <span onClick={() => changeTo_askingPrice()} className="closedPrice-title">체결내역</span>
      </div>
      {
        changeTitle === true ?
        <AskingPrice /> :
        <ClosedPrice />
      }
    </>
  );
}

const ClosedPrice = () => {
  const closed_data = useSelector((state: RootState) => state.closed_data);
  const cr_markets_selected = useSelector((state: RootState) => state.cr_markets_selected);
  return (
    <table className="closedPrice-table">
      <thead>
        <tr>
          <th>체결시간</th>
          <th>체결가격</th>
          <th>체결량</th>
        </tr>
      </thead>
      <tbody>
        {
          closed_data.map((item, i) => {
            return (
              <tr>
                <td>{String(item.trade_time_utc).slice(0, 5)}</td>
                <td>{(item.trade_price).toLocaleString()}</td>
                <td>{item.trade_volume}
                  <span>{(cr_markets_selected).slice(4)}</span>
                </td>
              </tr>
            )
          }
          )
        }
      </tbody>
      <tbody>

      </tbody>
    </table>
  )
}

const AskingPrice = () => {

  const asking_data = useSelector((state: RootState) => state.asking_data);

  return (
    <table className="askingPrice-table">
      <thead>
        <tr>
          <th>호가</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        {
          asking_data.map((item, i) => {
            return (
              <tr>
                <td>{item.bid_price}</td>
                <td>{item.bid_size}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

export { PriceDetail };