import '../../../styles/auth/authButton.css';

export default function AuthButton({ label }: { label: string }) {
    return (
        <button type="submit" className="auth-button">
            {label}
        </button>
    )
}