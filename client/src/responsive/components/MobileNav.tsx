import { TabType } from "./MobileDetail";
import '../../styles/responsive/mobile/mobileNav.css';

type MobileNavProps = {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
    return (
        <nav className="mobile-nav">
            <span
                className={`${activeTab === "trade" ?
                    "active" :
                    ""}`}
                onClick={() => setActiveTab("trade")}>
                주문
            </span>
            <span
                className={`${activeTab === "chart" ?
                    "active" :
                    ""}`}
                onClick={() => setActiveTab("chart")}>
                차트
            </span>
            <span
                className={`${activeTab === "asking" ?
                    "active" :
                    ""}`}
                onClick={() => setActiveTab("asking")}>
                호가
            </span>
            <span
                className={`${activeTab === "closed" ?
                    "active" :
                    ""}`}
                onClick={() => setActiveTab("closed")}>
                체결
            </span>
        </nav>
    )
}