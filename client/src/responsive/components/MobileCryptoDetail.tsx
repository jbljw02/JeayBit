import ChangePrice from "../../components/crypto-info/child/ChangePrice";
import ChangeRate from "../../components/crypto-info/child/ChangeRate";
import Summary from "../../components/crypto-info/child/Summary";
import SkeletonUI from "../../components/placeholder/SkeletonUI";
import { useAppSelector } from "../../redux/hooks";
import formatWithComas from "../../utils/format/formatWithComas";
import MobileSummary from "./MobileSummary";

export default function CryptoDetail() {
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);
    const allCrypto = useAppSelector(state => state.allCrypto);

    const priceClassName = `crypto-price ${cryptoRealTime.change === 'RISE' ? 'rise' :
        cryptoRealTime.change === 'FALL' ? 'fall' : 'even'
        }`;

    return (
        <>
            {
                allCrypto.length ?
                    <div className="trading-detail">
                        {
                            cryptoRealTime && cryptoRealTime.change && (
                                <div className={priceClassName}>
                                    {formatWithComas(cryptoRealTime.price)}
                                    <div>
                                        {
                                            cryptoRealTime && cryptoRealTime.change_price !== undefined && cryptoRealTime.change && (
                                                <ChangePrice
                                                    changePrice={cryptoRealTime.change_price}
                                                    change={cryptoRealTime.change} />
                                            )
                                        }
                                        <ChangeRate />
                                    </div>
                                </div>
                            )
                        }
                        <MobileSummary />
                    </div> :
                    <div className="crypto-detail-skeleton">
                        <SkeletonUI
                            containerHeight="100%" elementsHeight={25} counts={4} />
                    </div>
            }
        </>
    );
}