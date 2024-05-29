import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setStar, setCr_selected, setBuyingPrice, setSellingPrice, setCr_market_selected, setCr_name_selected, setFilteredData, setLogInEmail, setLogInUser, setSortedData } from "../../../redux/store";
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

export default function ListTbody() {
    const dispatch = useDispatch();

    const { fetchData,
        initialData,
        selectAskingPrice,
        selectAskingPrice_unSigned,
        selectClosedPrice,
        selectMarket_time,
        selectMarket_date,
        addCryptoToUser,
        getFavoriteCrypto,
        getOwnedCrypto,
        getTradeHistory,
        getCryptoName
    } = useFunction();

    const cr_name = useSelector((state: RootState) => state.cr_name);
    const cr_price = useSelector((state: RootState) => state.cr_price);
    const cr_market = useSelector((state: RootState) => state.cr_market);
    const cr_change = useSelector((state: RootState) => state.cr_change);
    const cr_change_rate = useSelector((state: RootState) => state.cr_change_rate);
    const cr_change_price = useSelector((state: RootState) => state.cr_change_price);
    const cr_trade_price = useSelector((state: RootState) => state.cr_trade_price);
    const cr_trade_volume = useSelector((state: RootState) => state.cr_trade_volume);
    const cr_open_price = useSelector((state: RootState) => state.cr_open_price);
    const cr_high_price = useSelector((state: RootState) => state.cr_high_price);
    const cr_low_price = useSelector((state: RootState) => state.cr_low_price);
    const star = useSelector((state: RootState) => state.star);
    const filteredData = useSelector((state: RootState) => state.filteredData);
    const cr_market_selected = useSelector((state: RootState) => state.cr_market_selected);
    const cr_selected = useSelector((state: RootState) => state.cr_selected);

    const listCategory = useSelector((state: RootState) => state.listCategory);

    // 검색값을 관리하기 위한 state
    const [search_cr, setSearch_cr] = useState<string>("");

    // 차례로 화폐명, 현재가, 전일대비, 거래대금의 정렬 상태를 관리
    const [sort_states, setSort_states] = useState<number[]>([0, 0, 0, 0]);

    // 정렬하려는 목적에 따라 이미지를 변경하기 위해 배열로 생성
    const sort_images = [img_sort, img_sort_down, img_sort_up];

    const selectedChartSort = useSelector((state: RootState) => state.selectedChartSort);
    const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
    const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
    const ownedCrypto = useSelector((state: RootState) => state.ownedCrypto);
    const isBuying = useSelector((state: RootState) => state.isBuying);

    const [selectedCrypto, setSelectedCrypto] = useState<any>();
    // eslint-disable-next-line
    const [userSelectedCrypto, setUserSelectedCrypto] = useState<any>();

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

    useEffect(() => {
        // const 변수 = setInterval(() => { 콜백함수, 시간 })
        // fetchData 함수를 1초마다 실행 - 서버에서 받아오는 값을 1초마다 갱신시킴
        const interval = setInterval(() => {
            fetchData();
        }, 1000);

        initialData();

        // clearInterval(변수)
        // setInterval이 반환하는 interval ID를 clearInterval 함수로 제거
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    // 별 이미지를 클릭할 때마다 서버로부터 관심 화폐에 대한 정보 받아옴
    useEffect(() => {
        if (logInEmail !== '') {
            getFavoriteCrypto(logInEmail);
        }
        // eslint-disable-next-line
    }, [isFavorited]);



    // 필터링 및 정렬된 데이터를 새로운 배열로 생성 -> setFilteredData로 상태를 업데이트
    // price = 숫자형, f_price = 문자형 / 숫자형으로 정렬, 문자형으로 출력
    const updatedData = cr_name.map((name, i) => ({
        name,
        price: cr_price[i],
        market: cr_market[i],
        change: cr_change[i],
        change_rate: cr_change_rate[i],
        change_price: cr_change_price[i],
        trade_price: cr_trade_price[i],
        trade_volume: cr_trade_volume[i],
        open_price: cr_open_price[i],
        high_price: cr_high_price[i],
        low_price: cr_low_price[i],
        star: star[i],
        // 검색어에 해당하는 데이터를 비교하여 배열을 재생성
    })).filter((item) =>
        item.name.toLowerCase().includes(search_cr.toLowerCase())
    );

    // useEffect(() => {
    //   if (filteredData.length === 0 && updatedData.length > 0) {
    //     dispatch(setFilteredData(updatedData));
    //   }
    // });

    // 화폐 가격의 변화를 감지하고 이전 값과 비교하여 변화가 생긴 값을 상태에 업데이트
    useEffect(() => {
        setPrevData(cr_price); // state의 업데이트는 비동기적이기 때문에 값이 즉시 바뀌지 않음. 그러므로 이 useEffect() 안에서 prevData는 아직 이전의 값을 가지고 있기 때문에 cr_price와 prevData는 다른 값을 가짐. (cr_price = 현재값, prevData = 이전값)

        let newDifferences: {
            index: number;
            oldValue: number;
            newValue: number;
        }[] = [];

        // 화폐 리스트가 변할 때마다 변화 이전 값과 현재 값을 비교
        if (prevData !== undefined) {
            prevData.forEach((value, index) => {
                if (value !== cr_price[index]) {
                    newDifferences.push({
                        index: index,
                        oldValue: value,
                        newValue: cr_price[index],
                    });
                }
            });
        }
        setDifferences(newDifferences);

        // 별도로 선택한 화폐가 있을 때
        if (selectedCrypto) {
            const newSelectedCrypto = filteredData.find(
                (crypto) => crypto.name === selectedCrypto.name
            );
            if (newSelectedCrypto) {
                setSelectedCrypto(newSelectedCrypto);
                setUserSelectedCrypto(newSelectedCrypto);
                dispatch(setCr_selected(newSelectedCrypto));
            }
            // 호가 및 체결내역 호출
            selectClosedPrice(selectedCrypto.market);
            selectAskingPrice(selectedCrypto.market);

            getAskingPrice_unSigned();

        }
        // 선택한 화폐가 없을 때(비트코인의 정보 출력)
        else {
            if (filteredData.length > 0) {
                const initial_newSelectedCrypto = filteredData[0];
                if (initial_newSelectedCrypto) {
                    setSelectedCrypto(initial_newSelectedCrypto); // 해당 코드 때문에 '비트코인'이 강제 선택됨. 즉, if문 조건 성립
                    dispatch(setCr_selected(initial_newSelectedCrypto));
                    dispatch(setBuyingPrice(initial_newSelectedCrypto.price));
                    dispatch(setSellingPrice(initial_newSelectedCrypto.price));
                }
            }
        }
        // 차트에 실시간 데이터를 전달(시간당)
        if (filteredData.length > 0 && selectedCrypto) {
            if (selectedCrypto.name && selectedCrypto.market === "KRW-BTC") {
                selectMarket_time(cr_market_selected, chartSortTime);
            } else {
                selectMarket_time(cr_market_selected, chartSortTime);
            }
        }
    }, [filteredData]);

    // 리스트에 있는 화폐 검색시 업데이트
    useEffect(() => {
        dispatch(setFilteredData(updatedData));
        // eslint-disable-next-line
    }, [search_cr, cr_price]);

    useEffect(() => {
        if (cr_market_selected) {
            selectMarket_date(cr_market_selected);
            // selectMarket_time(cr_market_selected, chartSortTime);
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

                getAskingPrice_unSigned()
            }
        }
        // eslint-disable-next-line
    }, [])


    // 별 이미지를 클릭하면 on off
    const starClick = (index: number) => {
        dispatch(setStar(index));
        setIsFavorited(!isFavorited);
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
            let rise_crypto: Crypto[] = [];
            let even_crypto: Crypto[] = [];
            let fall_crypto: Crypto[] = [];

            // 상승/동결/하락 여부에 따라 구분하여 새 배열 생성
            sortedData.forEach((item) => {
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
                        rise_crypto.sort((a, b) => b.change_rate - a.change_rate);
                        even_crypto.sort((a, b) => b.change_rate - a.change_rate);
                        fall_crypto.sort((a, b) => a.change_rate - b.change_rate);

                        // 새 배열을 원본 배열의 카피본에 병합 - 내림차순이기 때문에 상승, 동결, 하락순으로 병합
                        sortedData = [...rise_crypto, ...even_crypto, ...fall_crypto];
                        // dispatch(setFilteredData(sortedData));

                        sort_states[0] = 0;
                        sort_states[1] = 0;
                        sort_states[3] = 0;
                    }
                    if (states_copy[index] === 2) {
                        fall_crypto.sort((a, b) => b.change_rate - a.change_rate);
                        even_crypto.sort((a, b) => b.change_rate - a.change_rate);
                        rise_crypto.sort((a, b) => a.change_rate - b.change_rate);

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
                        sortedData.sort((a, b) => b.trade_price - a.trade_price);
                        // dispatch(setFilteredData(sortedData));

                        sort_states[0] = 0;
                        sort_states[1] = 0;
                        sort_states[2] = 0;
                    }
                    if (states_copy[index] === 2) {
                        sortedData.sort((a, b) => a.trade_price - b.trade_price);
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

    const cryptoClick = (value: Crypto) => {
        dispatch(setBuyingPrice(value.price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매수가격'이 업데이트 됨
        dispatch(setSellingPrice(value.price)); // 특정 화폐를 클릭하면 해당 화폐의 값으로 '매도가격'이 업데이트 됨
        nameSelect(value.name);
        marketSelect(value.market);
        setSelectedCrypto(value);
        selectMarket_date(value.market);
        selectMarket_time(
            value.market,
            selectedChartSort
        );
        selectAskingPrice(value.market);
        selectClosedPrice(value.market);

    }

    // 각 값들을 테이블에서 클릭한 화폐의 정보로 변경
    const nameSelect = (value: string) => {
        dispatch(setCr_name_selected(value));
    };
    const marketSelect = (value: string) => {
        dispatch(setCr_market_selected(value));
    };

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

                            // DB에서 가져온 관심화폐 목록과 일치하는 행을 찾음
                            let isFavorited = Array.isArray(favoriteCrypto) &&
                                favoriteCrypto.some((diff) => {
                                    return item.name === diff.crypto_name;
                                });

                            let userOwnedQuantity;
                            if (listCategory === '보유') {
                                // 인덱스 한 번당 소유화폐를 순회시켜서 일치하는 요소를 찾고, 찾지 못한다면 ?를 이용해서 undefined를 반환
                                let ownedQuantity = String(Number(ownedCrypto.find((crypto) => item.name === crypto.crypto_name)?.quantity)?.toFixed(2))

                                let ownedMarket = (item.market).slice(4)

                                userOwnedQuantity = ownedQuantity + ownedMarket;

                                // 전체 문자열의 길이가 12자리를 넘어갈 경우 12자리가 될 때 까지 마지막 인덱스 제거
                                while (userOwnedQuantity.length > 12) {
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
                                                onClick={() => {
                                                    starClick(i);
                                                    addCryptoToUser(logInEmail, filteredData[i].name);
                                                }}
                                                src={isFavorited ? starOn : starOff}
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
                                                    userOwnedQuantity :
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