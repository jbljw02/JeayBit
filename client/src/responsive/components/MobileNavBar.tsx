import { useNavigate, useLocation } from 'react-router-dom';

type NavItem = {
    id: string;
    label: string;
    path: string;
};

const NAV_ITEMS: NavItem[] = [
    { id: 'chart', label: '차트', path: '/detail' },
    { id: 'price', label: '호가', path: '/detail/price' },
    { id: 'trade', label: '체결', path: '/detail/trade' },
    { id: 'order', label: '주문', path: '/detail/order' }
];

export default function MobileNavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="mobile-nav-bar">
            {NAV_ITEMS.map((item) => (
                <button
                    key={item.id}
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    );
}