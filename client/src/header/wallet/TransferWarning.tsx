type Props = {
    isWarning: boolean,
    label: string,
}

export default function TransferWarning({ isWarning, label }: Props) {
    if(!isWarning) {
        return null;
    }
    
    return (
        isWarning &&
        <div className="alert-KRW">{label}</div>
    )
}