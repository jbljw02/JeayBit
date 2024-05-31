import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setStar, setBuyingPrice, setSellingPrice, setCr_market_selected, setCr_name_selected, setFilteredData, setLogInEmail, setLogInUser, setSortedData, setSelectedCrypto } from "../../../redux/store";
import useFunction from "../../useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import starOn from '../../../assets/images/star-on.png'
import starOff from '../../../assets/images/star-off.png'
import img_sort from "../../../assets/images/sort.png";
import img_sort_up from "../../../assets/images/sort-up.png";
import img_sort_down from "../../../assets/images/sort-down.png";
import { Crypto } from "../../../redux/store";
import { setUser } from "../../../redux/features/userSlice";
import Cookies from 'js-cookie';
import ListTRow from "./common/ListTRow";

export default function ListTbody() {
    const dispatch = useDispatch();

    const { getAllCrypto,
        initialData,
        selectAskingPrice,
        selectAskingPrice_unSigned,
        selectClosedPrice,
        requestCandleMinute,
        requestCandleDate,
        addCryptoToUser,
        getFavoriteCrypto,
        getOwnedCrypto,
        getTradeHistory,
        getCryptoName,
    } = useFunction();

    const star = useSelector((state: RootState) => state.star);
    const filteredData = useSelector((state: RootState) => state.filteredData);
    const cr_market_selected = useSelector((state: RootState) => state.cr_market_selected);
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

    const listCategory = useSelector((state: RootState) => state.listCategory);

    const allCrypto = useSelector((state: RootState) => state.allCrypto);

    const selectedChartSort = useSelector((state: RootState) => state.selectedChartSort);
    const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
    const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
    const ownedCrypto = useSelector((state: RootState) => state.ownedCrypto);
    const isBuying = useSelector((state: RootState) => state.isBuying);

    const logInEmail = useSelector((state: RootState) => state.logInEmail);

    const favoriteCrypto = useSelector((state: RootState) => state.favoriteCrypto);
    const [isFavorited, setIsFavorited] = useState<boolean>(false);

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

    useEffect(() => {
        // if (listCategory === '원화') {
        //     dispatch(setFilteredData(allCrypto));
        // }
        if (listCategory === '관심') {
            const matchedCrypto: Crypto[] = filteredData
                .filter(originItem =>
                    favoriteCrypto.some(favitem => favitem.crypto_name === originItem.name)
                )
                .map(originItem => {
                    // favoriteCrypto에서 현재 originItem과 이름이 일치하는 항목 찾기
                    const favItem = favoriteCrypto.find(fav => fav.crypto_name === originItem.name);
                    // 일치하는 항목의 isFavorite 속성을 포함하여 새 객체 반환
                    return {
                        ...originItem,
                        isFavorite: !!favItem // 일치하는 favItem이 있으면 true, 없으면 false
                    };
                });
            dispatch(setFilteredData(matchedCrypto));
        }
        if (listCategory === '보유') {
            const matchedCrypto: Crypto[] = filteredData
                .filter(originItem =>
                    ownedCrypto.some(ownedItem => ownedItem.crypto_name === originItem.name)
                )
                .map(originItem => {
                    // ownedCrypto에서 현재 originItem과 이름이 일치하는 항목 찾기
                    const ownedItem = ownedCrypto.find(owned => owned.crypto_name === originItem.name);
                    // 일치하는 항목의 quantity 속성을 포함하여 새 객체 반환
                    return {
                        ...originItem,
                        quantity: ownedItem ? ownedItem.quantity : 0 // 일치하는 ownedItem이 있으면 그 quantity 사용, 없으면 0
                    };
                });
            dispatch(setFilteredData(matchedCrypto));
        }

    }, [listCategory]);

    const getAskingPrice_unSigned = () => {
        // Object.entries = 객체를 [key, value]쌍의 배열로 변환 
        let unSignedCrypto = Object.entries(isBuying)
            .filter(([key, value]) => value === true)
            .map(([key, value]) => key)

        // 마켓명으로 요청을 보내야 하기 때문에, 화폐명을 마켓명으로 변경
        let unSignedMarket: (string | null)[] = unSignedCrypto.map((name) => {
            let isCorresponed = filteredData.find(isCorresponed => isCorresponed.name === name)
            return isCorresponed ? isCorresponed.market : null
        })

        for (let i = 0; i < unSignedMarket.length; i++) {
            if (unSignedMarket[i]) {
                selectAskingPrice_unSigned(unSignedMarket[i] as string);
            }
        }

        return unSignedMarket;
    }

    // 화폐의 정보를 최신화
    useEffect(() => {
        // getAllCrypto 함수를 3초마다 실행 - 서버에서 받아오는 값을 1초마다 갱신시킴
        const interval = setInterval(() => {
            getAllCrypto();
        }, 3000);

        initialData();

        // setInterval이 반환하는 interval ID를 clearInterval 함수로 제거
        return () => clearInterval(interval);
    }, []);

    // 서버로부터 받아온 화폐의 값이 바뀔 때마다 filteredData도 동시에 업데이트
    useEffect(() => {
        dispatch(setFilteredData(allCrypto));
    }, [allCrypto]);

    // 별 이미지를 클릭할 때마다 서버로부터 관심 화폐에 대한 정보 받아옴
    useEffect(() => {
        if (logInEmail !== '') {
            getFavoriteCrypto(logInEmail);
        }
        // eslint-disable-next-line
    }, [isFavorited]);

    

    // 화폐 가격의 변화를 감지하고 이전 값과 비교하여 변화가 생긴 값을 상태에 업데이트
    useEffect(() => {
        // state의 업데이트는 비동기적이기 때문에 값이 즉시 바뀌지 않음
        // 그러므로 이 useEffect() 안에서 prevData는 아직 이전의 값을 가지고 있기 때문에 cryptoPriceArray와 prevData는 다른 값을 가짐을 이용
        // cryptoPriceArray = 현재값, prevData = 이전값
        const cryptoPriceArray = allCrypto.map(item => item.price);
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

        // console.log("filter: ", allCrypto);
        // console.log("fav: ", favoriteCrypto);
        const updatedCrypto = allCrypto.map(originItem => {
            // favoriteCrypto에서 현재 originItem과 이름이 일치하는 항목이 있는지 확인
            const isFavorited = favoriteCrypto.some(favItem => favItem.crypto_name === originItem.name);
            // 일치하는 경우 isFavorited 속성을 true로 설정
            if (isFavorited) {
                return { ...originItem, isFavorited: true };
            }
            // 일치하지 않는 경우 원본 객체를 반환
            return originItem;
        });
        
        dispatch(setFilteredData(updatedCrypto));
        
        // // 차트에 실시간 데이터를 전달(시간당)
        // if (filteredData.length > 0 && selectedCrypto) {
        //     if (selectedCrypto.name && selectedCrypto.market === "KRW-BTC") {
        //         requestCandleMinute(cr_market_selected, chartSortTime);
        //     } else {
        //         requestCandleMinute(cr_market_selected, chartSortTime);
        //     }
        // }
    }, [allCrypto]);

    // 별도로 선택한 화폐가 있을 때
    useEffect(() => {
        // 호가 및 체결내역 호출
        if (selectedCrypto.market) {
            selectClosedPrice(selectedCrypto.market);
            selectAskingPrice(selectedCrypto.market);
        }

        console.log("보유: ", ownedCrypto);
        console.log("관심: ", favoriteCrypto);
    }, [selectedCrypto]);

    useEffect(() => {
        dispatch(setFilteredData(allCrypto));
    }, []);

    // 리스트에 있는 화폐 검색시 업데이트
    useEffect(() => {
        if (cr_market_selected) {
            requestCandleDate(cr_market_selected);
            // requestCandleMinute(cr_market_selected, chartSortTime);
        }
        // eslint-disable-next-line
    }, [cr_market_selected, chartSortDate, chartSortTime]);

    // 화면이 첫 렌더링 될 때마다 
    useEffect(() => {
        const userItem = localStorage.getItem('user');
        if (userItem !== null) {
            const user = JSON.parse(userItem);
            if (user) {
                dispatch(setUser({
                    name: user.username,
                    email: user.email,
                }))
                dispatch(setLogInUser(user.username));
                dispatch(setLogInEmail(user.email));
                getFavoriteCrypto(user.email);
                getOwnedCrypto(user.email);
                getTradeHistory(user.email);
                getCryptoName(user.email);

                getAskingPrice_unSigned();
            }
        }
    }, []);



    // 별 이미지를 클릭하면 on off
    const starClick = (index: number) => {
        dispatch(setStar(index));
        setIsFavorited(!isFavorited);
    };

    // 정렬 이미지 클릭 이벤트
    const cryptoClick = (value: Crypto) => {
        dispatch(setBuyingPrice(value.price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매수가격'이 업데이트 됨
        dispatch(setSellingPrice(value.price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매도가격'이 업데이트 됨
        setSelectedCrypto(value);
        requestCandleDate(value.market);
        requestCandleMinute(
            value.market,
            selectedChartSort
        );
        selectAskingPrice(value.market);
        selectClosedPrice(value.market);
        dispatch(setSelectedCrypto(value));
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
                        filteredData.map((item, i) => {
                            // 가격의 변화가 생긴 state를 테이블에서 찾아 해당 td 시각화
                            let isChanged = differences.some((diff, index) => {
                                return diff.index === i && diff.newValue === item.price;
                            });
                            let priceClass_rise = isChanged ? "change-price-rise" : "";
                            let priceClass_fall = isChanged ? "change-price-fall" : "";

                            // console.log(`${item.name} : `, item.isFavorited);

                            // DB에서 가져온 관심화폐 목록과 일치하는 행을 찾음
                            // let isFavorited = Array.isArray(favoriteCrypto) &&
                            //     favoriteCrypto.some((diff) => {
                            //         return item.name === diff.crypto_name;
                            //     });

                            // let userOwnedQuantity;
                            // if (listCategory === '보유') {
                            //     // 인덱스 한 번당 소유화폐를 순회시켜서 일치하는 요소를 찾고, 찾지 못한다면 ?를 이용해서 undefined를 반환
                            //     let ownedQuantity = String(Number(ownedCrypto.find((crypto) => item.name === crypto.crypto_name)?.quantity)?.toFixed(2))

                            //     let ownedMarket = (item.market).slice(4)

                            //     userOwnedQuantity = ownedQuantity + ownedMarket;

                            //     // 전체 문자열의 길이가 12자리를 넘어갈 경우 12자리가 될 때 까지 마지막 인덱스 제거
                            //     while (userOwnedQuantity.length > 12) {
                            //         ownedQuantity = ownedQuantity.slice(0, -1);
                            //         userOwnedQuantity = ownedQuantity + ownedMarket;
                            //     }

                            //     // 마지막 인덱스가 '.'일 경우 제거
                            //     if (userOwnedQuantity.endsWith('.')) {
                            //         userOwnedQuantity = userOwnedQuantity.slice(0, -1);
                            //     }
                            // }

                            return (
                                <tr
                                    key={i}
                                    onClick={() => cryptoClick(filteredData[i])}>
                                    <td className="td-name lightMode">
                                        <span className="span-star">
                                            <img
                                                onClick={() => {
                                                    starClick(i);
                                                    addCryptoToUser(logInEmail, filteredData[i].name);
                                                }}
                                                src={item.isFavorited ? starOn : starOff}
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
                                        item.change === "RISE" ? (
                                            <td className="lightMode">
                                                <span className={`td-rise ${priceClass_rise}`}>
                                                    {item.price.toLocaleString()}
                                                </span>
                                            </td>
                                        ) :
                                            item.change === "FALL" ? (
                                                <td className="lightMode">
                                                    <span className={`td-fall ${priceClass_fall}`}>
                                                        {item.price.toLocaleString()}
                                                    </span>
                                                </td>
                                            ) :
                                                (
                                                    <td className="lightMode">
                                                        <span>{item.price.toLocaleString()}</span>
                                                    </td>
                                                )}
                                    {
                                        item.change === "RISE" ? (
                                            <td className="lightMode">
                                                <span className="td-rise">
                                                    +{(item.change_rate * 100).toFixed(2)}% <br />{" "}
                                                    {item.change_price.toLocaleString()}
                                                </span>
                                            </td>
                                        ) :
                                            item.change === "FALL" ? (
                                                <td className="lightMode">
                                                    <span className="td-fall">
                                                        -{(item.change_rate * 100).toFixed(2)}% <br />{" "}
                                                        {item.change_price.toLocaleString()}
                                                    </span>
                                                </td>
                                            ) :
                                                (
                                                    <td className="lightMode">
                                                        <span>
                                                            {(item.change_rate * 100).toFixed(2)}% <br />{" "}
                                                            {item.change_price.toLocaleString()}
                                                        </span>
                                                    </td>
                                                )}
                                    <td className="lightMode">
                                        <span className="td-volume">
                                            {
                                                listCategory === '보유' ?
                                                    item.quantity :
                                                    Number(String(Math.floor(item.trade_price)).slice(0, -6))
                                                        .toLocaleString()
                                            }
                                            백만
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </PerfectScrollbar>
    )
}