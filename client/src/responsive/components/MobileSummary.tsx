import { useEffect } from "react";
import { setCryptoRealTime } from "../../redux/features/selectedCryptoSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import formatWithComas from "../../utils/format/formatWithComas";
import checkCurrentScreen from "../../utils/responsive/checkCurrentScreen";

type ChildParams = {
    title: string,
    value: number | string,
    suffix?: string,
    category?: string,
}

function DetailContent({ title, value, suffix, category }: ChildParams) {
    return (
        <dl>
            <dt>
                {title}
            </dt>
            <dd className={`${category === 'high' ? 'dd-high_price' : (
                category === 'low' ? 'dd-low_price' :
                    ''
            )}`}>
                <div>{formatWithComas(value, true)}</div>
                {suffix && <span>&nbsp;{suffix}</span>}
            </dd>
        </dl>
    )
}

export default function MobileSummary() {
    const dispatch = useAppDispatch();

    const allCrypto = useAppSelector(state => state.allCrypto);
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);

    useEffect(() => {
        const targetCrypto = allCrypto.find(item => item.market === cryptoRealTime.market);
        dispatch(setCryptoRealTime(targetCrypto));
    }, [allCrypto, cryptoRealTime.market, dispatch]);

    return (
        <div className="div-dl">
            <div>
                <DetailContent
                    title="거래량"
                    value={cryptoRealTime.trade_volume}
                    suffix={cryptoRealTime.market.slice(4)} />
                <DetailContent
                    title="고가"
                    value={cryptoRealTime.high_price}
                    category="high" />
                <DetailContent
                    title="저가"
                    value={cryptoRealTime.low_price}
                    category="low" />
            </div>
            {/* 모바일 환경에선 두번째 dl 숨김 */}
            {
                checkCurrentScreen() === 'tablet' &&
                <div>
                    <DetailContent
                        title="거래대금"
                        value={cryptoRealTime.trade_price}
                        suffix="KRW" />
                    <DetailContent
                        title="종가"
                        value={cryptoRealTime.price} />
                    <DetailContent
                        title="저가"
                        value={cryptoRealTime.low_price}
                        category="low" />
                </div>
            }
        </div>
    );
}