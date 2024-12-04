import { useAppSelector } from "../../redux/hooks";
import '../../styles/cryptoDetail/cryptoHeader.css'

export default function CryptoHeader() {
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);
    return (
        <div className="crypto-name">
            <img
                className="crypto-img"
                src={
                    selectedCrypto && selectedCrypto.market &&
                    (`https://static.upbit.com/logos/${(selectedCrypto.market).slice(4)}.png`)
                }
                alt="" />
            {
                cryptoRealTime && cryptoRealTime.name &&
                cryptoRealTime.name
            }
            <span className="crypto-market">
                {
                    cryptoRealTime && cryptoRealTime.market &&
                    cryptoRealTime.market
                }
            </span>
        </div>
    )
}