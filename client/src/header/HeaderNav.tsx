import { useNavigate } from "react-router-dom";

export default function HeaderNav() {
    const navigate = useNavigate();

    return (
        <header className="header-nav lightMode-title">
            {/* 제목 폰트를 사용하기 위한 구글 폰트 api */}
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Hind&display=swap');
            </style>
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Roboto+Flex&display=swap');
            </style>
            <div className="div-title-nav">
                {/* 이전 페이지로 이동 */}
                <svg
                    onClick={() => navigate(-1)}
                    className="backButton"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 25 25"
                    width="25"
                    height="25"
                    fill="none">
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="1.2"
                        d="M17 22.5 6.85 12.35a.5.5 0 0 1 0-.7L17 1.5"
                    ></path>
                </svg>

                {/* 홈 화면으로 이동 */}
                <svg
                    onClick={() => navigate("/")}
                    className="closeButton"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 25 25"
                    width="25"
                    height="25">
                    <path
                        stroke="currentColor"
                        stroke-width="1.2"
                        d="m1.5 1.5 21 21m0-21-21 21"
                    ></path>
                </svg>
            </div>
        </header>
    );
};