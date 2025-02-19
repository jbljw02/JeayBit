import { setBuyingPrice } from "../../../../redux/features/trade/tradeSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import formatWithComas from "../../../../utils/format/formatWithComas";
import PriceRange from "../../../input/PriceRange";
import TradeInput from "../../../input/TradeInput";
import { bidSortOptions } from "../../TradeSection";
import SelectPercentage from "../SelectPercentage";
import TradingThead from "../TradingThead";
import TradingFooter from "../TradingFooter";
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";
import useTradeSection from "../../../../hooks/trade/useTradeSection";

export default function BuyingSection() {
    const dispatch = useAppDispatch();

    const buyingPrice = useAppSelector(state => state.buyingPrice);
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const user = useAppSelector(state => state.user);

    const {
        selectedPercentage,
        bidSort,
        quantityInputValue,
        totalInputValue,
        priceInputValue,
        setBidSort,
        handlePriceChange,
        handleQuantityChange,
        selectPercentage,
        submitTrade: handleTradeSubmit,
        totalValueChange
    } = useTradeSection({
        tradeType: 'buy',
        price: buyingPrice,
        setPrice: (price) => dispatch(setBuyingPrice(price))
    });

    // 지정가 매수 요청
    const designatedSubmit = () => handleTradeSubmit(false, buyingPrice);

    // 시장가 매수 요청
    const marketSubmit = () => handleTradeSubmit(true, selectedCrypto.price);

    return (
        <>
            {
                // 매도 - 지정가 영역
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
                                        {formatWithComas(user.balance)}
                                        <span>KRW</span>
                                    </div>
                                </div>
                                <div className="trading-row">
                                    <div className="trading-title">매수가격</div>
                                    <div className="trading-row-contents">
                                        <TradeInput
                                            value={formatWithComas(priceInputValue)}
                                            onChange={(e) => handlePriceChange(e.target.value)}
                                            suffix="KRW" />
                                    </div>
                                </div>
                                <div className="trading-row">
                                    <div className="trading-title" />
                                    <div className="trading-row-contents">
                                        <PriceRange
                                            rangeValue={buyingPrice}
                                            onChange={() => dispatch(setBuyingPrice(buyingPrice))}
                                            category="buy" />
                                    </div>
                                </div>
                                <div className="trading-row">
                                    <div className="trading-title">주문수량</div>
                                    <div className="trading-row-contents">
                                        <TradeInput
                                            value={formatWithComas(quantityInputValue)}
                                            onChange={(e) => handleQuantityChange(e.target.value)}
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
                        </div>
                    </CustomScrollbars> :
                    // 매도 - 시장가 영역
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
                    </CustomScrollbars>
            }
            <TradingFooter
                bidSort={bidSort}
                designatedSubmit={designatedSubmit}
                marketSubmit={marketSubmit}
                category="buy" />
        </>
    )
}