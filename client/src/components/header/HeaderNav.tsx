import { useNavigate } from "react-router-dom";
import '../../styles/header/headerNav.css'

export default function HeaderNav() {
    const navigate = useNavigate();

    return (
        <header className="header-nav">
            <div className="div-title-nav">
                {/* 이전 페이지로 이동 */}
                <svg
                    onClick={() => navigate(-1)}
                    className="back"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 25 25"
                    width="25"
                    height="25"
                    fill="none">
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="1.2"
                        d="M17 22.5 6.85 12.35a.5.5 0 0 1 0-.7L17 1.5">
                    </path>
                </svg>
                {/* 홈 화면으로 이동 */}
                <svg
                    onClick={() => navigate("/")}
                    className="home"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 25 25"
                    width="25"
                    height="25">
                    <path
                        stroke="currentColor"
                        stroke-width="1.2"
                        d="m1.5 1.5 21 21m0-21-21 21"></path>
                </svg>
            </div>
        </header>
    );
};