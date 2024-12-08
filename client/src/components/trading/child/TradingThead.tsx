import RadioInput from "../../input/RadioInput";

type RadioOption = {
    id: string,
    value: string,
    label: string,
};

type Params = {
    options: RadioOption[],
    selectedValue: string,
    onChange: (param: string) => void,
    label: string,
}

export default function TradingThead({ options, selectedValue, onChange, label }: Params) {
    const conditionalStyle = label === '체결구분' ? { paddingRight: '10px' } : {};

    return (
        <table className="trading-head-table">
            <tbody>
                <tr
                    className="trading-choice">
                    <td
                        className='order-sort'
                        style={conditionalStyle}>{label}</td>
                    {
                        options.map(option => (
                            <td key={option.id}>
                                <RadioInput
                                    id={option.id}
                                    checked={selectedValue === option.value}
                                    onChange={() => onChange(option.value)}
                                    label={option.label} />
                            </td>
                        ))
                    }
                </tr>
            </tbody>
        </table>
    )
}