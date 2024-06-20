import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setStar, setBuyingPrice, setSellingPrice, setCr_market_selected, setCr_name_selected, setFilteredData, setLogInEmail, setLogInUser, setSortedData, setSelectedCrypto } from "../../../../redux/store";
import useFunction from "../../../../utils/useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import starOn from '../../../../assets/images/star-on.png'
import starOff from '../../../../assets/images/star-off.png'
import { Crypto } from "../../../../redux/store";

export default function ListTbody() {
    const dispatch = useDispatch();

    const { getAllCrypto,
        selectAskingPrice,
        selectClosedPrice,
        requestCandleMinute,
        requestCandleDate,
        addCryptoToUser,
    } = useFunction();

    const filteredData = useSelector((state: RootState) => state.filteredData);
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
    const listCategory = useSelector((state: RootState) => state.listCategory);
    const allCrypto = useSelector((state: RootState) => state.allCrypto);
    const user = useSelector((state: RootState) => state.user);

    // 화폐 가격을 업데이트 하기 전에 해당 state에 담음
    const [prevData, setPrevData] = useState<number[]>();

    // 이전 화폐 가격과 현재 화폐 가격을 비교하여 변화가 발생한 화폐를 저장할 state
    const [differences, setDifferences] = useState<
        {
            index: number;
            oldValue: number;
            newValue: number;
        }[]
    >([]);

    // 초기 렌더링시 화폐 정보를 받아오고, 주기적으로 업데이트
    useEffect(() => {
        getAllCrypto();

        // getAllCrypto 함수를 1초마다 실행 - 서버에서 받아오는 값을 1초마다 갱신시킴
        const interval = setInterval(() => {
            getAllCrypto();
        }, 1000);

        // setInterval이 반환하는 interval ID를 clearInterval 함수로 제거
        return () => clearInterval(interval);
    }, []);

    // 서버로부터 받아온 화폐의 값이 바뀔 때마다 filteredData도 동시에 업데이트
    useEffect(() => {
        // 초기에는 filteredData가 비어있기 때문에 allCrypto의 값으로 그대로 업데이트
        if (filteredData.length === 0) {
            dispatch(setFilteredData(allCrypto));
        }
        else {
            // allCrypto의 값 전체를 업데이트 하는 게 아닌, filteredData가 가지고 있는 값들만 업데이트 함
            const updatedData = filteredData.map(filteredItem => {
                const updatedItem = allCrypto.find(cryptoItem => cryptoItem.name === filteredItem.name);
                return updatedItem ?
                    // {} => filtedItem, updatedItem의 속성을 모두 복사
                    // 두 아이템이 동일한 키를 가지고 있으면 updatedItem으로 덮어씌움
                    { ...filteredItem, ...updatedItem } :
                    filteredItem;
            });
            dispatch(setFilteredData(updatedData));
        }
    }, [allCrypto]);

    // 화폐 가격의 변화를 감지하고 업데이트
    useEffect(() => {
        // state의 업데이트는 비동기적이기 때문에 값이 즉시 바뀌지 않음
        // 그러므로 이 useEffect() 안에서 prevData는 아직 이전의 값을 가지고 있기 때문에 cryptoPriceArray와 prevData는 다른 값을 가짐을 이용
        // cryptoPriceArray = 현재값, prevData = 이전값
        const cryptoPriceArray = filteredData.map(item => item.price);
        setPrevData(cryptoPriceArray);

        // 값이 변한 화폐를 판별
        let newDifferences: {
            index: number;
            oldValue: number;
            newValue: number;
        }[] = [];

        // 화폐 리스트가 변할 때마다 변화 이전 값과 현재 값을 비교
        if (prevData) {
            prevData.forEach((value, index) => {
                if (value !== cryptoPriceArray[index]) {
                    newDifferences.push({
                        index: index,
                        oldValue: value,
                        newValue: cryptoPriceArray[index],
                    });
                }
            });
            setDifferences(newDifferences);
        }

        // 화폐의 가격이 업데이트 됨에 따라, 차트의 데이터를 최신화
        if (filteredData.length > 0 && selectedCrypto) {
            if (chartSortTime && selectedCrypto.market) {
                requestCandleMinute(selectedCrypto.market, chartSortTime);
            }
            else if (!chartSortTime && selectedCrypto.market) {
                requestCandleDate(selectedCrypto.market);
            }
        }
    }, [allCrypto]);

    const updateSelectedCrypto = () => {
        const targetCrypto = allCrypto.find(item => item.market === selectedCrypto.market);
        if (targetCrypto) {
            dispatch(setSelectedCrypto(targetCrypto));
        }
    }

    // 선택한 화폐가 변경 될 때
    useEffect(() => {
        // 호가 및 체결내역 호출
        if (selectedCrypto.market) {
            selectClosedPrice(selectedCrypto.market);
            selectAskingPrice(selectedCrypto.market);
        }
    }, [selectedCrypto]);

    // 별 이미지를 클릭하면 관심 화폐 추가 요청
    const starClick = (index: number, e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
        addCryptoToUser(user.email, filteredData[index].name);
    };

    // 특정 화폐를 클릭했을 때
    const cryptoClick = (value: Crypto) => {
        dispatch(setSelectedCrypto(value));
        dispatch(setBuyingPrice(value.price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매수가격'이 업데이트 됨
        dispatch(setSellingPrice(value.price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매도가격'이 업데이트 됨
    }

    return (
        <PerfectScrollbar className="scrollBar-listTable">
            <table className="list-table">
                <colgroup>
                    <col width={150} />
                    <col width={90} />
                    <col width={90} />
                    <col width={90} />
                </colgroup>
                <tbody className="scrollable-tbody">
                    {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
                    {
                        Array.isArray(filteredData) &&
                        filteredData.map((item, i) => {
                            // 가격의 변화가 생긴 state를 테이블에서 찾아 해당 td 시각화
                            let isChanged = differences.some((diff, index) => {
                                return diff.index === i && diff.newValue === item.price;
                            });
                            let priceClass_rise = isChanged ? "change-price-rise" : "";
                            let priceClass_fall = isChanged ? "change-price-fall" : "";

                            const cryptoPrice = item.price.toLocaleString(); // 화폐 가격
                            const changeRate = (item.change_rate * 100).toFixed(2); // 화폐 변화율
                            const changePrice = item.change_price.toLocaleString(); // 화폐 변화량

                            // 화폐의 보유량 설정
                            let userOwnedQuantity;
                            if (listCategory === '보유') {
                                let ownedQuantity = String(item.owned_quantity);
                                let ownedMarket = (item.market).slice(4);

                                userOwnedQuantity = ownedQuantity + ownedMarket;

                                // 전체 문자열의 길이가 12자리를 넘어갈 경우 12자리가 될 때 까지 마지막 인덱스 제거
                                while (userOwnedQuantity.length > 11) {
                                    ownedQuantity = ownedQuantity.slice(0, -1);
                                    userOwnedQuantity = ownedQuantity + ownedMarket;
                                }
                                // 마지막 인덱스가 '.'일 경우 제거
                                if (userOwnedQuantity.endsWith('.')) {
                                    userOwnedQuantity = userOwnedQuantity.slice(0, -1);
                                }
                            }

                            return (
                                <tr
                                    key={i}
                                    onClick={() => cryptoClick(filteredData[i])}>
                                    <td className="td-name lightMode">
                                        <span className="span-star">
                                            <img
                                                onClick={(e) => { starClick(i, e) }}
                                                src={item.is_favorited ? starOn : starOff}
                                                alt="star"
                                            />
                                        </span>
                                        <div className="div-name">
                                            <div>{item.name}</div>
                                            <div>{item.market}</div>
                                        </div>
                                    </td>
                                    {/* 전일 대비 가격이 상승했다면 청색, 하락했다면 적색, 동일하다면 검정색 */}
                                    {
                                        // 가격
                                        item.change === "RISE" ? (
                                            <td className="lightMode">
                                                <span className={`td-rise ${priceClass_rise}`}>
                                                    {cryptoPrice}
                                                </span>
                                            </td>
                                        ) :
                                            item.change === "FALL" ? (
                                                <td className="lightMode">
                                                    <span className={`td-fall ${priceClass_fall}`}>
                                                        {cryptoPrice}
                                                    </span>
                                                </td>
                                            ) :
                                                (
                                                    <td className="lightMode">
                                                        <span>{cryptoPrice}</span>
                                                    </td>
                                                )}
                                    {
                                        // 변화율 및 변화량
                                        item.change === "RISE" ? (
                                            <td className="lightMode">
                                                <span className="td-rise">
                                                    +{changeRate}% <br />
                                                    {changePrice}
                                                </span>
                                            </td>
                                        ) :
                                            item.change === "FALL" ? (
                                                <td className="lightMode">
                                                    <span className="td-fall">
                                                        -{changeRate}% <br />
                                                        {changePrice}
                                                    </span>
                                                </td>
                                            ) :
                                                (
                                                    <td className="lightMode">
                                                        <span>
                                                            {changeRate}% <br />
                                                            {changePrice}
                                                        </span>
                                                    </td>
                                                )}
                                    {/* 보유수량 혹은 거래대금 */}
                                    <td className="lightMode">
                                        {
                                            listCategory === '보유' ?
                                                <span className="td-volume">
                                                    {userOwnedQuantity}
                                                </span> :
                                                <span>
                                                    {
                                                        Number(String(Math.floor(item.trade_price)).slice(0, -6))
                                                            .toLocaleString()
                                                    }
                                                    백만
                                                </span>
                                        }
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </PerfectScrollbar>
    )
}