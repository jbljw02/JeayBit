import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFunction from "../../../../useFuction";
import TradingThead from "../TradingThead";
import SelectPercentage from "../SelectPercentage";
import adjustInputValue from "../../../../../utils/format/adjustInputValue";
import TradeInput from "../../../../input/TradeInput";
import PriceRange from "../../../../input/PriceRange";
import formatWithComas from "../../../../../utils/format/formatWithComas";
import calculatePercentage from "../../../../../utils/calculatePercentage";
import limitDecimalPlace from "../../../../../utils/format/limitDecimalPlace";
import LoginNavigator from "../LoginNavigator";
import CompleteModal from "../../../../modal/trade/TradeModal";
import TradeFailedModal from "../../../../modal/trade/TradeFailedModal";
import WaitingModal from "../../../../modal/trade/WatingModal";
import { bidSortOptions } from "../TradeSection";
import { RootState } from "../../../../../redux/store";
import { setSellingPrice } from "../../../../../redux/features/tradeSlice";
import { setWorkingSpinner } from "../../../../../redux/features/placeholderSlice";
import NoticeModal from "../../../../modal/common/NoticeModal";

export default function SellingSectioin() {
    const dispatch = useDispatch();

    const { getBalance, addTradeHistory, getTradeHistory, getOwnedCrypto, getAllCrypto } = useFunction();

    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const user = useSelector((state: RootState) => state.user);

    const [selectedPercentage, setSelectedPercentage] = useState<string>('');
    const [bidSort, setBidSort] = useState<string>('지정가');

    const sellingPrice = useSelector((state: RootState) => state.sellingPrice);
    const [sellTotal, setSellTotal] = useState<number>(0);
    const [sellQuantity, setSellQuantity] = useState<number>(0);
    const [quantityInputValue, setQuantityInputValue] = useState('0');
    const [totalInputValue, setTotalInputValue] = useState('0');
    const [sellingInputValue, setSellingInputValue] = useState('0');

    const [watingModalOpen, setWatingModalOpen] = useState<boolean>(false);
    const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);
    const [failedModalOpen, setFailedModalOpen] = useState<boolean>(false);

    const [isExceedQuantity, setIsExceedQuantity] = useState<boolean>(false);

    // 화폐 거래내역에 '매수'로 저장할지 '매도'로 저장할지를 지정
    const [tradeCategory, setTradeCategory] = useState<string>('매도');

    // 현재 시간을 저장하는 state
    const [time, setTime] = useState(new Date());

    const resetValue = () => {
        setSellQuantity(0);
        setQuantityInputValue('0');
        setSellTotal(0);
        setTotalInputValue('0');
        setSelectedPercentage('');
    }

    // 선택 화폐가 바뀔 때마다 매수 가격을 해당 화폐의 가격으로 변경하고, 주문 수량 및 총액을 초기화
    useEffect(() => {
        // 주문 수량
        setSellQuantity(0);
        setQuantityInputValue('0');

        // 주문 총액
        setSellTotal(0);
        setTotalInputValue('0');

        if (selectedCrypto && selectedCrypto.price) {
            dispatch(setSellingPrice(selectedCrypto.price));
            setSellingInputValue(String(selectedCrypto.price));
        }
    }, [selectedCrypto]);

    const selectPercentage = (percentage: string) => {
        setSelectedPercentage(percentage);

        // 선택된 화폐의 보유 수량
        const availableQuantity = selectedCrypto.owned_quantity;

        // 매수가격이 0이면 주문수량/주문총액은 의미가 없고, 보유 화폐량이 undefined이면 연산이 불가능
        if (sellingInputValue !== '0' && availableQuantity) {
            const percentageValue = calculatePercentage(percentage);

            if (percentageValue === 0) return; // 유효하지 않은 퍼센트 값에 대해 함수 종료

            let dividedQuantity = availableQuantity * percentageValue;
            dividedQuantity = limitDecimalPlace(dividedQuantity, 8);

            let dividedTotal = sellingPrice * dividedQuantity;
            dividedTotal = Math.ceil(dividedTotal);

            // 주문 수량
            setSellQuantity(dividedQuantity);
            setQuantityInputValue(dividedQuantity.toString());

            // 주문 총액
            setSellTotal(Math.floor(dividedTotal));
            setTotalInputValue(Math.floor(dividedTotal).toString());
        } else if (!availableQuantity) {
            // 주문 수량
            setSellQuantity(0);
            setQuantityInputValue('0');

            // 주문 총액
            setSellTotal(0);
            setTotalInputValue('0');
        }

    }

    // 매도 가격 변화 감지
    const sellingPriceChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);

        dispatch(setSellingPrice(Number(adjustedValue)));
        setSellingInputValue(adjustedValue);
        setSellTotal(Math.floor(parseFloat(adjustedValue) * sellQuantity));
        setTotalInputValue((Math.floor(parseFloat(adjustedValue) * sellQuantity)).toString());
    }

    // 매도 가격 슬라이더 
    const handlePriceRange = (value: number) => {
        dispatch(setSellingPrice(value));
    }

    // 매도가가 바뀌면 그에 따라 입력값도 변경
    useEffect(() => {
        setSellingInputValue(sellingPrice.toString());

        const adjustedValue = adjustInputValue(sellingInputValue);

        setSellTotal(Math.floor(parseFloat(adjustedValue) * sellQuantity));
        setTotalInputValue((Math.floor(parseFloat(adjustedValue) * sellQuantity)).toString());
    }, [sellingPrice]);

    // 주문 수량 변화 감지
    const orderQuantityChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);

        const decimalPart = (adjustedValue.split('.')[1] || '').length;

        // 소수점 자릿수가 8자리 이하인 경우만
        if (decimalPart <= 8) {
            setQuantityInputValue(adjustedValue);
            setSellQuantity(parseFloat(adjustedValue));
        }
        setSellTotal(Math.floor(sellingPrice * parseFloat(adjustedValue)));
        setTotalInputValue((Math.floor(sellingPrice * parseFloat(adjustedValue))).toString());
    }

    // 주문 총액 변화 감지
    const totalValueChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);

        // 입력값이 숫자인지 확인하고, 숫자 이외의 문자가 포함되어 있는지 확인
        const isNumber = /^[0-9]*$/.test(adjustedValue);

        if (sellingPrice) {
            if (isNumber) {
                setTotalInputValue(adjustedValue);
                setSellTotal(parseFloat(adjustedValue));

                let dividiedQuantity = Number(adjustedValue) / sellingPrice;

                // 소수점 아래 8자리로 제한
                if ((dividiedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividiedQuantity = parseFloat(dividiedQuantity.toFixed(8));
                }

                setSellQuantity(dividiedQuantity);
                setQuantityInputValue(dividiedQuantity.toString());
            }
        }
    }

    const processSellTrade = async (isMarketValue: boolean, price: number) => {
        // 주문총액이 잔고의 잔액을 넘으면 주문을 넣을 수 없음
        if (sellQuantity > selectedCrypto.owned_quantity) {
            setIsExceedQuantity(true);
            return;
        }

        dispatch(setWorkingSpinner(true));

        const addTradeResCode = await addTradeHistory(
            user.email,
            selectedCrypto.name,
            tradeCategory,
            time,
            selectedCrypto.market,
            price,
            sellTotal,
            sellQuantity,
            selectedCrypto.market,
            isMarketValue
        );
        
        await getTradeHistory(user.email);
        await getOwnedCrypto(user.email);
        await getBalance(user.email);
        
        dispatch(setWorkingSpinner(false));

        if (addTradeResCode === 200) {
            resetValue();
            setCompleteModalOpen(true);
        } else if (addTradeResCode === 202 && !isMarketValue) {
            resetValue();
            setWatingModalOpen(true);
        } else {
            setFailedModalOpen(true);
        }
    };

    // 지정가 매도 요청
    const designatedSubmit = () => {
        processSellTrade(false, sellingPrice);
    }

    // 시장가 매도 요청
    const marketSubmit = () => {
        processSellTrade(true, selectedCrypto.price);
    }

    return (
        <>
            <CompleteModal
                isModalOpen={completeModalOpen}
                setIsModalOpen={setCompleteModalOpen}
                category="sell" />
            <TradeFailedModal
                isModalOpen={failedModalOpen}
                setIsModalOpen={setFailedModalOpen}
                category="sell" />
            <WaitingModal
                isModalOpen={watingModalOpen}
                setIsModalOpen={setWatingModalOpen}
                category="sell" />
            <NoticeModal
                isModalOpen={isExceedQuantity}
                setIsModalOpen={setIsExceedQuantity}
                content="주문 수량이 화폐 보유량을 초과했습니다." />
            {
                // 매도 - 지정가 영역
                bidSort === '지정가' ?
                    <div className="trading-contents">
                        <TradingThead
                            options={bidSortOptions}
                            selectedValue={bidSort}
                            onChange={setBidSort}
                            label="주문구분" />
                        <table className="trading-table">
                            <tr>
                                <td className='trading-category'>주문가능</td>
                                <td className="trading-available-trade">
                                    {
                                        selectedCrypto.is_owned ?
                                            selectedCrypto.owned_quantity :
                                            0
                                    }
                                    <span>
                                        {
                                            selectedCrypto && selectedCrypto.market ?
                                                (selectedCrypto.market).slice(4) :
                                                null
                                        }
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className='trading-category'>매도가격</td>
                                <td className="td-input">
                                    <TradeInput
                                        value={formatWithComas(sellingInputValue)}
                                        onChange={(e) => sellingPriceChange(e.target.value)}
                                        suffix="KRW" />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <PriceRange
                                        rangeValue={sellingPrice}
                                        onChange={handlePriceRange}
                                        category="sell" />
                                </td>
                            </tr>
                            <tr>
                                <td className='trading-category'>주문수량</td>
                                <td className="td-input">
                                    <TradeInput
                                        value={formatWithComas(quantityInputValue)}
                                        onChange={(e) => orderQuantityChange(e.target.value)}
                                        suffix={selectedCrypto && selectedCrypto.market &&
                                            (selectedCrypto.market).slice(4)} />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className="count-percentage">
                                    <SelectPercentage
                                        percentage={selectedPercentage}
                                        onClick={selectPercentage} />
                                </td>
                            </tr>
                            <tr>
                                <td className='trading-category'>주문총액</td>
                                <td className="td-input">
                                    <TradeInput
                                        value={formatWithComas(totalInputValue)}
                                        onChange={(e) => totalValueChange(e.target.value)}
                                        suffix="KRW" />
                                </td>
                            </tr>
                        </table>
                    </div> :
                    // 매도 - 시장가 영역
                    <div className="trading-contents">
                        <TradingThead
                            options={bidSortOptions}
                            selectedValue={bidSort}
                            onChange={setBidSort}
                            label="주문구분" />
                        <table className="trading-table">
                            <tr>
                                <td className='trading-category'>주문가능</td>
                                <td className="trading-available-trade">
                                    {
                                        selectedCrypto.is_owned ?
                                            selectedCrypto.owned_quantity :
                                            0
                                    }
                                    <span>
                                        {
                                            selectedCrypto && selectedCrypto.market ?
                                                (selectedCrypto.market).slice(4) :
                                                null
                                        }
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className='trading-category'>주문수량</td>
                                <td className="td-input">
                                    <TradeInput
                                        value={formatWithComas(quantityInputValue)}
                                        onChange={(e) => orderQuantityChange(e.target.value)}
                                        suffix={selectedCrypto && selectedCrypto.market &&
                                            (selectedCrypto.market).slice(4)} />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className="count-percentage">
                                    <SelectPercentage
                                        percentage={selectedPercentage}
                                        onClick={selectPercentage} />
                                </td>
                            </tr>
                        </table>
                    </div>
            }
            <div className="trading-footer">
                {
                    user.email ?
                        <div className="trading-submit sell">
                            <span onClick={() => {
                                if (bidSort === '지정가') {
                                    designatedSubmit();
                                } else {
                                    marketSubmit();
                                }
                            }}>매도</span>
                        </div> :
                        <LoginNavigator
                            category="sell" />
                }
            </div>
        </>
    )
}