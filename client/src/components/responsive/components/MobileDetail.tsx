import { useState } from 'react';
import Chart from '../../../components/chart/Chart';
import MobileCryptoHeader from './MobileCryptoHeader';
import '../../../styles/responsive/mobile/mobileDetail.css';
import NavBar from '../../../components/common/NavBar';
import CryptoDetail from '../../../components/crypto-info/CryptoDetail';
import AskingPrice from '../../../components/order-book/child/asking/AskingPrice';
import ClosedPrice from '../../../components/order-book/child/closed/ClosedPrice';
import TradeSection from '../../../components/trading/TradeSection';

export type TabType = '주문' | '차트' | '호가' | '체결';

const navItems = [
    { label: '주문', color: '#000000' },
    { label: '차트', color: '#000000' },
    { label: '호가', color: '#000000' },
    { label: '체결', color: '#000000' },
];

export default function MobileDetail() {
    const [activeTab, setActiveTab] = useState<TabType>('차트');

    const renderContent = () => {
        switch (activeTab) {
            case '차트':
                return <Chart />;
            case '호가':
                return <AskingPrice />;
            case '체결':
                return <ClosedPrice />;
            case '주문':
                return <TradeSection />;
            default:
                return null;
        }
    };

    return (
        <div className="mobile-detail">
            <div className="mobile-detail-content">
                <MobileCryptoHeader />
                <CryptoDetail />
                <div className="mobile-content-wrapper">
                    <NavBar
                        items={navItems}
                        activeItem={activeTab}
                        onItemClick={(label) => setActiveTab(label as TabType)}
                        size="medium" />
                    <div className="mobile-tab-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}