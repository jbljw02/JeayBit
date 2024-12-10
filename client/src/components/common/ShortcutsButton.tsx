import { ReactComponent as StarIcon } from '../../assets/images/star.svg';
import '../../styles/common/shortcutsButton.css';
import useToggleShortcuts from '../../components/hooks/useToggleShortcuts';
import { useAppSelector } from '../../redux/hooks';

type ShortcutsButtonProps = {
    isFavorited: boolean;
    iconWidth: number;
}

export default function ShortcutsButton({ isFavorited, iconWidth }: ShortcutsButtonProps) {
    const { toggleShortcuts } = useToggleShortcuts();
    
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);

    return (
        <button
            onClick={(e) => { toggleShortcuts(selectedCrypto, e) }}
            className="shortcuts-btn">
            <StarIcon
                width={iconWidth}
                height={iconWidth}
                fill={isFavorited ? '#ffa800' : '#dddddd'} />
        </button>
    );
}