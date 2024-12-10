import { useAppSelector } from "../../../../redux/hooks";
import formatTradeAmount from "../../../../utils/format/formatTradeAmount";
import formatWithComas from "../../../../utils/format/formatWithComas";

export default function SignedHistory() {
    const userTradeHistory = useAppSelector(state => state.userTradeHistory);
    return (
        <>
            {
                userTradeHistory.map((item, i) => {
                    const isLastItem = i === userTradeHistory.length - 1;
                    return (
                        <tr id={isLastItem ? 'last-row' : ''} key={item.id}>
                            <td>
                                {item.trade_time.slice(0, 10)} <br />
                                {item.trade_time.slice(10)}
                            </td>
                            <td>
                                <div className="trading-history-market">{item.crypto_market}</div>
                                <div className={`trading-history-category ${item.trade_category === 'BUY' ? 'rise' : 'fall'}`}>
                                    {item.trade_category === 'BUY' ? '매수' : '매도'}
                                </div>
                            </td>
                            <td>
                                {formatWithComas(item.crypto_price)} <br />
                                {formatWithComas(item.trade_price)}
                            </td>
                            <td>{formatWithComas(formatTradeAmount(item.trade_amount))}</td>
                        </tr>
                    );
                })}
        </>
    );
}
