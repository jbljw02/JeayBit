import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ChangePrice from "./ChangePrice";
import formatWithComas from "../../../../utils/format/formatWithComas";
import ChangeRate from "./ChangeRate";
import CryptoDetail from "../CryptoDetail";

export default function CryptoTitle() {
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const priceClassName = selectedCrypto.change === 'RISE' ? 'crypto-price-rise' : selectedCrypto.change === 'FALL' ? 'crypto-price-fall' : 'crypto-price-even';

    return (
        <div className="trading-detail lightMode">
            {
                selectedCrypto && selectedCrypto.change && (
                    <div className={priceClassName}>
                        {formatWithComas(selectedCrypto.price)}
                        <ChangeRate />
                        <CryptoDetail />
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
    );
}