import { useSelector } from "react-redux";
import { RootState } from "../store";

function TradingDetail() {

  const cr_price_selected = useSelector((state: RootState) => { return state.cr_price_selected });
  const cr_change_selected = useSelector((state: RootState) => { return state.cr_change_selected });

  return (
    <article className="TradingDetail">
      <div className="trading-detail">

        {/* 삼항연산자 중첩 - 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
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
      </div>
    </article>
  );
}

// 반복적으로 사용되는 코드를 컴포넌트로 정리
// 화폐의 변화율에 따라 css 속성 다르게 적용
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