import { useAppSelector } from "../../../redux/hooks";

export default function CryptoIconWrapper() {
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);

    return (
        <div className="crypto-icon-wrapper">
            <img
                className="crypto-img"
                src={`https://static.upbit.com/logos/${selectedCrypto.market ? (selectedCrypto.market).slice(4) : 'BTC'}.png`}
                alt={selectedCrypto.name} />
            {selectedCrypto.name || '비트코인'}
            <span className="crypto-market">
                {selectedCrypto.market || 'KRW-BTC'}
            </span>
        </div>
    );
}