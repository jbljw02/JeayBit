type Params = {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    suffix: string,
}

export default function TradeInput({ value, onChange, suffix }: Params) {
    return (
        <div className="trade-input">
            <input
                type="text"
                value={value}
                onChange={onChange} />
            <span>{suffix}</span>
        </div>
    )
}