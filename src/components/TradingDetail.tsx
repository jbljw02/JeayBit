import { useSelector } from "react-redux";
import { RootState } from "../store";
import price_rise from '../assets/images/price-up.png'
import price_fall from '../assets/images/price-down.png'

function TradingDetail() {

  const cr_trade_price = useSelector((state: RootState) => { return state.cr_trade_price });
  const cr_trade_volume = useSelector((state: RootState) => { return state.cr_trade_volume });
  const cr_open_price = useSelector((state: RootState) => { return state.cr_open_price });
  const cr_high_price = useSelector((state: RootState) => { return state.cr_high_price });
  const cr_low_price = useSelector((state: RootState) => { return state.cr_low_price });
  const cr_price_selected = useSelector((state: RootState) => { return state.cr_price_selected });
  const cr_markets_selected = useSelector((state: RootState) => { return state.cr_markets_selected });
  const cr_change_selected = useSelector((state: RootState) => { return state.cr_change_selected });
  const cr_change_price_selected = useSelector((state: RootState) => { return state.cr_change_price_selected });   
  const cr_trade_price_selected = useSelector((state: RootState) => { return state.cr_trade_price_selected });
  const cr_trade_volume_selected = useSelector((state: RootState) => { return state.cr_trade_volume_selected });
  const cr_open_price_selected = useSelector((state: RootState) => { return state.cr_open_price_selected });
  const cr_high_price_selected = useSelector((state: RootState) => { return state.cr_high_price_selected });
  const cr_low_price_selected = useSelector((state: RootState) => { return state.cr_low_price_selected });

  return (
    <article className="TradingDetail">
      <div className="trading-detail">

        {/* 삼항연산자 중첩 - 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
        {/* 선택된 화폐의 가격과 변화율 */}
        {
          cr_change_selected === 'RISE' ?
            <div className="crypto-price-rise">
              {cr_price_selected}
              <Crypto_changeRate_selected></Crypto_changeRate_selected>
            </div> :
            (
              cr_change_selected === 'FALL' ?
                <div className="crypto-price-fall">
                  {cr_price_selected}
                  <Crypto_changeRate_selected></Crypto_changeRate_selected>
                </div> :
                <div className="crypto-price-even">
                  {cr_price_selected}
                  <Crypto_changeRate_selected></Crypto_changeRate_selected>
                </div>
            )
        }
        {/* 선택된 화폐의 변화가격 */}
        {
          cr_change_selected === 'RISE' ?
            <div className="crypto-change_price-rise">
              <img className="img-price_rise" src={price_rise} /> {cr_change_price_selected}
            </div> :
            (
              cr_change_selected === 'FALL' ?
                <div className="crypto-change_price-fall">
                  <img className="img-price_fall" src={price_fall} /> {cr_change_price_selected}
                </div> :
                <div className="crypto-change_price-even">
                  {cr_change_price_selected}
                </div>
            )
        }
        <table className="table-selectedDetail">
          <tbody>
          <tr>
            <td>
                거래대금 : {cr_trade_price_selected}KRW
            </td>
            <td>
                거래량 : {cr_trade_volume_selected}{cr_markets_selected.slice(4,7)}
            </td>
          </tr>
          <tr>
            <td>
                시가 : {cr_open_price_selected}
            </td>
            <td>
                종가 : {cr_high_price_selected}
            </td>
          </tr>
          <tr>
            <td>
                고가 : {cr_high_price_selected}
            </td>
            <td>
                저가 : {cr_low_price_selected}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
}

// 반복적으로 사용되는 코드를 컴포넌트로 정리 - 화폐의 변화율에 따라 css 속성 다르게 적용
function Crypto_changeRate_selected() {
  const cr_change_selected = useSelector((state: RootState) => { return state.cr_change_selected });
  const cr_change_rate_selected = useSelector((state: RootState) => { return state.cr_change_rate_selected });
  return (
    <span>
      {
        cr_change_selected === 'RISE' ?
          <span className="crypto-change_rate-rise">
            &nbsp; +{cr_change_rate_selected}%
          </span> :
          (
            cr_change_selected === 'FALL' ?
              <span className="crypto-change_rate-fall">
                &nbsp; -{cr_change_rate_selected}%
              </span> :
              <span className="crypto-change_rate-even">
                &nbsp; {cr_change_rate_selected}%
              </span>
          )
      }
    </span>
  );
}

export { TradingDetail };