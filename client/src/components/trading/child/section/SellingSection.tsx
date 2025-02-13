import { useState, useEffect, useMemo } from "react";
import { showNoticeModal } from "../../../../redux/features/modalSlice";
import { setWorkingSpinner } from "../../../../redux/features/placeholderSlice";
import { setSellingPrice } from "../../../../redux/features/tradeSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import calculatePercentage from "../../../../utils/calculatePercentage";
import adjustInputValue from "../../../../utils/format/adjustInputValue";
import formatWithComas from "../../../../utils/format/formatWithComas";
import limitDecimalPlace from "../../../../utils/format/limitDecimalPlace";
import PriceRange from "../../../input/PriceRange";
import TradeInput from "../../../input/TradeInput";
import { bidSortOptions } from "../../TradeSection";
import SelectPercentage from "../SelectPercentage";
import TradingThead from "../TradingThead";
import TradingFooter from "../TradingFooter";
import useAddTradeHistory from "../../../hooks/useAddTradeHistory";
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";

export default function SellingSectioin() {
    const dispatch = useAppDispatch();

    const addTradeHistory = useAddTradeHistory();

    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const user = useAppSelector(state => state.user);
    const ownedCrypto = useAppSelector(state => state.ownedCrypto);

    const [selectedPercentage, setSelectedPercentage] = useState<string>('');
    const [bidSort, setBidSort] = useState<string>('지정가');

    const sellingPrice = useAppSelector(state => state.sellingPrice);
    const [sellTotal, setSellTotal] = useState<number>(0);
    const [sellQuantity, setSellQuantity] = useState<number>(0);
    const [quantityInputValue, setQuantityInputValue] = useState('0');
    const [totalInputValue, setTotalInputValue] = useState('0');
    const [sellingInputValue, setSellingInputValue] = useState('0');

    // 화폐 거래내역에 '매수'로 저장할지 '매도'로 저장할지를 지정
    const [tradeCategory, setTradeCategory] = useState<string>('매도');

    // 현재 시간을 저장하는 state
    const [time, setTime] = useState(new Date());

    // 현재 선택된 화폐의 보유 정보를 실시간으로 관리
    const targetOwnedCrypto = useMemo(() => {
        return ownedCrypto.find(crypto => crypto.name === selectedCrypto.name) || 
        {
            ...selectedCrypto,
            isOwned: false,
            ownedQuantity: 0,
        };
    }, [ownedCrypto, selectedCrypto]);

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
        const availableQuantity = targetOwnedCrypto?.isOwned ?
            targetOwnedCrypto.ownedQuantity :
            0

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
        if (sellQuantity > targetOwnedCrypto!.ownedQuantity) {
            dispatch(showNoticeModal({ content: '주문 수량이 보유 화폐량을 초과했습니다.' }));
            return;
        }
        if (targetOwnedCrypto!.isOwned === false || targetOwnedCrypto!.ownedQuantity === 0) {
            dispatch(showNoticeModal({ content: '해당 화폐를 보유하고 있지 않습니다.' }));
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

        dispatch(setWorkingSpinner(false));

        // 거래가 즉시 체결 됐을 경우
        if (addTradeResCode === 200) {
            resetValue();
            dispatch(showNoticeModal({
                content: '성공적으로 화폐를 매도했습니다.',
            }));
        }
        // 거래가 대기 중일 경우
        else if (addTradeResCode === 202 && !isMarketValue) {
            resetValue();
            dispatch(showNoticeModal({
                content: '매도 요청이 완료되었습니다. \n' +
                    '요청하신 가격과 일치하는 매수 요청이 발생하면 거래가 완료됩니다.',
            }));
        }
        // 거래 실패 시
        else {
            dispatch(showNoticeModal({
                content: '화폐 매도에 실패했습니다.',
            }));
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
            {
                // 매수 - 지정가 영역
                bidSort === '지정가' ?
                    <CustomScrollbars>
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
                                        {
                                            targetOwnedCrypto?.isOwned ?
                                                targetOwnedCrypto.ownedQuantity
                                                : 0
                                        }
                                        <span>
                                            {
                                                selectedCrypto.market &&
                                                (selectedCrypto.market).slice(4)
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="trading-row">
                                    <div className="trading-title">매도가격</div>
                                    <div className="trading-row-contents">
                                        <TradeInput
                                            value={formatWithComas(sellingInputValue)}
                                            onChange={(e) => sellingPriceChange(e.target.value)}
                                            suffix="KRW" />
                                    </div>
                                </div>
                                <div className="trading-row">
                                    <div className="trading-title" />
                                    <div className="trading-row-contents">
                                        <PriceRange
                                            rangeValue={sellingPrice}
                                            onChange={handlePriceRange}
                                            category="sell" />
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
                                            category="sell" />
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
                        </div >
                    </CustomScrollbars> :
                    // 매수 - 시장가 영역
                    <CustomScrollbars>
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
                                        {
                                            targetOwnedCrypto?.isOwned ?
                                                targetOwnedCrypto.ownedQuantity
                                                : 0
                                        }
                                        <span>
                                            {
                                                selectedCrypto.market &&
                                                (selectedCrypto.market).slice(4)
                                            }
                                        </span>
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
                                            category="sell" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CustomScrollbars>
            }
            <TradingFooter
                bidSort={bidSort}
                designatedSubmit={designatedSubmit}
                marketSubmit={marketSubmit}
                category="sell" />
        </>
    )
}