import { useAppSelector } from "../../../redux/hooks";
import { useAppDispatch } from "../../../redux/hooks";
import { useEffect, useRef } from "react";
import { setCryptoRealTime } from "../../../redux/features/crypto/selectedCryptoSlice";
import formatWithComas from "../../../utils/format/formatWithComas";

type ChildParams = {
    title: string,
    value: number | string,
    suffix?: string,
    category?: string,
}

function DetailContent({ title, value, suffix, category }: ChildParams) {
    return (
        <dl>
            <dt>{title}</dt>
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

export default function Summary() {
    const dispatch = useAppDispatch();
    const containerRef = useRef<HTMLDivElement>(null);

    const allCrypto = useAppSelector(state => state.allCrypto);
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);

    useEffect(() => {
        const targetCrypto = allCrypto.find(item => item.market === cryptoRealTime.market);
        dispatch(setCryptoRealTime(targetCrypto));
    }, [allCrypto, cryptoRealTime.market, dispatch]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 스크롤 위치에 따른 그라데이션 효과를 처리
        const gradationHandler = () => {
            // 왼쪽으로 스크롤됐는지 확인(스크롤 위치가 0보다 크면 true)
            const isScrolledLeft = container.scrollLeft > 0;
            // 오른쪽으로 스크롤 가능한지 확인(현재 스크롤 위치가 최대 스크롤 가능 너비보다 작으면 true)
            const isScrolledRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);

            // mask-image 속성을 사용하여 그라데이션 효과 적용
            // - 왼쪽 스크롤 시 20px 위치에서 그라데이션 시작
            // - 오른쪽 스크롤 가능 시 끝에서 20px 앞에서 그라데이션 시작
            container.style.maskImage = `
                linear-gradient(
                    to right,
                    transparent,
                    black ${isScrolledLeft ? '20px' : '0px'},
                    black ${isScrolledRight ? 'calc(100% - 20px)' : '100%'},
                    transparent
                )
            `;

            // Safari 
            container.style.webkitMaskImage = container.style.maskImage;
        };

        container.addEventListener('scroll', gradationHandler);
        gradationHandler(); // 초기 실행

        return () => container.removeEventListener('scroll', gradationHandler);
    }, []);

    return (
        <>
            {
                cryptoRealTime.price &&
                <div
                    className="summary-container"
                    ref={containerRef}>
                    <div>
                        <DetailContent
                            title="거래량"
                            value={cryptoRealTime.tradeVolume}
                            suffix={cryptoRealTime.market.slice(4)} />
                        <DetailContent
                            title="시가"
                            value={cryptoRealTime.openPrice} />
                        <DetailContent
                            title="고가"
                            value={cryptoRealTime.highPrice}
                            category="high" />
                    </div>
                    <div>
                        <DetailContent
                            title="거래대금"
                            value={cryptoRealTime.tradePrice}
                            suffix="KRW" />
                        <DetailContent
                            title="종가"
                            value={cryptoRealTime.price} />
                        <DetailContent
                            title="저가"
                            value={cryptoRealTime.lowPrice}
                            category="low" />
                    </div>
                </div>
            }
        </>
    );
}