import { useState } from "react";
import PlaceholderDisplay from "../../components/placeholder/PlaceholderDisplay";
import { useAppSelector } from "../../redux/hooks";
import '../../styles/price-detail/trading/tradeSection.css';
import TradeHistory from "../../components/trading/child/history/TradeHistory";
import BuyingSection from "../../components/trading/child/section/BuyingSection";
import SellingSection from "../../components/trading/child/section/SellingSection";
import { SectionChange, tradeNavItems } from "../../components/trading/TradeSection";
import NavBar from "../../components/common/NavBar";

export type CeleryData = {
    name: string,
    tradeTime: Date | string,
    tradeCategory: string,
    price: number,
}

export const bidSortOptions = [
    { id: 'radio1', value: '지정가', label: '지정가' },
    { id: 'radio2', value: '시장가', label: '시장가' },
];

export default function MobileTradeSection() {
    const [sectionChange, setSectionChange] = useState<'매수' | '매도' | '거래내역'>('매수');
    const user = useAppSelector(state => state.user);

    return (
        <div className="trade-section">
            <NavBar
                items={tradeNavItems}
                activeItem={sectionChange}
                onItemClick={(label) => setSectionChange(label as SectionChange)}
                size="small" />
            {
                sectionChange === '매수' ?
                    <BuyingSection /> :
                    (
                        sectionChange === '매도' ?
                            <SellingSection /> :
                            (
                                user.name && user.email ?
                                    <TradeHistory /> :
                                    <PlaceholderDisplay content="로그인 후 확인하실 수 있습니다." />
                            )
                    )
            }
        </div>
    )
}