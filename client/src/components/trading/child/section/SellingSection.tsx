import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSellingPrice } from "../../../../redux/features/tradeSlice";
import formatWithComas from "../../../../utils/format/formatWithComas";
import PriceRange from "../../../input/PriceRange";
import TradeInput from "../../../input/TradeInput";
import { bidSortOptions } from "../../TradeSection";
import SelectPercentage from "../SelectPercentage";
import TradingThead from "../TradingThead";
import TradingFooter from "../TradingFooter";
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";
import { useTradeSection } from "../../../../hooks/useTradeSection";
import { useMemo } from "react";

export default function SellingSection() {
    const dispatch = useAppDispatch();
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const ownedCrypto = useAppSelector(state => state.ownedCrypto);
    const sellingPrice = useAppSelector(state => state.sellingPrice);

    const {
        selectedPercentage,
        bidSort,
        quantityInputValue,
        totalInputValue,
        priceInputValue: sellingInputValue,
        setBidSort,
        handlePriceChange: sellingPriceChange,
        handleQuantityChange: orderQuantityChange,
        selectPercentage,
        submitTrade: handleTradeSubmit,
        totalValueChange
    } = useTradeSection({
        tradeType: 'sell',
        price: sellingPrice,
        setPrice: (price) => dispatch(setSellingPrice(price))
    });

    // 현재 선택된 화폐의 보유 정보를 실시간으로 관리
    const targetOwnedCrypto = useMemo(() => {
        return ownedCrypto.find(crypto => crypto.name === selectedCrypto.name) || {
            ...selectedCrypto,
            isOwned: false,
            ownedQuantity: 0,
        };
    }, [ownedCrypto, selectedCrypto]);

    // 지정가 매도 요청
    const designatedSubmit = () => handleTradeSubmit(false, sellingPrice);

    // 시장가 매도 요청
    const marketSubmit = () => handleTradeSubmit(true, selectedCrypto.price);

    // 매도가 슬라이더 
    const handlePriceRange = (value: number) => {
        dispatch(setSellingPrice(value));
    };

    return (
        <>
            {
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
                                        {targetOwnedCrypto?.ownedQuantity || 0}
                                        <span>
                                            {selectedCrypto.market?.slice(4)}
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
                                            suffix={selectedCrypto.market?.slice(4)} />
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
                        </div>
                    </CustomScrollbars> :
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
                                        {targetOwnedCrypto?.ownedQuantity || 0}
                                        <span>{selectedCrypto.market?.slice(4)}</span>
                                    </div>
                                </div>
                                <div className="trading-row">
                                    <div className="trading-title">주문수량</div>
                                    <div className="trading-row-contents">
                                        <TradeInput
                                            value={formatWithComas(quantityInputValue)}
                                            onChange={(e) => orderQuantityChange(e.target.value)}
                                            suffix={selectedCrypto.market?.slice(4)} />
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
    );
}