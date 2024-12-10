import '../../styles/header/headerNav.css'
import BackButton from "../common/BackButton";
import HomeButton from "../common/HomeButton";

export default function HeaderNav() {
    return (
        <header className="header-nav">
            {/* 이전 페이지로 이동 */}
            <BackButton iconWidth={20} />
            {/* 홈 화면으로 이동 */}
            <HomeButton iconWidth={20} />
        </header>
    );
};