import '../../styles/common/commonButton.css';

type CommonButtonProps = {
    label: string;
    category: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
}

export default function CommonButton({ label, onClick, category, type = 'button' }: CommonButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`common-button ${category}`}>
            <span>{label}</span>
        </button>
    )
}