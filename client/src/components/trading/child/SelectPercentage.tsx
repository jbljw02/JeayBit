type Params = {
    percentage: string,
    onClick: (percentage: string) => void,
    category: 'buy' | 'sell',
}

export default function SelectPercentage({ percentage, onClick, category }: Params) {
    return (
        <div className="select-percentage">
            <span id={
                percentage === '10%' ?
                    `${category}-percentage` :
                    'non-selected-percentage'
            } onClick={() => (onClick('10%'))}>10%</span>
            <span id={
                percentage === '25%' ?
                    `${category}-percentage` :
                    'non-selected-percentage'
            } onClick={() => (onClick('25%'))}>25%</span>
            <span id={
                percentage === '50%' ?
                    `${category}-percentage` :
                    'non-selected-percentage'
            } onClick={() => (onClick('50%'))}>50%</span>
            <span id={
                percentage === '75%' ?
                    `${category}-percentage` :
                    'non-selected-percentage'
            } onClick={() => (onClick('75%'))}>75%</span>
            <span id={
                percentage === '100%' ?
                    `${category}-percentage` :
                    'non-selected-percentage'
            } onClick={() => (onClick('100%'))}>100%</span>
        </div>
    )
}