import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import '../../styles/cryptoDetail/cryptoHeader.css'

export default function CryptoHeader() {
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime);
    return (
        <div className="crypto-name">
            <img
                className="crypto-img"
                src={
                    selectedCrypto && selectedCrypto.market &&
                    (`https://static.upbit.com/logos/${(selectedCrypto.market).slice(4)}.png`)
                }
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
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