import { useDispatch, useSelector } from "react-redux";
import { RootState, setChartSortDate, setChartSortTime, setSelectedChartSort } from "../store";
import price_rise from '../assets/images/price-up.png'
import price_fall from '../assets/images/price-down.png'
import { Chart } from "./TradingChart";

const TradingView = () => {

  const delimitedTime = useSelector((state: RootState) => state.delimitedTime);
  const delimitedDate = useSelector((state: RootState) => state.delimitedDate);
  const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
  const cr_selected = useSelector((state: RootState) => state.cr_selected);

  const dispatch = useDispatch();

  const setChartSortValue = (value: string) => {
    dispatch(setSelectedChartSort(value));
  }

  const clickChartSortTime = (value: string) => {
    dispatch(setChartSortTime(value));
    // dispatch(setChartSortDate(''))
  }

  const clickChartSortDate = (value: string) => {
    dispatch(setChartSortDate(value));
    dispatch(setChartSortTime(''))
  }

  return (
    <>
      <div className="crypto-name lightMode-title">
        {/* src 내부에 동적으로 state를 넣기 위해선 `(햅틱) 사용 */}
        <img className="crypto-img" src={
          cr_selected && cr_selected.market ?
            (
              Array.isArray(cr_selected.market) ?
                `https://static.upbit.com/logos/${(cr_selected.market[0]).slice(4)}.png` :
                `https://static.upbit.com/logos/${(cr_selected.market).slice(4)}.png`) : undefined
        } alt="화폐사진">
        </img>
        {/* 화폐 이름 */}
        {
          cr_selected && cr_selected.name ?
            (
              Array.isArray(cr_selected.name) ?
                cr_selected.name[0] :
                cr_selected.name
            ) : undefined
        }
        <span className="crypto-market lightMode">
          {/* 마켓 이름 */}
          {
            cr_selected && cr_selected.market ?
              (
                Array.isArray(cr_selected.market) ?
                  cr_selected.market[0] :
                  cr_selected.market
              ) : undefined
          }
        </span>
      </div>
      <div className="trading-detail lightMode">
        {/* 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
        {/* 선택된 화폐의 가격과 변화율 및 24시간 동안의 상세정보 */}
        {
          cr_selected && cr_selected.change ?
            (
              Array.isArray(cr_selected.price) ?
                (
                  cr_selected.change[0] === 'RISE' ?
                    <div className="crypto-price-rise">
                      {
                        (cr_selected.price[0]).toLocaleString()
                      }
                      <CryptoChangeRateSelected></CryptoChangeRateSelected>
                      <CryptoDetail></CryptoDetail>
                    </div> :
                    (
                      cr_selected.change[0] === 'FALL' ?
                        <div className="crypto-price-fall">
                          {
                            (cr_selected.price[0]).toLocaleString()
                          }
                          <CryptoChangeRateSelected></CryptoChangeRateSelected>
                          <CryptoDetail></CryptoDetail>
                        </div> :
                        <div className="crypto-price-even">
                          {
                            (cr_selected.price[0]).toLocaleString()
                          }
                          <CryptoChangeRateSelected></CryptoChangeRateSelected>
                          <CryptoDetail></CryptoDetail>
                        </div>
                    )

                ) :
                (
                  cr_selected.change === 'RISE' ?
                    <div className="crypto-price-rise">
                      {
                        (cr_selected.price).toLocaleString()
                      }
                      <CryptoChangeRateSelected></CryptoChangeRateSelected>
                      <CryptoDetail></CryptoDetail>
                    </div> :
                    (
                      cr_selected.change === 'FALL' ?
                        <div className="crypto-price-fall">
                          {
                            (cr_selected.price).toLocaleString()
                          }
                          <CryptoChangeRateSelected></CryptoChangeRateSelected>
                          <CryptoDetail></CryptoDetail>
                        </div> :
                        <div className="crypto-price-even">
                          {
                            (cr_selected.price).toLocaleString()
                          }
                          <CryptoChangeRateSelected></CryptoChangeRateSelected>
                          <CryptoDetail></CryptoDetail>
                        </div>
                    )
                )
            ) : null
        }
        {/* 선택된 화폐의 변화가격 */}
        {
          cr_selected && cr_selected.change_price !== undefined ?
            (
              Array.isArray(cr_selected.change_price) ?
                (
                  cr_selected.change[0] === 'RISE' ?
                    <div className="crypto-change_price-rise">
                      <img className="img-price_rise" src={price_rise} alt="상승" />
                      {
                        (cr_selected.change_price[0]).toLocaleString()
                      }
                    </div> :
                    (
                      cr_selected.change[0] === 'FALL' ?
                        <div className="crypto-change_price-fall">
                          <img className="img-price_fall" src={price_fall} alt="하락" />
                          {
                            (cr_selected.change_price[0]).toLocaleString()
                          }
                        </div> :
                        <div className="crypto-change_price-even">
                          {
                            (cr_selected.change_price[0]).toLocaleString()
                          }
                        </div>
                    )
                ) :
                (
                  cr_selected.change === 'RISE' ?
                    <div className="crypto-change_price-rise">
                      <img className="img-price_rise" src={price_rise} alt="상승" />
                      {
                        (cr_selected.change_price).toLocaleString()
                      }
                    </div> :
                    (
                      cr_selected.change === 'FALL' ?
                        <div className="crypto-change_price-fall">
                          <img className="img-price_fall" src={price_fall} alt="하락" />
                          {
                            (cr_selected.change_price).toLocaleString()
                          }
                        </div> :
                        <div className="crypto-change_price-even">
                          {
                            (cr_selected.change_price).toLocaleString()
                          }
                        </div>
                    )
                )
            ) : null
        }
      </div>
      <div className="trading-header lightMode">
        <table className="table-delimited">
          <tbody>
            <tr className="tr-delimited">
              {
                delimitedTime.map((item, i) => {
                  return (
                    <td
                      key={i}
                      onClick={() => clickChartSortTime(item)}
                      className={`"td-delimited" ${chartSortTime === item ? 'td-delimited-selected' : 'td-delimited'}`}>{item}</td>
                  )
                })
              }
              <label className="dropDown">
                {
                  chartSortTime === '' ?
                    <span className="chartSortDate-selected">{chartSortDate}</span> :
                    <span onClick={() => clickChartSortDate(chartSortDate)} className="chartSortDate">{chartSortDate}</span>
                }
                <span className="dd-button">
                  <svg className="img-dd" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 16 8">
                    <path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path>
                  </svg>
                </span>
                <input type="checkbox" className="dd-input" />
                <ul className="dd-menu lightMode">
                  {
                    delimitedDate.map((item, i) => {
                      return (
                        item === chartSortDate && chartSortTime === '' ?
                          <li
                            key={i}
                            onClick={() => {
                              clickChartSortDate(item)
                              setChartSortValue(item)
                            }} className="dd-menu-li">{item}</li> :
                          <li
                            key={i}
                            onClick={() => {
                              clickChartSortDate(item)
                              setChartSortValue(item)
                            }}>{item}</li>
                      )
                    })
                  }
                </ul>
              </label>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="trading-chart">
        <Chart />
      </div>
    </>
  );
}

