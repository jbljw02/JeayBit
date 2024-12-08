type AskingTitleProps = {
    contentsHide: boolean,
    setContentsHide: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
}

export default function AskingTitle({ contentsHide, setContentsHide, title }: AskingTitleProps) {
    return (
        <div className="orderbook-title">
            <span
                onClick={() => setContentsHide(!contentsHide)} >
                {title}
            </span>
            <svg
                className="arrow-hide"
                style={{
                    pointerEvents: 'all',
                    transformOrigin: '50% 50%',
                    transform: contentsHide ? 'rotate(-90deg)' : 'rotate(0deg)'
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 8"
                width="9"
                height="7">
                <path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path>
            </svg>
        </div>
    )
}