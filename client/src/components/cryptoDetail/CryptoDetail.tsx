import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ChangePrice from "./child/ChangePrice";
import formatWithComas from "../../utils/format/formatWithComas";
import ChangeRate from "./child/ChangeRate";
import Summary from "./child/Summary";

export default function CryptoDetail() {
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const priceClassName = selectedCrypto.change === 'RISE' ? 'crypto-price-rise' : selectedCrypto.change === 'FALL' ? 'crypto-price-fall' : 'crypto-price-even';

    return (
        <>
            <div className="crypto-name lightMode-title">
                <img
                    className="crypto-img"
                    src={
                        selectedCrypto && selectedCrypto.market &&
                        (`https://static.upbit.com/logos/${(selectedCrypto.market).slice(4)}.png`)
                    }
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    alt="" />
                {
                    selectedCrypto && selectedCrypto.name &&
                    selectedCrypto.name
                }
                <span className="crypto-market lightMode">
                    {
                        selectedCrypto && selectedCrypto.market &&
                        selectedCrypto.market
                    }
                </span>
            </div>
            <div className="trading-detail lightMode">
                {
                    selectedCrypto && selectedCrypto.change && (
                        <div className={priceClassName}>
                            {formatWithComas(selectedCrypto.price)}
                            <ChangeRate />
                            <Summary />
                        </div>
                    )
                }
                {
                    selectedCrypto && selectedCrypto.change_price !== undefined && selectedCrypto.change && (
                        <ChangePrice
                            changePrice={selectedCrypto.change_price}
                            change={selectedCrypto.change} />

                    )
                }
            </div>
        </>
    );
}