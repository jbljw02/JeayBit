import SkeletonUI from "../../../components/placeholder/SkeletonUI";
import { useAppSelector } from "../../../redux/hooks";
import '../../../styles/crypto-info/cryptoHeader.css'
import CryptoIconWrapper from "../../../components/crypto-info/child/CryptoIconWrapper";
import ShortcutsButton from "../../../components/common/ShortcutsButton";
import BackButton from "../../../components/common/BackButton";

export default function CryptoHeader() {
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const allCrypto = useAppSelector(state => state.allCrypto);
    const favoriteCrypto = useAppSelector(state => state.favoriteCrypto);

    return (
        <>
            {
                allCrypto.length ? (
                    <div className="crypto-header">
                        <div className="back-btn-container">
                            <BackButton iconWidth={17} />
                        </div>
                        <CryptoIconWrapper />
                        <div className="shortcuts-btn-container">
                            <ShortcutsButton
                                crypto={selectedCrypto}
                                isFavorited={favoriteCrypto.find(fav => fav.name === selectedCrypto.name) ? true : false}
                                iconWidth={22} />
                        </div>
                    </div >
                ) :
                    <div className="crypto-header-skeleton">
                        <SkeletonUI
                            containerHeight="100%"
                            elementsHeight={35}
                            counts={1} />
                    </div>
            }
        </>
    );
}