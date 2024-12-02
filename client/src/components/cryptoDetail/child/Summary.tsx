import { useAppSelector } from "../../../redux/hooks";
import { useAppDispatch } from "../../../redux/hooks";
import formatCryptoDetail from "../../../utils/format/formatCryptoDetail";
import { useEffect } from "react";
import { setCryptoRealTime } from "../../../redux/features/selectedCryptoSlice";

type ChildParams = {
    title: string,
    value: number | string,
    suffix?: string,
    category?: string,
}

function DetailContent({ title, value, suffix, category }: ChildParams) {
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
    const dispatch = useAppDispatch();

    const allCrypto = useAppSelector(state => state.allCrypto);
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);

    useEffect(() => {
        const targetCrypto = allCrypto.find(item => item.market === cryptoRealTime.market);
        dispatch(setCryptoRealTime(targetCrypto));
    }, [allCrypto, cryptoRealTime.market, dispatch]);

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