import { useNavigate } from "react-router-dom"
import '../../../styles/auth/authFooter.css'

type AuthFooterProps = {
    label: string,
    navigateString: string,
}

export default function AuthFooter({ label, navigateString }: AuthFooterProps) {
    const navigate = useNavigate();
    return (
        <div className="auth-footer">
            <span onClick={() => navigate(navigateString)}>{label}</span>
        </div>
    )
}