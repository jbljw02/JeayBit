import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setBuyingPrice, setSellingPrice, setFilteredData, setSelectedCrypto, setFavoriteCrypto, setOwnedCrypto, setCryptoRealTime } from "../../../../redux/store";
import useFunction from "../../../useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import starOn from '../../../../assets/images/star-on.png'
import starOff from '../../../../assets/images/star-off.png'
import { Crypto } from "../../../../redux/store";
import axios from "axios";
import formatWithComas from "../../../../utils/format/formatWithComas";

interface Differences {
    name: string;
    oldValue: number;
    newValue: number;
}

export default function ListTbody() {
    const dispatch = useDispatch();

    const { getAllCrypto } = useFunction();

    const filteredData = useSelector((state: RootState) => state.filteredData);
    const listCategory = useSelector((state: RootState) => state.listCategory);
    const allCrypto = useSelector((state: RootState) => state.allCrypto);
    const user = useSelector((state: RootState) => state.user);

    // 화폐 가격을 업데이트 하기 전에 해당 state에 담음
    const [prevData, setPrevData] = useState<Record<string, number> | undefined>(undefined);
    // 화폐 가격의 변화를 저장
    const [differences, setDifferences] = useState<Differences[]>([]);

    // 초기 렌더링시 화폐 정보를 받아오고, 주기적으로 업데이트
    useEffect(() => {
        getAllCrypto();

        // getAllCrypto 함수를 2초마다 실행 - 서버에서 받아오는 값을 2초마다 갱신시킴
        const interval = setInterval(() => {
            getAllCrypto();
        }, 2000);

        // setInterval이 반환하는 interval ID를 clearInterval 함수로 제거
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const isFavorites = allCrypto.filter(item => item.is_favorited);
        const isOwnes = allCrypto.filter(item => item.is_owned && item.owned_quantity > 0.00);

        dispatch(setFavoriteCrypto(isFavorites));
        dispatch(setOwnedCrypto(isOwnes));
    }, [allCrypto]);

    // 화폐 가격의 변화를 감지하고 업데이트
    useEffect(() => {
        // 각 항목의 name을 키로, price를 값으로 하는 객체 생성
        const cryptoPriceMap: Record<string, number> = filteredData.reduce((acc, item) => {
            acc[item.name] = item.price;
            return acc;
        }, {} as Record<string, number>);

        if (!prevData) {
            setPrevData(cryptoPriceMap);
            return;
        }

        // 이전 값과 현재 값의 차이를 저장할 배열
        const newDifferences: Differences[] = [];

        // 객체를 순회하며 변화 이전 값과 현재 값을 비교
        if (prevData) {
            Object.keys(cryptoPriceMap).forEach(name => {
                // 값이 다를 경우, newDifferences 배열에 변화된 항목 추가
                if (prevData[name] !== cryptoPriceMap[name]) {
                    newDifferences.push({
                        name: name,
                        oldValue: prevData[name],
                        newValue: cryptoPriceMap[name],
                    });
                }
            });
        }

        setPrevData(cryptoPriceMap);
        if (newDifferences.length !== allCrypto.length) {
            setDifferences(newDifferences);
        }
    }, [filteredData]);

    // 로그인한 사용자에 대해 관심 화폐를 업데이트
    const addFavoriteCrypto = async (email: string, cryptoName: string) => {
        if (user.email) {
            try {
                const response = axios.post("http://127.0.0.1:8000/add_favoriteCrypto_to_user/", {
                    email: email,
                    crypto_name: cryptoName,
                });
                console.log("관심화폐 추가: ", response);
            } catch (error) {
                console.log("관심화폐 추가 실패: ", error);
            }
        }
    };

    // 사용자의 관심 화폐 목록을 가져옴
    const getFavoriteCrypto = async (email: string) => {
        if (user.email) {
            try {
                const response = await axios.post(
                    'http://localhost:8000/get_user_favoriteCrypto/', {
                    email: email
                });
                console.log("반환값-관심화폐 : ", response.data);
            } catch (error) {
                console.log("관심 화폐 정보 받아오기 실패", error);
            }
        }
    };

    // 별 이미지를 클릭하면 관심 화폐 추가 요청
    const starClick = (index: number, e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
        addFavoriteCrypto(user.email, filteredData[index].name);
        getFavoriteCrypto(user.email)
    };

    // 특정 화폐를 클릭했을 때
    const cryptoClick = (value: Crypto) => {
        dispatch(setSelectedCrypto(value));
        dispatch(setCryptoRealTime(value));
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
                <tbody>
                    {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
                    {
                        Array.isArray(filteredData) &&
                        filteredData.map((item, i) => {
                            // 가격의 변화가 생긴 state를 테이블에서 찾아 해당 td 시각화
                            let isChanged = differences.some((diff) => {
                                return diff.name === item.name && diff.newValue === item.price;
                            });

                            let priceClass_rise = isChanged ? "change-price-rise" : "";
                            let priceClass_fall = isChanged ? "change-price-fall" : "";

                            const cryptoPrice = formatWithComas(item.price); // 화폐 가격
                            const changeRate = (item.change_rate * 100).toFixed(2); // 화폐 변화율
                            const changePrice = formatWithComas(item.change_price); // 화폐 변화량

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
                                    <td className="td-name">
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
                                            <td>
                                                <span className={`td-rise ${priceClass_rise}`}>
                                                    {cryptoPrice}
                                                </span>
                                            </td>
                                        ) :
                                            item.change === "FALL" ? (
                                                <td>
                                                    <span className={`td-fall ${priceClass_fall}`}>
                                                        {cryptoPrice}
                                                    </span>
                                                </td>
                                            ) :
                                                (
                                                    <td>
                                                        <span>{cryptoPrice}</span>
                                                    </td>
                                                )}
                                    {
                                        // 변화율 및 변화량
                                        item.change === "RISE" ? (
                                            <td>
                                                <span className="td-rise">
                                                    +{changeRate}% <br />
                                                    +{changePrice}
                                                </span>
                                            </td>
                                        ) :
                                            item.change === "FALL" ? (
                                                <td>
                                                    <span className="td-fall">
                                                        -{changeRate}% <br />
                                                        -{changePrice}
                                                    </span>
                                                </td>
                                            ) :
                                                (
                                                    <td>
                                                        <span>
                                                            {changeRate}% <br />
                                                            {changePrice}
                                                        </span>
                                                    </td>
                                                )}
                                    {/* 보유수량 혹은 거래대금 */}
                                    <td>
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