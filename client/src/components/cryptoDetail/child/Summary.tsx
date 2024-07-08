import { useDispatch, useSelector } from "react-redux";
import { RootState, setCryptoRealTime, setSelectedCrypto } from "../../../redux/store";
import formatCryptoDetail from "../../../utils/format/formatCryptoDetail";
import { useEffect } from "react";

type ChildParams = {
    title: string,
    value: number | string,
    suffix?: string,
}

function DetailContent({ title, value, suffix }: ChildParams) {
    return (
        <dt className="lightMode">
            {title}
            <dd className="lightMode-title">
                {formatCryptoDetail(value)}
                {suffix && <span className="lightMode">&nbsp;{suffix}</span>}
            </dd>
        </dt>
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
        <>
            <dl className="selectedDetail_dl_1 lightMode">
                <DetailContent
                    title="거래대금"
                    value={cryptoRealTime.trade_price}
                    suffix="KRW" />
                <DetailContent
                    title="종가"
                    value={cryptoRealTime.price} />
                <DetailContent
                    title="고가"
                    value={cryptoRealTime.high_price} />
            </dl>
            <dl className="selectedDetail_dl_2 lightMode">
                <DetailContent
                    title="거래량"
                    value={cryptoRealTime.trade_volume}
                    suffix={cryptoRealTime.market.slice(4)} />
                <DetailContent
                    title="시가"
                    value={cryptoRealTime.open_price} />
                <DetailContent
                    title="저가"
                    value={cryptoRealTime.low_price} />
            </dl>
        </>
    );
}