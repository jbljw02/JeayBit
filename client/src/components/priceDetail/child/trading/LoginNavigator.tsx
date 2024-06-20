import { useNavigate } from "react-router-dom"

export default function LoginNavigator({ category }: { category: string }) {
    const navigate = useNavigate();
    const backgroundColor = category === 'buy' ? '#22ab94' : '#f23645'

    return (
        <div className="trading-submit-nonLogIn">
            <span
                style={{ backgroundColor: backgroundColor }}
                onClick={() => { navigate('/logIn') }}>로그인</span>
            <span
                style={{ backgroundColor: backgroundColor }}
                onClick={() => { navigate('/signUp') }}>회원가입</span>
        </div>
    )
}