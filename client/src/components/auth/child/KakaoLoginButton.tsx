import kakaoLogo from "../../../assets/images/kakao-login.png";
import kakaoLogin from "../../../utils/auth/kakaoLogin";
import '../../../styles/auth/kakaoLoginButton.css'

export default function KakaoLoginButton() {
    return (
        <button
            className="kakao-login-button"
            onClick={kakaoLogin}>
            <img
                src={kakaoLogo}
                alt="카카오 계정으로 로그인" />
            <div>카카오 계정으로 로그인</div>
        </button>
    )
}