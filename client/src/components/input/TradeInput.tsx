type Params = {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export default function TradeInput({ value, onChange }: Params) {
    return (
        <input 
            type="text"
            value={value}
            onChange={onChange} />
    )
}