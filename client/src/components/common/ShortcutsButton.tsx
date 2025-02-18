import { ReactComponent as StarIcon } from '../../assets/images/star.svg';
import '../../styles/common/shortcutsButton.css';
import useToggleShortcuts from '../../hooks/useToggleShortcuts';
import { Crypto } from '../../redux/features/cryptoListSlice';

type ShortcutsButtonProps = {
    crypto: Crypto;
    isFavorited: boolean;
    iconWidth: number;
}

export default function ShortcutsButton({ crypto, isFavorited, iconWidth }: ShortcutsButtonProps) {
    const { toggleShortcuts } = useToggleShortcuts();

    return (
        <button
            onClick={(e) => { toggleShortcuts(crypto, e) }}
            className="shortcuts-btn">
            <StarIcon
                width={iconWidth}
                height={iconWidth}
                fill={isFavorited ? '#ffa800' : '#dddddd'} />
        </button>
    );
}