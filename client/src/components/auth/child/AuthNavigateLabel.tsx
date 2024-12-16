import { useNavigate } from "react-router-dom";

type AuthNavigateLabelProps = {
    label: string,
    navigateString: string,
    destinationLabel: string,
}

export default function AuthNavigateLabel({ label, navigateString, destinationLabel }: AuthNavigateLabelProps) {
    const navigate = useNavigate();

    return (
        <div className="auth-navigate">
            <span>{label}</span>
            <span
                className="auth-navigate-destination"
                onClick={() => navigate(navigateString)}>
                {destinationLabel}
            </span>
        </div>
    )
}