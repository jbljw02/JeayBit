// 최대 소숫점 자리를 지정
export default function limitDecimalPlace(value: number, places: number) {
    if ((value.toString().split('.')[1] || '').length > places) {
        return parseFloat(value.toFixed(places));
    }
    return value;
}