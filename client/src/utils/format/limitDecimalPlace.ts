// 최대 소숫점 자리를 지정
export default function limitDecimalPlace(value: number, places: number) {
    // 음수 자릿수 처리
    if (places < 0) {
        return value;
    }

    // 0인 경우 정수부만 반환
    if (places === 0) {
        return Math.floor(value);
    }

    // 매우 작은 수 처리(지정된 자릿수보다 작은 경우 0 반환)
    const minValue = Math.pow(10, -places);
    if (Math.abs(value) < minValue) {
        return 0;
    }

    const decimalPart = (value.toString().split('.')[1] || '');
    if (decimalPart.length > places) {
        // 반올림이 아닌 버림 처리를 위해 Math.floor 사용
        const multiplier = Math.pow(10, places);
        return Math.floor(value * multiplier) / multiplier;
    }
    return value;
}