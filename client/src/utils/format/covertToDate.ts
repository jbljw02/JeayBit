// 타임 스탬프를 변환하여 현재 날짜 및 시간을 구함
export default function convertToDate(timestamp: number) {
    const date = new Date(timestamp);

    let tradeTime = new Intl.DateTimeFormat('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24시간 형식
    }).format(date);
    tradeTime = tradeTime.replace(". ", "/").replace(".", "").replace("오전 ", "").replace("오후 ", "")

    return tradeTime;
}