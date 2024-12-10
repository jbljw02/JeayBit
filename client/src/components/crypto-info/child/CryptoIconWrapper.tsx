import { useAppSelector } from "../../../redux/hooks";

export default function CryptoIconWrapper() {
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);

    return (
        <div className="crypto-icon-wrapper">
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
    );
}