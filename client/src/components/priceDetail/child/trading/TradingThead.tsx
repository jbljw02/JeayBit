import RadioInput from "../../../input/RadioInput";

type Params = {
    bidSort: string,
    onChange: (param: string) => void,
}

export default function TradingThead({ bidSort, onChange }: Params) {
    return (
        <table className="trading-head-table">
            <tbody>
                <tr className="trading-choice">
                    <td className='order-sort'>주문구분</td>
                    <td>
                        <RadioInput
                            id="radio1"
                            checked={bidSort === '지정가'}
                            onChange={() => onChange('지정가')}
                            label="지정가" />
                    </td>
                    <td>
                        <RadioInput
                            id="radio2"
                            checked={bidSort === '시장가'}
                            onChange={() => onChange('시장가')}
                            label="시장가" />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}