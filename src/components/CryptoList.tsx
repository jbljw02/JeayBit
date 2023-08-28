import { useDispatch, useSelector } from "react-redux";
import { RootState, setFilteredData, setStar, crypto, setCr_names_selected, setCr_markets_selected, setCr_price_selected, setCr_change_selected, setCr_change_rate_selected, setCr_change_price_selected, setSortedData, setCr_trade_price_selected, setCr_trade_volume_selected, setCr_open_price_selected, setCr_high_price_selected, setCr_low_price_selected } from "../store";
import { useEffect, useState } from "react";
import img_sort from '../assets/images/sort.png';
import img_sort_up from '../assets/images/sort-up.png';
import img_sort_down from '../assets/images/sort-down.png';
import starOn from '../assets/images/star-on.png';
import starOff from '../assets/images/star-off.png';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';


function CryptoList() {

  // dispatch 함수를 사용하기 위한 선언
  const dispatch = useDispatch();

  // useSelector훅을 이용해 store에서 state를 가져옴
  const cr_names = useSelector((state: RootState) => { return state.cr_names; });
  const cr_price = useSelector((state: RootState) => { return state.cr_price; });
  const cr_markets = useSelector((state: RootState) => { return state.cr_markets; });
  const cr_change = useSelector((state: RootState) => { return state.cr_change; });
  const cr_change_rate = useSelector((state: RootState) => { return state.cr_change_rate; });
  const cr_change_price = useSelector((state: RootState) => { return state.cr_change_price; });
  const cr_trade_price = useSelector((state: RootState) => { return state.cr_trade_price; });
  const cr_trade_volume = useSelector((state: RootState) => { return state.cr_trade_volume });
  const cr_open_price = useSelector((state: RootState) => { return state.cr_open_price });
  const cr_high_price = useSelector((state: RootState) => { return state.cr_high_price });
  const cr_low_price = useSelector((state: RootState) => { return state.cr_low_price });
  const star = useSelector((state: RootState) => { return state.star; });
  const filteredData = useSelector((state: RootState) => { return state.filteredData; });
  let sortedData = useSelector((state: RootState) => { return state.sortedData });
  const cr_trade_price_selected = useSelector((state: RootState) => { return state.cr_trade_price_selected });

  // 검색값을 관리하기 위한 state
  const [search_cr, setSearch_cr] = useState<string>("");

  // 차례로 화폐명, 현재가, 전일대비, 거래대금의 정렬 상태를 관리
  const [sort_states, setSort_states] = useState<number[]>([0, 0, 0, 0]);

  // 정렬하려는 목적에 따라 이미지를 변경하기 위해 배열로 생성
  const sort_images = [img_sort, img_sort_down, img_sort_up];

  // 검색어 또는 정렬 상태가 변경되었을 때 재렌더링(변경이 없다면 초기 상태를 출력)
  // 필터링 및 정렬된 데이터를 새로운 배열로 생성 -> setFilteredData로 상태를 업데이트
  // price = 숫자형, f_price = 문자형 / 숫자형으로 정렬, 문자형으로 출력
  const updatedData = cr_names.map((name, i) => ({
    name,
    price: cr_price[i],
    f_price: cr_price[i].toLocaleString(),
    markets: cr_markets[i],
    change: cr_change[i],
    changeRate: cr_change_rate[i],
    f_changeRate: (cr_change_rate[i] * 100).toFixed(2),
    changePrice: cr_change_price[i],
    f_changePrice: cr_change_price[i].toLocaleString(),
    tradePrice: cr_trade_price[i],
    f_tradePrice: Number(String(Math.floor(cr_trade_price[i])).slice(0, -6)).toLocaleString(),
    tradeVolume: cr_trade_volume[i],
    openPrice: cr_open_price[i],
    highPrice: cr_high_price[i],
    lowPrice: cr_low_price[i],
    star: star[i]
    // 검색어에 해당하는 데이터를 비교하여 배열을 재생성
  })).filter((item) => (
    item.name.toLowerCase().includes(search_cr.toLowerCase())
  ));

  // dispatch(setFilteredData(updatedData))

  // 재렌더링 발생X(filter 기능 작동X)

  // else if(sortedData.length !== 0){
  //   dispatch(setSortedData(sortedData));
  //   dispatch(setSortedData(updatedData))
  // }

  // 의존성 배열 추가(배열에 포함된 값들 중 하나라도 변경되면 useEffect 함수가 실행되며 재렌더링 발생 
  // filteredData가 포함될시 조건문이 없다면 무한 dispatch로 인한 런타임에러 발생)

  useEffect(() => {
    // console.log("재렌더링 ----------------------- !")
    if (filteredData.length === 0 && updatedData.length > 0) {
      dispatch(setFilteredData(updatedData));
    }
  });


  // 별 이미지를 클릭하면 on off
  const starClick = (index: number) => {
    dispatch(setStar(index));
  };

  // 정렬 이미지 클릭 이벤트
  const sortClick = (index: number) => {

    // 정렬 이미지 순환
    setSort_states((prevStates) => {
      const states_copy = [...prevStates];
      states_copy[index] = (states_copy[index] + 1) % sort_images.length;

      let sortedData = [...filteredData];

      // 화폐를 전일대비 상승/동결/하락 여부에 따라 구분
      // 값 자체에 양수, 음수 구분이 되어있는 것이 아니기 때문에 정렬하기 전에 구분을 지어줘야 함
      let rise_crypto: crypto[] = [];
      let even_crypto: crypto[] = [];
      let fall_crypto: crypto[] = [];

      // 상승/동결/하락 여부에 따라 구분하여 새 배열 생성
      sortedData.map((item) => {
        rise_crypto = sortedData.filter((item) => item.change === "RISE");
        even_crypto = sortedData.filter((item) => item.change === "EVEN");
        fall_crypto = sortedData.filter((item) => item.change === "FALL");
      });

      switch (index) {

        // 화폐 이름순 정렬
        case 0:
          if (states_copy[index] === 0) {
            states_copy[index] = 1;
          }
          if (states_copy[index] === 1) {
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            // dispatch(setFilteredData(sortedData));

            sort_states[1] = 0;
            sort_states[2] = 0;
            sort_states[3] = 0;
          }
          if (states_copy[index] === 2) {
            sortedData.sort((a, b) => b.name.localeCompare(a.name));
            // dispatch(setFilteredData(sortedData));

            sort_states[1] = 0;
            sort_states[2] = 0;
            sort_states[3] = 0;
          }
          break;

        // 화폐 가격순 정렬
        case 1:
          if (states_copy[index] === 0) {
            states_copy[index] = 1;
          }
          if (states_copy[index] === 1) {
            sortedData.sort((a, b) => b.price - a.price);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[2] = 0;
            sort_states[3] = 0;
          }
          if (states_copy[index] === 2) {
            sortedData.sort((a, b) => a.price - b.price);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[2] = 0;
            sort_states[3] = 0;
          }
          break;

        // 화폐 전일대비 변화순 정렬
        case 2:
          if (states_copy[index] === 0) {
            states_copy[index] = 1;
          }
          if (states_copy[index] === 1) {
            rise_crypto.sort((a, b) => b.changeRate - a.changeRate);
            even_crypto.sort((a, b) => b.changeRate - a.changeRate);
            fall_crypto.sort((a, b) => a.changeRate - b.changeRate);

            // 새 배열을 원본 배열의 카피본에 병합 - 내림차순이기 때문에 상승, 동결, 하락순으로 병합
            sortedData = [...rise_crypto, ...even_crypto, ...fall_crypto];
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[3] = 0;
          }
          if (states_copy[index] === 2) {
            fall_crypto.sort((a, b) => b.changeRate - a.changeRate);
            even_crypto.sort((a, b) => b.changeRate - a.changeRate);
            rise_crypto.sort((a, b) => a.changeRate - b.changeRate);

            // 새 배열을 원본 배열의 카피본에 병합 - 오름차순이기 때문에 하락, 동결, 상승순으로 병합
            sortedData = [...fall_crypto, ...even_crypto, ...rise_crypto];
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[3] = 0;
          }
          break;

        // 거래대금순 정렬
        case 3:
          if (states_copy[index] === 0) {
            states_copy[index] = 1;
          }
          if (states_copy[index] === 1) {
            sortedData.sort((a, b) => b.tradePrice - a.tradePrice);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[2] = 0;
          }
          if (states_copy[index] === 2) {
            sortedData.sort((a, b) => a.tradePrice - b.tradePrice);
            // dispatch(setFilteredData(sortedData));

            sort_states[0] = 0;
            sort_states[1] = 0;
            sort_states[2] = 0;
          }
          break;
      }
      dispatch(setFilteredData(sortedData));
      dispatch(setSortedData(sortedData));

      return states_copy;

    });
  };

  // 각 값들을 테이블에서 클릭한 화폐의 정보로 변경 -> TradingView, TradingDetail로 전달
  const nameSelect = (value: string) => {
    dispatch(setCr_names_selected(value));
  }
  const marketSelect = (value: string) => {
    dispatch(setCr_markets_selected(value));
  }
  const priceSelect = (value: string) => {
    dispatch(setCr_price_selected(value));
  }
  const openPriceSelect = (value: number) => {
    dispatch(setCr_open_price_selected(value));
  }
  const highPriceSelect = (value: number) => {
    dispatch(setCr_high_price_selected(value));
  }
  const lowPriceSelect = (value: number) => {
    dispatch(setCr_low_price_selected(value));
  }
  const changeSelect = (value: string) => {
    dispatch(setCr_change_selected(value));
  }
  const tradePriceSelect = (value: number) => {
    dispatch(setCr_trade_price_selected(Number(String(Math.floor(value))).toLocaleString()));
  }
  const tradeVolumeSelect = (value: number) => {
    dispatch(setCr_trade_volume_selected(Number(String(Math.floor(value))).toLocaleString()));
  }
  const change_rateSelect = (value: string) => {
    dispatch(setCr_change_rate_selected(value))
  }
  const change_priceSelect = (value: string) => {
    dispatch(setCr_change_price_selected(value));
  }

  return (
    <>
      {/* 검색 공간 */}
      <div className="list-search">
        {/* <img className="img-search" src={search}></img> */}
        <svg className="img-search" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 18 18" width="30" height="30">
          <path fill="currentColor" d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"></path>
        </svg>
        <input type="text" className='crypto-search' placeholder="검색" value={search_cr} onChange={(e) => setSearch_cr(e.target.value)}></input>
      </div>

      {/* 화폐 정보 테이블 */}
      <table className='list-table'>
        <thead className="list-thead">
          <tr>
            <th className='name' onClick={() => sortClick(0)}>
              화폐명&nbsp;
              <img className='sort' src={sort_images[sort_states[0]]} alt="화폐명"></img>
            </th>
            <th className='price' onClick={() => sortClick(1)}>
              현재가&nbsp;
              <img className='sort' src={sort_images[sort_states[1]]} alt="현재가"></img>
            </th>
            <th className='compare' onClick={() => sortClick(2)}>
              전일대비&nbsp;
              <img className='sort' src={sort_images[sort_states[2]]} alt="전일대비"></img>
            </th>
            <th className='volume' onClick={() => sortClick(3)}>
              거래대금&nbsp;
              <img className='sort' src={sort_images[sort_states[3]]} alt="거래대금"></img>
            </th>
          </tr>
        </thead>
      </table>

      <SimpleBar className="scrollBar">
        <table className="list-table">
          <tbody className='scrollable-tbody'>
            {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
            {
              filteredData.map((item, i) => {
                return (
                  <tr key={i} onClick={() => {
                    nameSelect(filteredData[i].name);
                    marketSelect(filteredData[i].markets);
                    priceSelect(filteredData[i].f_price);
                    changeSelect(filteredData[i].change);
                    change_rateSelect(filteredData[i].f_changeRate);
                    change_priceSelect(filteredData[i].f_changePrice);
                    tradePriceSelect(filteredData[i].tradePrice);
                    tradeVolumeSelect(filteredData[i].tradeVolume);
                    openPriceSelect(filteredData[i].openPrice);
                    highPriceSelect(filteredData[i].highPrice);
                    lowPriceSelect(filteredData[i].lowPrice);
                  }}>
                    {/* <td className='td-star'>
                      <img
                        onClick={() => starClick(i)}
                        // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                        src={star[i] === 'starOn' ? starOn : starOff}
                        alt="star" />
                    </td> */}
                    <td className='td-name'>
                      <span className="span-star">
                        <img
                          onClick={() => starClick(i)}
                          // 최초 star[i]의 상태는 'starOn'일 수가 없으므로 반드시 starOff 출력
                          src={star[i] === 'starOn' ? starOn : starOff}
                          alt="star" />
                      </span>
                      <div className="div-name">
                        <div>
                          {item.name}
                        </div>
                        <div>
                          {item.markets}
                        </div>
                      </div>
                    </td>

                    {/* 삼항연산자 중첩 - 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
                    {
                      item.change === 'RISE' ?
                        <td className='td-rise'>{item.f_price}</td> :
                        (
                          item.change === 'FALL' ?
                            <td className='td-fall'>{item.f_price}</td> :
                            <td className='td-even'>{item.f_price}</td>
                        )
                    }
                    {
                      item.change === 'RISE' ?
                        <td className='td-rise'>+{item.f_changeRate}% <br /> {item.f_changePrice}</td> :
                        (
                          item.change === 'FALL' ?
                            <td className='td-fall'>-{item.f_changeRate}% <br /> {item.f_changePrice}</td> :
                            <td className='td-even'>{item.f_changeRate}% <br /> {item.f_changePrice}</td>
                        )
                    }
                    <td className='td-volume'>{item.f_tradePrice}백만</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </SimpleBar>

      {/* </table> */}
    </>
  );
}

export { CryptoList };