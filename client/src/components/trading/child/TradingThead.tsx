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
    const conditionalStyle = label === '체결구분' ? { marginRight: '-30px' } : {};
    return (
        <div className="trading-head-section">
            <div className="trading-row">
                <div
                    className='trading-title'
                    style={conditionalStyle}>
                    {label}
                </div>
                {
                    options.map(option => (
                        <div key={option.id} className="radio-option">
                            <RadioInput
                                id={option.id}
                                checked={selectedValue === option.value}
                                onChange={() => onChange(option.value)}
                                label={option.label} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}