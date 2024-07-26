import { useDispatch, useSelector } from "react-redux";
import formatCryptoDetail from "../../../utils/format/formatCryptoDetail";
import { useEffect } from "react";
import { RootState } from "../../../redux/store";
import { setCryptoRealTime } from "../../../redux/features/selectedCryptoSlice";

type ChildParams = {
    title: string,
    value: number | string,
    suffix?: string,
    category?: string,
}

function DetailContent({ title, value, suffix, category }: ChildParams) {
    const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime);

    return (
        <>
            {
                <dt>
                    {title}
                    <dd className={`${category === 'high' ? 'dd-high_price' : (
                        category === 'low' ? 'dd-low_price' :
                            ''
                    )}`}>
                        {formatCryptoDetail(value)}
                        {suffix && <span>&nbsp;{suffix}</span>}
                    </dd>
                </dt>
            }
        </>
    )
}

export default function Summary() {
    const dispatch = useDispatch();

    const allCrypto = useSelector((state: RootState) => state.allCrypto);
    const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime);

    useEffect(() => {
        const targetCrypto = allCrypto.find(item => item.market === cryptoRealTime.market);
        dispatch(setCryptoRealTime(targetCrypto));
    }, [allCrypto]);

    return (
        <div className="div-dl">
            <dl>
                <DetailContent
                    title="거래대금"
                    value={cryptoRealTime.trade_price}
                    suffix="KRW" />
                <DetailContent
                    title="종가"
                    value={cryptoRealTime.price} />
                <DetailContent
                    title="고가"
                    value={cryptoRealTime.high_price}
                    category="high" />
            </dl>
            <dl className="first-dl">
                <DetailContent
                    title="거래량"
                    value={cryptoRealTime.trade_volume}
                    suffix={cryptoRealTime.market.slice(4)} />
                <DetailContent
                    title="시가"
                    value={cryptoRealTime.open_price} />
                <DetailContent
                    title="저가"
                    value={cryptoRealTime.low_price}
                    category="low" />
            </dl>
        </div>
    );
}