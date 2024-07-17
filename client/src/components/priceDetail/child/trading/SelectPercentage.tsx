type Params = {
    percentage: string,
    onClick: (percentage: string) => void,
}

export default function SelectPercentage({ percentage, onClick }: Params) {
    return (
        <>
            <span className={
                percentage === '10%' ?
                    'buy-percentage' :
                    'non-selected-percentage'
            } onClick={() => (onClick('10%'))}>10%</span>
            <span className={
                percentage === '25%' ?
                    'buy-percentage' :
                    'non-selected-percentage'
            } onClick={() => (onClick('25%'))}>25%</span>
            <span className={
                percentage === '50%' ?
                    'buy-percentage' :
                    'non-selected-percentage'
            } onClick={() => (onClick('50%'))}>50%</span>
            <span className={
                percentage === '75%' ?
                    'buy-percentage' :
                    'non-selected-percentage'
            } onClick={() => (onClick('75%'))}>75%</span>
            <span className={
                percentage === '100%' ?
                    'buy-percentage' :
                    'non-selected-percentage'
            } onClick={() => (onClick('100%'))}>100%</span>
        </>
    )
}