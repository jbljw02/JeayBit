import { useNavigate } from "react-router-dom";
import SkeletonUI from "../../components/placeholder/SkeletonUI";
import { useAppSelector } from "../../redux/hooks";
import '../../styles/crypto-info/cryptoHeader.css'

export default function CryptoHeader() {
    const navigate = useNavigate();

    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);
    const allCrypto = useAppSelector(state => state.allCrypto);

    return (
        <>
            {
                allCrypto.length ? (
                    <div className="crypto-header">
                        <svg
                            onClick={() => navigate(-1)}
                            className="back-btn"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 25 25"
                            width="18"
                            height="18"
                            fill="none">
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M17 22.5 6.85 12.35a.5.5 0 0 1 0-.7L17 1.5">
                            </path>
                        </svg>
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