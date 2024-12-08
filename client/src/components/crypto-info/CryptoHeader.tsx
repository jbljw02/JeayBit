import { useAppSelector } from "../../redux/hooks";
import '../../styles/crypto-info/cryptoHeader.css'
import SkeletonUI from "../placeholder/SkeletonUI";

export default function CryptoHeader() {
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);
    const allCrypto = useAppSelector(state => state.allCrypto);

    return (
        <>
            {
                allCrypto.length ? (
                    <div className="crypto-header">
                        <img
                            className="crypto-img"
                            src={selectedCrypto?.market &&
                                `https://static.upbit.com/logos/${selectedCrypto.market.slice(4)}.png`}
                            alt="" />
                        {cryptoRealTime?.name}
                        <span className="crypto-market">
                            {cryptoRealTime?.market}
                        </span>
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