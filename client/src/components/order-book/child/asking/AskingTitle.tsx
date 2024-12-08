type AskingTitleProps = {
    contentsHide: boolean,
    setContentsHide: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
}

export default function AskingTitle({ contentsHide, setContentsHide, title }: AskingTitleProps) {
    return (
        <div className="priceDetail-title">
            <span
                className="no-drag cursor-pointer"
                onClick={() => setContentsHide(!contentsHide)} >
                {title}
                < svg className="arrow-hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 5"
                    style={{
                        pointerEvents: 'all',
                        transformOrigin: '50% 50%',
                        transform: contentsHide ? 'rotate(-90deg)' : 'rotate(0deg)'
                    }}>
                    <path d="M5.016 0 0 .003 2.506 2.5 5.016 5l2.509-2.5L10.033.003 5.016 0z" />
                </svg>
            </span>
        </div >
    )
}