import { setScheduledCancel } from "../../../../redux/features/trade/tradeSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import formatTradeAmount from "../../../../utils/format/formatTradeAmount";
import formatWithComas from "../../../../utils/format/formatWithComas";

export default function UnSignedHistory() {
    const dispatch = useAppDispatch();

    const unSignedTradeHistory = useAppSelector(state => state.unSignedTradeHistory);
    const scheduledCancel = useAppSelector(state => state.scheduledCancel);

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
                unSignedTradeHistory && Array.isArray(unSignedTradeHistory) ? (
                    unSignedTradeHistory.map((item, i) => {
                        const isLastItem = i === unSignedTradeHistory.length - 1;
                        const isClicked = scheduledCancel.some(cancelItem => cancelItem.index === i);
                        return (
                            <tr
                                key={i}
                                className={`tr-un-signed ${isClicked ? 'un-signed-clicked' : ''}`}
                                id={isLastItem ? 'last-row' : ''}
                                onClick={() => clickUnSigned(item.id, i)}>
                                <td>
                                    {item.tradeTime.slice(0, 10)}
                                    <br />
                                    {item.tradeTime.slice(10)}
                                </td>
                                <td>
                                    <span className="trading-history-market">{item.cryptoMarket}</span> <br />
                                    <span className={`trading-history-category ${item.tradeCategory === 'BUY' ? 'rise' : 'fall'}`}>
                                        {item.tradeCategory ? (item.tradeCategory === 'BUY' ? '매수' : '매도') : ''}
                                    </span>
                                </td>
                                <td>
                                    {formatWithComas(item.cryptoPrice)} <br />
                                    {formatWithComas(item.tradePrice)}
                                </td>
                                <td>{formatWithComas(formatTradeAmount(item.tradeAmount))}</td>
                            </tr>
                        );
                    })
                ) : null}
        </>
    );
}
