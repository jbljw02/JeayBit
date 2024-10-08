import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ChangePrice from "./child/ChangePrice";
import formatWithComas from "../../utils/format/formatWithComas";
import ChangeRate from "./child/ChangeRate";
import Summary from "./child/Summary";
import '../../styles/cryptoDetail/cryptoDetail.css'
import SkeletonUI from "../placeholder/SkeletonUI";

export default function CryptoDetail() {
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime);
    const allCrypto = useSelector((state: RootState) => state.allCrypto);

    const priceClassName = `crypto-price 
    ${cryptoRealTime.change === 'RISE'
            ? 'rise' : (
                cryptoRealTime.change === 'FALL'
                    ? 'fall'
                    : 'even'
            )}`;

    return (
        <>
            {
                allCrypto.length ?
                    <div className="trading-detail">
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
                    <div style={{ height: '134px', padding: '4px 5px 17px 5px' }}>
                        <SkeletonUI
                            containerHeight="100%" elementsHeight={25} counts={4} />
                    </div>
            }
        </>
    );
}