import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ChangePrice from "./child/ChangePrice";
import formatWithComas from "../../utils/format/formatWithComas";
import ChangeRate from "./child/ChangeRate";
import Summary from "./child/Summary";
import '../../styles/cryptoDetail/cryptoDetail.css'

export default function CryptoDetail() {
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime)
    const priceClassName = cryptoRealTime.change === 'RISE' ? 'crypto-price-rise' : selectedCrypto.change === 'FALL' ? 'crypto-price-fall' : 'crypto-price-even';

    return (
        <>
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
            <div className="trading-detail">
                {
                    cryptoRealTime && cryptoRealTime.change && (
                        <div className={priceClassName}>
                            {formatWithComas(cryptoRealTime.price)}
                            <ChangeRate />
                            <Summary />
                        </div>
                    )
                }
                {
                    cryptoRealTime && cryptoRealTime.change_price !== undefined && cryptoRealTime.change && (
                        <ChangePrice
                            changePrice={cryptoRealTime.change_price}
                            change={cryptoRealTime.change} />
                    )
                }
            </div>
        </>
    );
}