/* 화폐의 변화율에 따라 css 속성 다르게 적용 */ 
const CryptoChangeRateSelected = () => {
  
  const cr_selected = useSelector((state: RootState) => state.cr_selected);

  return (
    <>
      {
        cr_selected && cr_selected.change_rate !== undefined ?
          (
            Array.isArray(cr_selected.change_rate) ?
              (
                cr_selected.change[0] === 'RISE' ?
                  <span className="crypto-change_rate-rise">
                    &nbsp; +
                    {
                      ((cr_selected.change_rate[0]) * 100).toFixed(2)
                    }
                    %
                  </span> :
                  (
                    cr_selected.change[0] === 'FALL' ?
                      <span className="crypto-change_rate-fall">
                        &nbsp; +
                        {
                          ((cr_selected.change_rate[0]) * 100).toFixed(2)
                        }
                        %
                      </span> :
                      <span className="crypto-change_rate-even">
                        &nbsp; +
                        {
                          cr_selected.change_rate[0]
                        }
                        .00%
                      </span>
                  )
              ) :
              (
                cr_selected.change === 'RISE' ?
                  <span className="crypto-change_rate-rise">
                    &nbsp; +
                    {
                      ((cr_selected.change_rate) * 100).toFixed(2)
                    }
                    %
                  </span> :
                  (
                    cr_selected.change === 'FALL' ?
                      <span className="crypto-change_rate-fall">
                        &nbsp; +
                        {
                          ((cr_selected.change_rate) * 100).toFixed(2)
                        }
                        %
                      </span> :
                      <span className="crypto-change_rate-even">
                        &nbsp; +
                        {
                          cr_selected.change_rate
                        }
                        .00%
                      </span>
                  )
              )
          ) : null
      }
    </>
  );
}

