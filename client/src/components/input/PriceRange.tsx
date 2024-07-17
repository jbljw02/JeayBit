import '../../styles/input/rangeInput.css'

type SliderProps = {
    rangeValue: number,
    onChange: (value: number) => void,
    category: 'buy' | 'sell',
}

export default function PriceRange({ rangeValue, onChange, category }: SliderProps) {
    return (
        <input
            className={`slider ${category === 'buy' ? 'buy' : 'sell'}`}
            type="range"
            min="0"
            max="100000000"
            step={1}
            value={rangeValue}
            onChange={(e) => onChange(Number(e.target.value))} />
    )
}