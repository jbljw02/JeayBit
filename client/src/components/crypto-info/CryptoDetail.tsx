import { useAppSelector } from "../../redux/hooks";
import ChangePrice from "./child/ChangePrice";
import formatWithComas from "../../utils/format/formatWithComas";
import ChangeRate from "./child/ChangeRate";
import Summary from "./child/Summary";
import '../../styles/crypto-info/cryptoDetail.css'
import SkeletonUI from "../placeholder/SkeletonUI";

export default function CryptoDetail() {
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);

    const priceClassName = `crypto-price-container ${cryptoRealTime.change === 'RISE' ? 'rise' :
        cryptoRealTime.change === 'FALL' ? 'fall' : 'even'
        }`;

    return (
        <>
            {
                cryptoRealTime.price ?
                    <div className="crypto-detail">
                        {
                            <div className={priceClassName}>
                                <div className="crypto-price">
                                    {formatWithComas(cryptoRealTime.price)}
                                </div>
                                <div className="crypto-change">
                                    <ChangePrice
                                        changePrice={cryptoRealTime.changePrice}
                                        change={cryptoRealTime.change} />
                                    <ChangeRate />
                                </div>
                            </div>
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