import { useAppSelector } from "../../redux/hooks";
import '../../styles/crypto-info/cryptoHeader.css'
import SkeletonUI from "../placeholder/SkeletonUI";
import CryptoIconWrapper from "./child/\bCryptoIconWrapper";

export default function CryptoHeader() {
    const allCrypto = useAppSelector(state => state.allCrypto);

    return (
        <>
            {
                allCrypto.length ? (
                    <div className="crypto-header">
                        <CryptoIconWrapper />
                    </div>
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