import { useDispatch, useSelector } from "react-redux";
import { RootState, setSelectedCrypto } from "../../../redux/store";
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

export default function CryptoDetail() {
    const dispatch = useDispatch();

    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const allCrypto = useSelector((state: RootState) => state.allCrypto);

    useEffect(() => {
        const targetCrypto = allCrypto.find(item => item.market === selectedCrypto.market);
        dispatch(setSelectedCrypto(targetCrypto));
    }, [allCrypto]);

    return (
        <>
            <dl className="selectedDetail_dl_1 lightMode">
                <DetailContent
                    title="거래대금"
                    value={selectedCrypto.trade_price}
                    suffix="KRW" />
                <DetailContent
                    title="종가"
                    value={selectedCrypto.price} />
                <DetailContent
                    title="고가"
                    value={selectedCrypto.high_price} />
            </dl>
            <dl className="selectedDetail_dl_2 lightMode">
                <DetailContent
                    title="거래량"
                    value={selectedCrypto.trade_volume}
                    suffix={selectedCrypto.market.slice(4)} />
                <DetailContent
                    title="시가"
                    value={selectedCrypto.open_price} />
                <DetailContent
                    title="저가"
                    value={selectedCrypto.low_price} />
            </dl>
        </>
    );
}