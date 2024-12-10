import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/back-btn.svg';
import '../../styles/common/routeButton.css';

export default function BackButton({ iconWidth }: { iconWidth: number }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="route-btn">
            <BackIcon
                width={iconWidth}
                height={iconWidth} />
        </button>
    )
}