import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setBuyingPrice, setIsBuying } from '../../../../redux/store'
import useFunction from "../../../../utils/useFuction";
import adjustInputValue from "../../../../utils/adjustInputValue";
import PriceRange from '../../../input/PriceRange';
import TradeInput from "../../../input/TradeInput";
import SelectPercentage from "./SelectPercentage";
import TradingThead from "./TradingThead";
import LoginNavigator from "./LoginNavigator";
import formatWithComas from "../../../../utils/formatWithComas";

export default function BuyingSection() {
    const dispatch = useDispatch();

    const { addTradeHistory, buyCrypto } = useFunction();

    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const user = useSelector((state: RootState) => state.user);
    const userWallet = useSelector((state: RootState) => state.userWallet);
    const asking_data = useSelector((state: RootState) => state.asking_data);  // bid = 매수, ask = 매도
    const theme = useSelector((state: RootState) => state.theme);
    const buyingPrice = useSelector((state: RootState) => state.buyingPrice);

    const [selectedPercentage, setSelectedPercentage] = useState<string>('');
    const [bidSort, setBidSort] = useState<string>('지정가');

    const [buyTotal, setBuyTotal] = useState<number>(0);
    const [buyQuantity, setBuyQuantity] = useState<number>(0);

    const [buyingInputValue, setBuyingInputValue] = useState('0');
    const [quantityInputValue, setQuantityInputValue] = useState('0');
    const [totalInputValue, setTotalInputValue] = useState('0');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

    // 화폐 거래내역에 '매수'로 저장할지 '매도'로 저장할지를 지정
    const [tradeCategory, setTradeCategory] = useState<string>('매수');

    // 현재 시간을 저장하는 state
    const [time, setTime] = useState(new Date());

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    const completeToggleModal = () => {
        setCompleteModalOpen(!completeModalOpen);
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
    }, [selectedCrypto]);

    const selectPercentage = (percentage: string) => {
        setSelectedPercentage(percentage);

        // 매수가격이 0이면 주문수량/주문총액은 의미가 없으므로 
        if (buyingPrice !== 0) {
            let percentageValue = 0;

            // 주문총액이 구매하려는 화폐 가격에 대해 어느 정도의 비율을 가지는지 계산
            switch (percentage) {
                case '10%':
                    percentageValue = 0.1;
                    break;
                case '25%':
                    percentageValue = 0.25;
                    break;
                case '50%':
                    percentageValue = 0.5;
                    break;
                case '75%':
                    percentageValue = 0.75;
                    break;
                case '100%':
                    percentageValue = 1;
                    break;
                default:
                    return;
            }

            const dividedTotal = userWallet * percentageValue;
            setBuyTotal(Math.floor(dividedTotal));
            setTotalInputValue(Math.floor(dividedTotal).toString());

            let dividedQuantity = dividedTotal / buyingPrice;

            // 소수점 아래 8자리로 제한
            if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
            }

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

        if (buyingPrice !== 0) {
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

    // 지정가 구매 요청
    const designatedSubmit = () => {
        // 호가와 구매가가 일치하는지 확인
        let item = asking_data.find(item => item.ask_price === buyingPrice);
        if (item) {
            // 일치한다면 바로 매수 요청을 전송
            buyCrypto(user.email, selectedCrypto.name, buyQuantity, buyTotal);
            completeToggleModal();
            addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, buyingPrice, buyTotal, buyQuantity, true);
            // getTradeHistory(user.email);
        }
        else {
            // 선택한 화폐에 대한 구매 대기 여부를 true로 설정
            let buyingCrypto = localStorage.getItem(`${user.email}_IsBuying`)
            if (buyingCrypto) {
                let localStorage_isBuying = JSON.parse(buyingCrypto);
                localStorage_isBuying[selectedCrypto.name] = true;
                localStorage.setItem(`${user.email}_IsBuying`, JSON.stringify(localStorage_isBuying));

                dispatch(setIsBuying(localStorage_isBuying))
            }

            // 일치하지 않는다면 대기 모달 팝업
            toggleModal();
            setModalOpen(!modalOpen);

            addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, buyingPrice, buyTotal, buyQuantity, false);
            // getTradeHistory(user.email);
        }
    }

    // 시장가 구매 요청 
    const marketSubmit = () => {
        // 호가와의 일치 여부를 확인하지 않고 즉시 요청 전송
        buyCrypto(user.email, selectedCrypto.name, buyQuantity, buyTotal)
        addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, buyingPrice, buyTotal, buyQuantity, true);
    }

    return (
        <>

            {
                // 매수 - 지정가 영역
                bidSort === '지정가' ?
                    <div className="trading-contents">
                        <TradingThead
                            bidSort={bidSort}
                            onChange={setBidSort} />
                        <table className="trading-table">
                            <tbody>
                                <tr>
                                    <td className="trading-category">주문가능</td>
                                    <td className="trading-availableTrade">{(Number(userWallet).toLocaleString())}
                                        <span>KRW</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="trading-category">매수가격</td>
                                    <td className="td-input">
                                        <div>
                                            <TradeInput
                                                value={(Number(buyingInputValue)).toLocaleString()}
                                                onChange={(e) => buyingPriceChange(e.target.value)} />
                                            <span>KRW</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <PriceRange
                                            rangeValue={buyingPrice}
                                            onChange={handlePriceRange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="trading-category">주문수량</td>
                                    <td className="td-input">
                                        <div>
                                            <TradeInput
                                                value={formatWithComas(quantityInputValue)}
                                                onChange={(e) => orderQuantityChange(e.target.value)} />
                                            <span>
                                                {
                                                    selectedCrypto && selectedCrypto.market ?
                                                        (selectedCrypto.market).slice(4) :
                                                        null
                                                }
                                            </span>
                                        </div>
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
                                    <td className={`trading-category ${theme ? 'darkMode-title' : 'lightMode-title'}`}>주문총액</td>
                                    <td className="td-input">
                                        <div>
                                            <TradeInput
                                                value={formatWithComas(totalInputValue)}
                                                onChange={(e) => totalValueChange(e.target.value)} />
                                            <span>KRW</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> :
                    // 매수 - 시장가 영역
                    <div className="trading-contents">
                        <TradingThead
                            bidSort={bidSort}
                            onChange={setBidSort} />
                        <table className="trading-table">
                            <tr>
                                <td className='trading-category'>주문가능</td>
                                <td className="trading-availableTrade">{(Number(userWallet).toLocaleString())}
                                    <span>KRW</span>
                                </td>
                            </tr>
                            <tr>
                                <td className='trading-category'>주문총액</td>
                                <td className="td-input">
                                    <div>
                                        <TradeInput
                                            value={formatWithComas(totalInputValue)}
                                            onChange={(e) => totalValueChange(e.target.value)} />
                                        <span>KRW</span>
                                    </div>
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
                    user.email !== '' ?
                        <div className="trading-submit-buy market">
                            <span onClick={marketSubmit}>매수</span>
                        </div> :
                        <LoginNavigator />
                }
            </div>
        </>
    )
}