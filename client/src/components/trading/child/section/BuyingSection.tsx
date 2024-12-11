import { useState, useEffect } from "react";
import { showNoticeModal, setIsTradeComplete, setIsTradeWaiting, setIsTradeFailed } from "../../../../redux/features/modalSlice";
import { setWorkingSpinner } from "../../../../redux/features/placeholderSlice";
import { setBuyingPrice } from "../../../../redux/features/tradeSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import calculatePercentage from "../../../../utils/calculatePercentage";
import adjustInputValue from "../../../../utils/format/adjustInputValue";
import formatWithComas from "../../../../utils/format/formatWithComas";
import limitDecimalPlace from "../../../../utils/format/limitDecimalPlace";
import PriceRange from "../../../input/PriceRange";
import TradeInput from "../../../input/TradeInput";
import TradeFailedModal from "../../../modal/trade/TradeFailedModal";
import WaitingModal from "../../../modal/trade/WatingModal";
import { bidSortOptions } from "../../TradeSection";
import SelectPercentage from "../SelectPercentage";
import TradingThead from "../TradingThead";
import CompleteModal from '../../../modal/trade/TradeModal'
import TradingFooter from "../TradingFooter";
import useAddTradeHistory from "../../../hooks/useAddTradeHistory";

export default function BuyingSection() {
    const dispatch = useAppDispatch();

    const addTradeHistory = useAddTradeHistory();

    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const user = useAppSelector(state => state.user);
    const buyingPrice = useAppSelector(state => state.buyingPrice);
    const tradeModal = useAppSelector(state => state.tradeModal);

    const [selectedPercentage, setSelectedPercentage] = useState<string>('');
    const [bidSort, setBidSort] = useState<string>('지정가');

    const [buyTotal, setBuyTotal] = useState<number>(0);
    const [buyQuantity, setBuyQuantity] = useState<number>(0);

    const [buyingInputValue, setBuyingInputValue] = useState('0');
    const [quantityInputValue, setQuantityInputValue] = useState('0');
    const [totalInputValue, setTotalInputValue] = useState('0');

    // 화폐 거래내역에 '매수'로 저장할지 '매도'로 저장할지를 지정
    const [tradeCategory, setTradeCategory] = useState<string>('매수');

    // 현재 시간을 저장하는 state
    const [time, setTime] = useState(new Date());

    const resetValue = () => {
        setBuyQuantity(0);
        setQuantityInputValue('0');
        setBuyTotal(0);
        setTotalInputValue('0');
        setSelectedPercentage('');
    }

    // 선택 화폐가 바뀔 때마다 매수 가격을 해당 화폐의 가격으로 변경하고, 주문 수량 및 총액을 초기화
    useEffect(() => {
        // 주문 수량
        setBuyQuantity(0);
        setQuantityInputValue('0');

        // 주문 총액
        setBuyTotal(0);
        setTotalInputValue('0');

        if (selectedCrypto && selectedCrypto.price) {
            dispatch(setBuyingPrice(selectedCrypto.price));
            setBuyingInputValue(String(selectedCrypto.price));
        }
    }, [selectedCrypto, dispatch]);

    const selectPercentage = (percentage: string) => {
        setSelectedPercentage(percentage);

        // 매수가격이 0이면 주문수량/주문총액은 의미가 없으므로 
        if (buyingPrice !== 0) {
            const percentageValue = calculatePercentage(percentage);

            if (percentageValue === 0) return; // 유효하지 않은 퍼센트 값에 대해 함수 종료

            const dividedTotal = user.balance * percentageValue;
            setBuyTotal(Math.floor(dividedTotal));
            setTotalInputValue(Math.floor(dividedTotal).toString());

            let dividedQuantity = dividedTotal / buyingPrice;
            dividedQuantity = limitDecimalPlace(dividedQuantity, 8);

            setBuyQuantity(dividedQuantity);
            setQuantityInputValue(dividedQuantity.toString());
        }
    };

    // 매수 가격 변화 감지
    const buyingPriceChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);

        dispatch(setBuyingPrice(Number(adjustedValue)));
        setBuyingInputValue(adjustedValue);
        setBuyTotal(Math.floor(parseFloat(adjustedValue) * buyQuantity));
        setTotalInputValue((Math.floor(parseFloat(adjustedValue) * buyQuantity)).toString());
    }

    // 매수 가격 슬라이더 
    const handlePriceRange = (value: number) => {
        dispatch(setBuyingPrice(value))
    }

    // 매수가가 바뀌면 그에 따라 입력값도 변경
    useEffect(() => {
        setBuyingInputValue(buyingPrice.toString())

        const adjustedValue = adjustInputValue(buyingInputValue);

        setBuyTotal(Math.floor(parseFloat(adjustedValue) * buyQuantity));
        setTotalInputValue((Math.floor(parseFloat(adjustedValue) * buyQuantity)).toString());
    }, [buyingPrice]);

    // 주문 수량 변화 감지
    const orderQuantityChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);

        const decimalPart = (adjustedValue.split('.')[1] || '').length;

        // 소수점 자릿수가 8자리 이하인 경우만
        if (decimalPart <= 8) {
            setQuantityInputValue(adjustedValue);
            setBuyQuantity(parseFloat(adjustedValue));
        }
        setBuyTotal(Math.floor(buyingPrice * parseFloat(adjustedValue)));
        setTotalInputValue((Math.floor(buyingPrice * parseFloat(adjustedValue))).toString());
    }

    // 주문 총액 변화 감지
    const totalValueChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);

        // 입력값이 숫자인지 확인하고, 숫자 이외의 문자가 포함되어 있는지 확인
        const isNumber = /^[0-9]*$/.test(adjustedValue);

        if (buyingPrice) {
            if (isNumber) {
                setTotalInputValue(adjustedValue);
                setBuyTotal(parseFloat(adjustedValue));

                let dividiedQuantity = Number(adjustedValue) / buyingPrice;

                // 소수점 아래 8자리로 제한
                if ((dividiedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividiedQuantity = parseFloat(dividiedQuantity.toFixed(8));
                }

                setBuyQuantity(dividiedQuantity);
                setQuantityInputValue(dividiedQuantity.toString());
            }
        }
    }

    const tradeSubmit = async (isMarketValue: boolean, price: number) => {
        // 주문총액이 잔고의 잔액을 넘으면 주문을 넣을 수 없음
        if (buyTotal > user.balance) {
            dispatch(showNoticeModal({ content: '주문 총액이 잔고 보유량을 초과했습니다.' }));
            return;
        }

        dispatch(setWorkingSpinner(true));

        const statusCode = await addTradeHistory(
            user.email,
            selectedCrypto.name,
            tradeCategory,
            time,
            selectedCrypto.market,
            price,
            buyTotal,
            buyQuantity,
            selectedCrypto.market,
            isMarketValue
        );

        dispatch(setWorkingSpinner(false));

        // 거래가 즉시 체결 됐을 경우
        if (statusCode === 200) {
            resetValue();
            dispatch(setIsTradeComplete(true));
        }
        // 거래가 대기 중일 경우
        else if (statusCode === 202 && !isMarketValue) {
            resetValue();
            dispatch(setIsTradeWaiting(true));
        }
        // 거래 실패 시
        else {
            dispatch(setIsTradeFailed(true));
        }
    }

    // 지정가 매수 요청
    const designatedSubmit = () => {
        tradeSubmit(false, buyingPrice);
    }

    // 시장가 매수 요청
    const marketSubmit = () => {
        tradeSubmit(true, selectedCrypto.price);
    }

    return (
        <>
            <CompleteModal
                isModalOpen={tradeModal.isComplete}
                setIsModalOpen={() => dispatch(setIsTradeComplete(false))}
                category="buy" />
            <TradeFailedModal
                isModalOpen={tradeModal.isFailed}
                setIsModalOpen={() => dispatch(setIsTradeFailed(false))}
                category="buy" />
            <WaitingModal
                isModalOpen={tradeModal.isWaiting}
                setIsModalOpen={() => dispatch(setIsTradeWaiting(false))}
                category="buy" />
            {
                // 매수 - 지정가 영역
                bidSort === '지정가' ?
                    <div className="trading-contents">
                        <TradingThead
                            options={bidSortOptions}
                            selectedValue={bidSort}
                            onChange={setBidSort}
                            label="주문구분" />
                        <div className="trading-section">
                            <div className="trading-row">
                                <div className="trading-title">주문가능</div>
                                <div className="trading-row-contents">
                                    {formatWithComas(user.balance)}
                                    <span>KRW</span>
                                </div>
                            </div>
                            <div className="trading-row">
                                <div className="trading-title">매수가격</div>
                                <div className="trading-row-contents">
                                    <TradeInput
                                        value={formatWithComas(buyingInputValue)}
                                        onChange={(e) => buyingPriceChange(e.target.value)}
                                        suffix="KRW" />
                                </div>
                            </div>
                            <div className="trading-row">
                                <div className="trading-title" />
                                <div className="trading-row-contents">
                                    <PriceRange
                                        rangeValue={buyingPrice}
                                        onChange={handlePriceRange}
                                        category="buy" />
                                </div>
                            </div>
                            <div className="trading-row">
                                <div className="trading-title">주문수량</div>
                                <div className="trading-row-contents">
                                    <TradeInput
                                        value={formatWithComas(quantityInputValue)}
                                        onChange={(e) => orderQuantityChange(e.target.value)}
                                        suffix={selectedCrypto.market &&
                                            (selectedCrypto.market).slice(4)} />
                                </div>
                            </div>
                            <div className="trading-row">
                                <div className="trading-title" />
                                <div className="trading-row-contents">
                                    <SelectPercentage
                                        percentage={selectedPercentage}
                                        onClick={selectPercentage}
                                        category="buy" />
                                </div>
                            </div>
                            <div className="trading-row">
                                <div className="trading-title">주문총액</div>
                                <div className="trading-row-contents">
                                    <TradeInput
                                        value={formatWithComas(totalInputValue)}
                                        onChange={(e) => totalValueChange(e.target.value)}
                                        suffix="KRW" />
                                </div>
                            </div>
                        </div>
                    </div > :
                    // 매수 - 시장가 영역
                    <div className="trading-contents">
                        <TradingThead
                            options={bidSortOptions}
                            selectedValue={bidSort}
                            onChange={setBidSort}
                            label="주문구분" />
                        <div className="trading-section">
                            <div className="trading-row">
                                <div className="trading-title">주문가능</div>
                                <div className="trading-row-contents">
                                    {formatWithComas(user.balance)}
                                    <span>KRW</span>
                                </div>
                            </div>
                            <div className="trading-row">
                                <div className="trading-title">주문총액</div>
                                <div className="trading-row-contents">
                                    <TradeInput
                                        value={formatWithComas(totalInputValue)}
                                        onChange={(e) => totalValueChange(e.target.value)}
                                        suffix="KRW" />
                                </div>
                            </div>
                            <div className="trading-row">
                                <div className="trading-title" />
                                <div className="trading-row-contents">
                                    <SelectPercentage
                                        percentage={selectedPercentage}
                                        onClick={selectPercentage}
                                        category="buy" />
                                </div>
                            </div>
                        </div>
                    </div>
            }
            <TradingFooter
                bidSort={bidSort}
                designatedSubmit={designatedSubmit}
                marketSubmit={marketSubmit}
                category="buy" />
        </>
    )
}