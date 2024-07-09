type Props = {
    label: string;
    isWarning: boolean;
    isSubmitted?: boolean;
}

export default function TransferWarning({ isWarning, label, isSubmitted }: Props) {
    // 제출 여부가 주어지지 않은 경우, isWarning이 true일 때만 렌더링
    if (isSubmitted === undefined) {
        if (!isWarning) {
            return null;
        }
        return <div className="warning-KRW">{label}</div>;
    }
    else {
        // 제출 여부가 주어진 경우, isWarning과 isSubmitted이 모두 true일 때만 렌더링
        if (!isWarning || !isSubmitted) {
            return null;
        }
        return <div className="warning-KRW">{label}</div>;
    }
}