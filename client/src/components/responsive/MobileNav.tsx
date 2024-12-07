import { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';

export default function MobileNav() {
    const [activeTab, setActiveTab] = useState('list');
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);

        // 각 탭에 해당하는 컴포넌트 표시 로직
        const components = {
            list: document.querySelector('.cryptoList') as HTMLElement,
            detail: document.querySelector('.cryptoDetail') as HTMLElement,
            trade: document.querySelector('.priceDetail') as HTMLElement
        };

        Object.entries(components).forEach(([key, element]) => {
            if (element) {
                element.style.display = key === tab ? 'block' : 'none';
            }
        });
    };

    return (
        <div className="mobile-nav">
            <div
                className={`mobile-nav-item ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => handleTabChange('list')}>
                목록
            </div>
            {selectedCrypto.market && (
                <>
                    <div
                        className={`mobile-nav-item ${activeTab === 'detail' ? 'active' : ''}`}
                        onClick={() => handleTabChange('detail')}>
                        차트
                    </div>
                    <div
                        className={`mobile-nav-item ${activeTab === 'trade' ? 'active' : ''}`}
                        onClick={() => handleTabChange('trade')}>
                        거래
                    </div>
                </>
            )}
        </div>
    );
}