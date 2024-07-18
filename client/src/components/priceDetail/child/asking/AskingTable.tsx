import { useSelector } from "react-redux";
import convertToDate from "../../../../utils/date/covertToDate";
import adjustSize from "../../../../utils/format/adjustSize";
import { RootState } from "../../../../redux/store";
import { AskingData } from "../../../../redux/features/askingSlice";

type Params = {
    differences: {
        new_ask_price?: number,
        new_ask_size?: number,
        new_bid_price?: number,
        new_bid_size?: number,
    }[],
    size: number,
    category: string,
}

export default function AskingTable({ differences, size, category }: Params) {
    const askingData = useSelector((state: RootState) => state.askingData);

    // 이전 호가와 현재 호가를 비교한 값을 이용 - 변경된 호가가 현재 state를 순회하면서 일치하는 값에 대해서 스타일 지정
    const isChange = (item: AskingData) => {
        if (category === 'bid') {
            return differences.some((value) => value.new_bid_size === item.bid_size);
        }
        return differences.some((value) => value.new_ask_size === item.ask_size);
    }

    const getStyleClass = (isChange: boolean) => {
        if (category === 'bid') {
            return isChange ? 'change-bid' : '';
        }
        return isChange ? 'change-ask' : '';
    }

    const getPercentage = (item: AskingData) => {
        if (category === 'bid') {
            return (item.bid_size / size) * 100;
        }
        return (item.ask_size / size) * 100;
    }

    const getStrSize = (item: AskingData) => {
        if (category === 'bid') {
            return adjustSize(item.bid_size);
        }
        return adjustSize(item.ask_size);
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
                                    <td>{(item.bid_price).toLocaleString()}</td> :
                                    <td>{(item.ask_price).toLocaleString()}</td>
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