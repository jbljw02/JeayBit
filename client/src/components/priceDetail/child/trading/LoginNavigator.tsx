import { useNavigate } from "react-router-dom"

export default function LoginNavigator() {
    const navigate = useNavigate();

    return (
        <div className="trading-submit-nonLogIn-buy market">
            <span onClick={() => { navigate('/logIn') }}>로그인</span>
            <span onClick={() => { navigate('/signUp') }}>회원가입</span>
        </div>
    )
}