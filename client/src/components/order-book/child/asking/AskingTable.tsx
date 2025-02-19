import convertToDate from "../../../../utils/format/covertToDate";
import adjustSize from "../../../../utils/format/adjustSize";
import { useAppSelector } from "../../../../redux/hooks";
import { AskingData } from "../../../../types/crypto.type";

type Params = {
    differences: {
        newAskPrice?: number,
        newAskSize?: number,
        newBidPrice?: number,
        newBidSize?: number,
    }[],
    size: number,
    category: string,
}

export default function AskingTable({ differences, size, category }: Params) {
    const askingData = useAppSelector(state => state.askingData);

    // 이전 호가와 현재 호가를 비교한 값을 이용 - 변경된 호가가 현재 state를 순회하면서 일치하는 값에 대해서 스타일 지정
    const isChange = (item: AskingData) => {
        if (category === 'bid') {
            return differences.some((value) => value.newBidSize === item.bidSize);
        }
        return differences.some((value) => value.newAskSize === item.askSize);
    }

    const getStyleClass = (isChange: boolean) => {
        if (category === 'bid') {
            return isChange ? 'change-bid' : '';
        }
        return isChange ? 'change-ask' : '';
    }

    const getPercentage = (item: AskingData) => {
        if (category === 'bid') {
            return (item.bidSize / size) * 100;
        }
        return (item.askSize / size) * 100;
    }

    const getStrSize = (item: AskingData) => {
        if (category === 'bid') {
            return adjustSize(item.bidSize);
        }
        return adjustSize(item.askSize);
    }

    return (
        <>
            {
                askingData.map((item, i) => {
                    const change = isChange(item);
                    const styleClass = getStyleClass(change);
                    const percentage = getPercentage(item);
                    const trade_time = convertToDate(item.timestamp);
                    const str_size = getStrSize(item);
                    return (
                        <tr key={i}>
                            <td>{trade_time}</td>
                            {
                                category === 'bid' ?
                                    <td>{(item.bidPrice).toLocaleString()}</td> :
                                    <td>{(item.askPrice).toLocaleString()}</td>
                            }
                            <td
                                style={{
                                    background: `linear-gradient(270deg, 
                                    ${category === 'bid' ? `rgba(34,171,148, .2)` : `rgba(242,54,69, .2)`}
                                     ${percentage}%, transparent ${percentage}%)`
                                }}
                                className={styleClass}>
                                {str_size}
                            </td>
                        </tr>
                    )
                })
            }
        </>
    )
}