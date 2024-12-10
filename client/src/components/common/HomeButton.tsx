import { useNavigate } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../../assets/images/home-btn.svg';
import '../../styles/common/routeButton.css';

export default function HomeButton({ iconWidth }: { iconWidth: number }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/')}
            className="route-btn">
            <HomeIcon
                width={iconWidth}
                height={iconWidth} />
        </button>
    )
}