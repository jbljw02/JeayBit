type Params = {
    rangeValue: number,
    onChange: (value: number) => void;
}

export default function PriceRange({ rangeValue, onChange }: Params) {
    return (
        <input
            className="slider buy"
            type="range"
            min="0"
            max="100000000"
            step={1}
            value={rangeValue}
            onChange={(e) => onChange(Number(e.target.value))} />
    )
}