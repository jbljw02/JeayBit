import { useAppSelector } from "../../redux/hooks";
import ChangePrice from "./child/ChangePrice";
import formatWithComas from "../../utils/format/formatWithComas";
import ChangeRate from "./child/ChangeRate";
import Summary from "./child/Summary";
import '../../styles/cryptoDetail/cryptoDetail.css'
import SkeletonUI from "../placeholder/SkeletonUI";

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
                    <div className="crypto-detail">
                        {
                            cryptoRealTime && cryptoRealTime.change && (
                                <div className={priceClassName}>
                                    {formatWithComas(cryptoRealTime.price)}
                                    <ChangeRate />
                                    {
                                        cryptoRealTime && cryptoRealTime.change_price !== undefined && cryptoRealTime.change && (
                                            <ChangePrice
                                                changePrice={cryptoRealTime.change_price}
                                                change={cryptoRealTime.change} />
                                        )
                                    }
                                </div>
                            )
                        }
                        <Summary />
                    </div> :
                    <div className="crypto-detail-skeleton">
                        <SkeletonUI
                            containerHeight="100%" elementsHeight={25} counts={4} />
                    </div>
            }
        </>
    );
}