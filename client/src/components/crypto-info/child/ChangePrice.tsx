import price_rise from '../../../assets/images/price-up.png'
import price_fall from '../../../assets/images/price-down.png'
import formatWithComas from '../../../utils/format/formatWithComas'

type Params = {
    changePrice: number,
    change: string,
}

export default function ChangePrice({ changePrice, change }: Params) {
    const changePriceClassName = `crypto-change_price 
    ${change === 'RISE'
            ? 'rise'
            : (change === 'FALL'
                ? 'fall'
                : 'even'
            )}`;
    const changeImg = change === 'RISE' ?
        price_rise : (
            change === 'FALL' ?
                price_fall :
                null
        )
    const altText = change === 'RISE' ?
        '상승' :
        (
            change === 'FALL' ?
                '하락' :
                ''
        )
    return (
        <div className={changePriceClassName}>
            {
                changeImg &&
                <img
                    className={`img-price_${change.toLowerCase()}`}
                    src={changeImg}
                    alt={altText} />
            }
            {formatWithComas(changePrice)}
        </div>
    );
}