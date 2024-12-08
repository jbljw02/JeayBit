import { useState } from 'react';
import Chart from '../../components/chart/Chart';
import CryptoHeader from '../../components/crypto-info/CryptoHeader';
import CryptoDetail from '../../components/crypto-info/CryptoDetail';
import MobileAskingPrice from './MobileAskingPrice';
import MobileClosedPrice from './MobileClosedPrice';
import MobileTradeSection from './MobileTradeSection';
import MobileNav from './MobileNav';
import MobileCryptoDetail from './MobileCryptoDetail';
import MobileCryptoHeader from './MobileCryptoHeader';
import '../../styles/responsive/mobile/mobileDetail.css';

export type TabType = 'chart' | 'asking' | 'closed' | 'trade';

export default function MobileDetail() {
    const [activeTab, setActiveTab] = useState<TabType>('chart');

    const renderContent = () => {
        switch (activeTab) {
            case 'chart':
                return <Chart />;
            case 'asking':
                return <MobileAskingPrice />;
            case 'closed':
                return <MobileClosedPrice />;
            case 'trade':
                return <MobileTradeSection />;
            default:
                return null;
        }
    };

    return (
        <div className="mobile-detail">
            <div className="mobile-detail-content">
                <MobileCryptoHeader />
                <MobileCryptoDetail />
                <div className="mobile-content-wrapper">
                    <MobileNav
                        activeTab={activeTab}
                        setActiveTab={setActiveTab} />
                    <div className="mobile-tab-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}