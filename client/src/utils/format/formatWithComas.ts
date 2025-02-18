// 천의 자리마다 콤마를 찍음
export default function formatWithComas(value: string | number, dump?: boolean) {
    if (typeof value === 'number') {
        // 1000 미만의 숫자는 소숫점 유지(5번째 자리까지 살림)
        if (value < 1000) {
            const strValue = String(value);
            if (strValue.includes('.')) {
                const [integer, decimal] = strValue.split('.');
                return `${integer}.${decimal.substring(0, 5)}`;
            }
            return strValue;
        }
        // 1000 이상의 숫자는 정수부분만 사용
        if (dump) value = Math.floor(value);
        value = String(value);
    }
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}