import { useState, useEffect } from "react";
import formatWithComas from "../../../../utils/format/formatWithComas";
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";
import { setCryptoRealTime, setSelectedCrypto } from "../../../../redux/features/crypto/selectedCryptoSlice";
import { Crypto } from "../../../../types/crypto.type";
import { setAskingSpinner } from "../../../../redux/features/ui/placeholderSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import useSelectAskingPrice from "../../../../hooks/crypto/useSelectAskingPrice";
import useSelectClosedPrice from "../../../../hooks/crypto/useSelectClosedPrice";
import { useNavigate } from "react-router-dom";
import ShortcutsButton from "../../../common/ShortcutsButton";
import checkCurrentScreen from "../../../../utils/responsive/checkCurrentScreen";

type Differences = {
    name: string;
    oldValue: number;
    newValue: number;
}

export default function ListTbody() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const selectAskingPrice = useSelectAskingPrice();
    const selectClosedPrice = useSelectClosedPrice();

    const filteredData = useAppSelector(state => state.filteredData);
    const listCategory = useAppSelector(state => state.listCategory);
    const allCrypto = useAppSelector(state => state.allCrypto);

    // 화폐 가격을 업데이트 하기 전에 해당 state에 담음
    const [prevData, setPrevData] = useState<Record<string, number> | undefined>(undefined);
    // 화폐 가격의 변화를 저장
    const [differences, setDifferences] = useState<Differences[]>([]);

    const favoriteCrypto = useAppSelector(state => state.favoriteCrypto);
    const ownedCrypto = useAppSelector(state => state.ownedCrypto);

    // 화폐 가격의 변화를 감지하고 업데이트
    useEffect(() => {
        if (filteredData.length) {
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
        }
    }, [filteredData]);

    // 특정 화폐를 클릭했을 때
    const cryptoClick = async (value: Crypto) => {
        dispatch(setAskingSpinner(true));

        dispatch(setSelectedCrypto(value));
        dispatch(setCryptoRealTime(value));
        await selectClosedPrice(value.market);
        await selectAskingPrice(value.market);

        dispatch(setAskingSpinner(false));

        if (checkCurrentScreen().device === 'mobile' || checkCurrentScreen().device === 'tablet') {
            navigate('/detail');
        }
    }

    return (
        <CustomScrollbars id='scrollbar-list-table'>
            <table className="list-table" aria-label="화폐 목록">
                <colgroup>
                    <col width="33%" />
                    <col width="22%" />
                    <col width="22%" />
                    <col width="23%" />
                </colgroup>
                <tbody>
                    {/* 검색값을 반환한 filteredData 함수를 다시 반복문을 이용하여 출력 */}
                    {
                        Array.isArray(filteredData) &&
                        Array.isArray(favoriteCrypto) &&
                        Array.isArray(ownedCrypto) &&
                        filteredData.map((item, i) => {
                            // 가격의 변화가 생긴 state를 테이블에서 찾아 해당 td 시각화
                            let isChanged = differences.some((diff) => {
                                return diff.name === item.name && diff.newValue === item.price;
                            });

                            // 관심 화폐인지 확인
                            let isFavorited = favoriteCrypto.find(fav => fav.name === item.name);

                            // 화폐를 보유중인지에 따라 처리
                            let userOwnedQuantity: { quantity: string, market: string } = { quantity: '', market: '' };
                            if (listCategory === '보유') {
                                let ownedInfo = ownedCrypto.find(own => own.name === item.name);

                                if (ownedInfo) {
                                    // 화폐의 보유량 설정
                                    let ownedQuantity = String(ownedInfo.ownedQuantity);
                                    let ownedMarket = (item.market).slice(4);

                                    // 전체 문자열의 길이가 12자리를 넘어갈 경우 12자리가 될 때까지 마지막 인덱스 제거
                                    while (ownedQuantity.length + ownedMarket.length > 11) {
                                        ownedQuantity = ownedQuantity.slice(0, -1);
                                    }

                                    // 마지막 인덱스가 '.'일 경우 제거
                                    if (ownedQuantity.endsWith('.')) {
                                        ownedQuantity = ownedQuantity.slice(0, -1);
                                    }

                                    // 결과를 공백으로 구분
                                    userOwnedQuantity = { quantity: ownedQuantity, market: ownedMarket };
                                }
                            }

                            const cryptoPrice = formatWithComas(item.price); // 화폐 가격
                            const changeRate = (item.changeRate * 100).toFixed(2); // 화폐 변화율
                            const changePrice = formatWithComas(item.changePrice); // 화폐 변화량

                            return (
                                <tr
                                    key={i}
                                    onClick={() => cryptoClick(item)}>
                                    <td id="td-name">
                                        <span className="list-shortcuts-btn-container">
                                            <ShortcutsButton
                                                crypto={item}
                                                isFavorited={isFavorited ? true : false}
                                                iconWidth={14} />
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
                                            <td id="td-price">
                                                <span className={`rise ${isChanged ? 'change-price' : ''}`}>
                                                    {cryptoPrice}
                                                </span>
                                            </td>
                                        ) :
                                            item.change === "FALL" ? (
                                                <td id="td-price">
                                                    <span className={`fall ${isChanged ? 'change-price' : ''}`}>
                                                        {cryptoPrice}
                                                    </span>
                                                </td>
                                            ) :
                                                (
                                                    <td id="td-price">
                                                        <span>{cryptoPrice}</span>
                                                    </td>
                                                )}
                                    {
                                        // 변화율 및 변화량
                                        item.change === "RISE" ? (
                                            <td id="td-compare">
                                                <span className={`rise ${isChanged ? 'change-etc' : ''}`}>
                                                    {changeRate}%+ <br />
                                                    {changePrice}+
                                                </span>
                                            </td>
                                        ) :
                                            item.change === "FALL" ? (
                                                <td id="td-compare">
                                                    <span className={`fall ${isChanged ? 'change-etc' : ''}`}>
                                                        {changeRate}%- <br />
                                                        {changePrice}-
                                                    </span>
                                                </td>
                                            ) :
                                                (
                                                    <td id="td-compare">
                                                        <span>
                                                            {changeRate}% <br />
                                                            {changePrice}
                                                        </span>
                                                    </td>
                                                )}
                                    {/* 보유수량 혹은 거래대금 */}
                                    <td id="td-volume">
                                        {
                                            listCategory === '보유' ?
                                                <span>
                                                    {userOwnedQuantity.quantity}
                                                    <span className="td-own-market">{userOwnedQuantity.market}</span>
                                                </span> :
                                                <span>
                                                    {
                                                        Number(String(Math.floor(item.tradePrice)).slice(0, -6))
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
        </CustomScrollbars>
    )
}