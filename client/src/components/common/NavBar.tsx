import '../../styles/common/navBar.css';

interface NavItem {
    label: string;
    color: string;
}

interface NavBarProps {
    items: NavItem[];
    activeItem: string;
    onItemClick: (id: string) => void;
    size?: 'small' | 'large';
}

export default function NavBar({
    items,
    activeItem,
    onItemClick,
    size = 'large',
}: NavBarProps) {
    return (
        <nav className='nav-bar'>
            {
                items.map((item) => (
                    <span
                        key={item.label}
                        className={`nav-item size-${size} 
                            ${activeItem === item.label ? 'active' : ''}`}
                        onClick={() => onItemClick(item.label)}
                        style={{
                            color: activeItem === item.label ? item.color : '#707a8a',
                        }}>
                        {item.label}
                    </span>
                ))}
        </nav>
    );
};