/* 24시간동안의 화폐의 상세정보 */
const CryptoDetail = () => {

  const cr_selected = useSelector((state: RootState) => state.cr_selected);

  return (
    <>
      <dl className="selectedDetail_dl_1 lightMode">
        <dt className="lightMode">
          거래대금
          <dd className="lightMode-title">
            {
              cr_selected && cr_selected.trade_price ?
                (
                  Array.isArray(cr_selected.trade_price) ?
                    (Number(String(Math.floor(cr_selected.trade_price[0])))).toLocaleString() :
                    (Number(String(Math.floor(cr_selected.trade_price)))).toLocaleString()
                ) : undefined
            }
            <span className="lightMode">
              &nbsp;KRW
            </span>
          </dd>
        </dt>
        <dt className="lightMode">
          종가
          <dd className="lightMode-title">
            {
              cr_selected && cr_selected.price ?
                (
                  Array.isArray(cr_selected.price) ?
                    (cr_selected.price[0]).toLocaleString() :
                    (cr_selected.price).toLocaleString()
                ) : undefined
            }
          </dd>
        </dt>
        <dt className="lightMode">
          고가
          <dd className="lightMode-title">
            <span className="dd-high_price">
              {
                cr_selected && cr_selected.high_price ?
                  (
                    Array.isArray(cr_selected.high_price) ?
                      (cr_selected.high_price[0]).toLocaleString() :
                      (cr_selected.high_price).toLocaleString()
                  ) : undefined
              }
            </span>
          </dd>
        </dt>
      </dl>
      <dl className="selectedDetail_dl_2 lightMode">
        <dt className="lightMode">
          거래량
          <dd className="lightMode-title">
            {
              cr_selected && cr_selected.trade_volume ?
                (
                  Array.isArray(cr_selected.trade_volume) ?
                    (Number(String(Math.floor(cr_selected.trade_volume[0])))).toLocaleString() :
                    (Number(String(Math.floor(cr_selected.trade_volume)))).toLocaleString()
                ) : undefined
            }
            <span className="lightMode">
              &nbsp;
              {
                cr_selected && cr_selected.market ?
                  (
                    Array.isArray(cr_selected.market) ?
                      (cr_selected.market[0]).slice(4) :
                      (cr_selected.market).slice(4)
                  ) : undefined
              }
            </span>
          </dd>
        </dt>
        <dt className="lightMode">
          시가
          <dd className="lightMode-title">
            {
              cr_selected && cr_selected.open_price ?
                (
                  Array.isArray(cr_selected.open_price) ?
                    (cr_selected.open_price[0]).toLocaleString() :
                    (cr_selected.open_price).toLocaleString()
                ) : undefined
            }
          </dd>
        </dt>
        <dt className="lightMode">
          저가
          <dd className="lightMode">
            <span className="dd-low_price">
              {
                cr_selected && cr_selected.low_price ?
                  (
                    Array.isArray(cr_selected.low_price) ?
                      (cr_selected.low_price[0]).toLocaleString() :
                      (cr_selected.low_price).toLocaleString()
                  ) : undefined
              }
            </span>
          </dd>
        </dt>
      </dl>
    </>

  )
}

export { TradingView };