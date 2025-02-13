import { useAppSelector } from "../../../../redux/hooks";
import formatTradeAmount from "../../../../utils/format/formatTradeAmount";
import formatWithComas from "../../../../utils/format/formatWithComas";

export default function SignedHistory() {
    const tradeHistory = useAppSelector(state => state.tradeHistory);
    return (
        <>
            {
                tradeHistory.map((item, i) => {
                    const isLastItem = i === tradeHistory.length - 1;
                    return (
                        <tr id={isLastItem ? 'last-row' : ''} key={item.id}>
                            <td>
                                {item.tradeTime.slice(0, 10)} <br />
                                {item.tradeTime.slice(10)}
                            </td>
                            <td>
                                <div className="trading-history-market">{item.cryptoMarket}</div>
                                <div className={`trading-history-category ${item.tradeCategory === 'BUY' ? 'rise' : 'fall'}`}>
                                    {item.tradeCategory === 'BUY' ? '매수' : '매도'}
                                </div>
                            </td>
                            <td>
                                {formatWithComas(item.cryptoPrice)} <br />
                                {formatWithComas(item.tradePrice)}
                            </td>
                            <td>{formatWithComas(formatTradeAmount(item.tradeAmount))}</td>
                        </tr>
                    );
                })}
        </>
    );
}
