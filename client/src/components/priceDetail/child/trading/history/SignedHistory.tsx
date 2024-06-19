import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import formatTradeAmount from "../../../../../utils/\bformatTradeAmount";

export default function SignedHistory() {
    const userTradeHistory = useSelector((state: RootState) => state.userTradeHistory);

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
                                <span className="tradingHistory-market">{item.crypto_market}</span>
                                <br />
                                <span className={`tradingHistory-category ${item.trade_category === 'BUY' ? 'asking-buy' : 'asking-sell'}`}>
                                    {item.trade_category === 'BUY' ? '매수' : '매도'}
                                </span>
                            </td>
                            <td>
                                {item.crypto_price.toLocaleString()} <br />
                                {Number(item.trade_price).toLocaleString()}
                            </td>
                            <td>{formatTradeAmount(item.trade_amount)}</td>
                        </tr>
                    );
                })}
        </>
    );
}
