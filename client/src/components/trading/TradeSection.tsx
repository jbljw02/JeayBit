import BuyingSection from "./child/section/BuyingSection";
import SellingSection from "./child/section/SellingSection";
import TradeHistory from "./child/history/TradeHistory";
import { useState } from "react";
import '../../styles/price-detail/trading/tradeSection.css'
import { useAppSelector } from "../../redux/hooks";
import PlaceholderDisplay from "../placeholder/PlaceholderDisplay";
import NavBar from "../common/NavBar";

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

export const tradeNavItems = [
    { label: '매수', color: '#22ab94' },
    { label: '매도', color: '#f23645' },
    { label: '거래내역', color: '#000000' },
];

export type SectionChange = '매수' | '매도' | '거래내역';

export default function TradeSection() {
    const [sectionChange, setSectionChange] = useState<SectionChange>('매수');
    const user = useAppSelector(state => state.user);


    return (
        <div className="trade-section">
            <NavBar
                items={tradeNavItems}
                activeItem={sectionChange}
                onItemClick={(label) => setSectionChange(label as SectionChange)}
                size="large" />
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