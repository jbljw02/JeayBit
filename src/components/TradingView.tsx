import { useState } from "react";
import { CryptoList } from "./CryptoList";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import price_rise from '../assets/images/price-up.png'
import price_fall from '../assets/images/price-down.png'

function TradingView() {

  const [checkedValue, setCheckedValue] = useState<string>("1일")

  // 테이블에서 선택된 화폐의 이름, 마켓, 가격을 가져옴
  const cr_names_selected = useSelector((state: RootState) => { return state.cr_names_selected });  
  const cr_markets_selected = useSelector((state: RootState) => { return state.cr_markets_selected });
  const cr_price_selected = useSelector((state: RootState) => { return state.cr_price_selected });
  const cr_trade_price = useSelector((state: RootState) => { return state.cr_trade_price });
  const cr_trade_volume = useSelector((state: RootState) => { return state.cr_trade_volume });
  const cr_open_price = useSelector((state: RootState) => { return state.cr_open_price });
  const cr_high_price = useSelector((state: RootState) => { return state.cr_high_price });
  const cr_low_price = useSelector((state: RootState) => { return state.cr_low_price });
  const cr_change_selected = useSelector((state: RootState) => { return state.cr_change_selected });
  const cr_change_price_selected = useSelector((state: RootState) => { return state.cr_change_price_selected });
  const cr_trade_price_selected = useSelector((state: RootState) => { return state.cr_trade_price_selected });
  const cr_trade_volume_selected = useSelector((state: RootState) => { return state.cr_trade_volume_selected });
  const cr_open_price_selected = useSelector((state: RootState) => { return state.cr_open_price_selected });
  const cr_high_price_selected = useSelector((state: RootState) => { return state.cr_high_price_selected });
  const cr_low_price_selected = useSelector((state: RootState) => { return state.cr_low_price_selected });

  const checkClick = (value: string) => {
    setCheckedValue(value)
  }

  return (
      <>
        <div className="crypto-name">
        {/* src 내부에 동적으로 state를 넣기 위해선 `(햅틱) 사용 */}
        <img className="crypto-img" src={`https://static.upbit.com/logos/${cr_markets_selected.slice(4)}.png`}></img>
          {cr_names_selected}
          <span className="crypto-market">
            {cr_markets_selected}
          </span>
        </div>
      <div className="trading-detail">
        {/* 삼항연산자 중첩 - 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
        {/* 선택된 화폐의 가격과 변화율 */}
        {
          cr_change_selected === 'RISE' ?
            <div className="crypto-price-rise">
              {cr_price_selected}
              <Crypto_changeRate_selected></Crypto_changeRate_selected>
              <Crypto_detail></Crypto_detail>
            </div> :
            (
              cr_change_selected === 'FALL' ?
                <div className="crypto-price-fall">
                  {cr_price_selected}
                  <Crypto_changeRate_selected></Crypto_changeRate_selected>
                  <Crypto_detail></Crypto_detail>
                </div> :
                <div className="crypto-price-even">
                  {cr_price_selected}
                  <Crypto_changeRate_selected></Crypto_changeRate_selected>
                  <Crypto_detail></Crypto_detail>
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
      </div>
      <div className="trading-header">
        {/* 드롭다운 라벨 */}
        <label className="dropDown">
          <div className="dd-button">
            {checkedValue}
            <svg className="img-dd" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 16 8">
              <path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path>
            </svg>
          </div>
          <input type="checkbox" className="dd-input" />
          <ul className="dd-menu">
            <li onClick={(e) => checkClick('1분')}>1분</li>
            <li onClick={(e) => checkClick('3분')}>3분</li>
            <li onClick={(e) => checkClick('5분')}>5분</li>
            <li onClick={(e) => checkClick('10분')}>10분</li>
            <li onClick={(e) => checkClick('15분')}>15분</li>
            <li onClick={(e) => checkClick('30분')}>30분</li>
            <li onClick={(e) => checkClick('1시간')}>1시간</li>
            <li onClick={(e) => checkClick('4시간')}>4시간</li>
          </ul>
        </label>
      </div>
      <div className="trading-chart"></div>
    </
    >
  );
}

{/* 화폐의 변화율에 따라 css 속성 다르게 적용 */ }
function Crypto_changeRate_selected() {

  const cr_change_selected = useSelector((state: RootState) => { return state.cr_change_selected });
  const cr_change_rate_selected = useSelector((state: RootState) => { return state.cr_change_rate_selected });

  return (
    <>
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
    </>
  );
}

{/* 24시간동안의 화폐의 상세정보 */ }
function Crypto_detail() {

  const cr_markets_selected = useSelector((state: RootState) => { return state.cr_markets_selected });
  const cr_price_selected = useSelector((state: RootState) => { return state.cr_price_selected });
  const cr_trade_price_selected = useSelector((state: RootState) => { return state.cr_trade_price_selected });
  const cr_trade_volume_selected = useSelector((state: RootState) => { return state.cr_trade_volume_selected });
  const cr_open_price_selected = useSelector((state: RootState) => { return state.cr_open_price_selected });
  const cr_high_price_selected = useSelector((state: RootState) => { return state.cr_high_price_selected });
  const cr_low_price_selected = useSelector((state: RootState) => { return state.cr_low_price_selected });

  return (
    <>
      <dl className="selectedDetail_dl_1">
        <dt>
          거래대금
          <dd>
            {cr_trade_price_selected}
            <span>
              &nbsp;KRW
            </span>
          </dd>
        </dt>
        <dt>
          종가
          <dd>
            {cr_price_selected}
          </dd>
        </dt>
        <dt>
          고가
          <dd>
            <span className="dd-high_price">
              {cr_high_price_selected.toLocaleString()}
            </span>
          </dd>
        </dt>
      </dl><dl className="selectedDetail_dl_2">
        <dt>
          거래량
          <dd>
            {cr_trade_volume_selected}
            <span>
              &nbsp;{cr_markets_selected.slice(4)}
            </span>
          </dd>
        </dt>
        <dt>
          시가
          <dd>
            {cr_open_price_selected.toLocaleString()}
          </dd>
        </dt>
        <dt>
          저가
          <dd>
            <span className="dd-low_price">
              {cr_low_price_selected.toLocaleString()}
            </span>
          </dd>
        </dt>
      </dl>
    </>

  )
}

export { TradingView };