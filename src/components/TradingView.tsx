import { useState } from "react";
import { CryptoList } from "./CryptoList";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function TradingView() {

  const [checkedValue, setCheckedValue] = useState<string>("1일")

  // 테이블에서 선택된 화폐의 이름, 마켓, 가격을 가져옴
  const cr_names_selected = useSelector((state: RootState) => { return state.cr_names_selected });  
  const cr_markets_selected = useSelector((state: RootState) => { return state.cr_markets_selected });
  const cr_price_selected = useSelector((state: RootState) => { return state.cr_price_selected });

  const checkClick = (value: string) => {
    setCheckedValue(value)
  }

  return (
    <article className="TradingView">
      <div className="trading-view">
        <div className="crypto-name">
          {cr_names_selected}
          <span className="crypto-market">
            {cr_markets_selected}
          </span>
        </div>
        <div className="div-tradingView">
          <div className="trading-header">
            
            {/* 드롭다운 라벨 */}
            <label className="dropdown">
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
        </div>
      </div>
    </article>
  );
}

export { TradingView };