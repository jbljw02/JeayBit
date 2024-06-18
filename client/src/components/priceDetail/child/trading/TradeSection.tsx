import { useDispatch, useSelector } from "react-redux";
import { RootState, setSectionChange } from "../../../../redux/store";
import BuyingSection from "./BuyingSection";
import SellingSection from "./SellingSection";
import TradeHistory from "./TradeHistory";

export default function TradeSection() {
    const dispatch = useDispatch();

    const sectionChange = useSelector((state: RootState) => state.sectionChange);
    return (
        <div className="div-trading">
            <div className="trading-section lightMode-title">
                <span
                    className={`${sectionChange === '매수' ?
                        'buyingSection' :
                        ''
                        }`}
                    onClick={() => dispatch(setSectionChange('매수'))}>매수</span>
                <span
                    className={`${sectionChange === '매도' ?
                        'sellingSection' :
                        ''
                        }`}
                    onClick={() => dispatch(setSectionChange('매도'))}>매도</span>
                <span
                    className={`${sectionChange === '거래내역' ?
                        'tradingHistorySection' :
                        ''
                        }`}
                    onClick={() => dispatch(setSectionChange('거래내역'))}>거래내역</span>
            </div>
            {
                sectionChange === '매수' ?
                    <BuyingSection /> :
                    (
                        sectionChange === '매도' ?
                            <SellingSection /> :
                            <TradeHistory />
                    )
            }
        </div>
    )
}