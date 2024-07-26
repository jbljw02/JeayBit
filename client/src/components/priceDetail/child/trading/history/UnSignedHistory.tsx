import { useDispatch, useSelector, } from "react-redux";
import formatTradeAmount from "../../../../../utils/format/formatTradeAmount";
import formatWithComas from "../../../../../utils/format/formatWithComas";
import { setScheduledCancel } from "../../../../../redux/features/tradeSlice";
import { RootState } from "../../../../../redux/store";

export default function UnSignedHistory() {
    const dispatch = useDispatch();

    const userTradeHistory_unSigned = useSelector((state: RootState) => state.userTradeHistory_unSigned);
    const scheduledCancel = useSelector((state: RootState) => state.scheduledCancel);

    const clickUnSigned = (id: string, i: number) => {
        // 기존 state에 인덱스가 일치하는 속성이 있는지 확인
        if (scheduledCancel.some(item => item.index === i)) {
            // 있다면, 인덱스가 다른 부분만을 구분하여 새 배열 생성(인덱스를 제거한다는 의미)
            dispatch(setScheduledCancel(scheduledCancel.filter(item => item.index !== i)));
        }
        else {
            // 기존 state에 일치하는 인덱스가 없다면 할당
            dispatch(setScheduledCancel([...scheduledCancel, { id: id, index: i }]));
        }
    }

    return (
        <>
            {
                userTradeHistory_unSigned && Array.isArray(userTradeHistory_unSigned) ? (
                    userTradeHistory_unSigned.map((item, i) => {
                        const isLastItem = i === userTradeHistory_unSigned.length - 1;
                        const isClicked = scheduledCancel.some(cancelItem => cancelItem.index === i);
                        return (
                            <tr
                                key={i}
                                className={`tr-un-signed ${isClicked ? 'un-signed-clicked' : ''}`}
                                id={isLastItem ? 'last-row' : ''}
                                onClick={() => clickUnSigned(item.id, i)}>
                                <td>
                                    {item.trade_time.slice(0, 10)}
                                    <br />
                                    {item.trade_time.slice(10)}
                                </td>
                                <td>
                                    <span className="trading-history-market">{item.crypto_market}</span> <br />
                                    <span className={`trading-history-category ${item.trade_category === 'BUY' ? 'rise' : 'fall'}`}>
                                        {item.trade_category ? (item.trade_category === 'BUY' ? '매수' : '매도') : ''}
                                    </span>
                                </td>
                                <td>
                                    {formatWithComas(item.crypto_price)} <br />
                                    {formatWithComas(item.trade_price)}
                                </td>
                                <td>{formatWithComas(formatTradeAmount(item.trade_amount))}</td>
                            </tr>
                        );
                    })
                ) : null}
        </>
    );
}
