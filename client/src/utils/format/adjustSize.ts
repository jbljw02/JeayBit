// 호가 및 체결내역을 출력하기 전에, 자릿수를 조정
export default function adjustSize(size: number) {
    let stringSize = String(size);

    // 정수부분의 자릿수 확인
    const integerLength = Math.floor(size).toString().length;

    // 14자리 초과의 정수인 경우, 14자리로 줄이고 문자열로 반환
    if (integerLength > 14) {
        stringSize = String(Math.floor(size)).substring(0, 14);
    }
    // 14자리 이하인 경우를 처리
    else {
        // 문자열의 끝이 '.'로 끝난다면 .을 제거
        if (stringSize.endsWith('.')) {
            stringSize = stringSize.slice(0, -1);
        }

        // 전체 자릿수가 14자리를 초과하는 경우
        if (stringSize.length > 14) {
            stringSize = stringSize.substring(0, 14);
        }
        // 소수점이 있고 전체 자릿수가 14자리 이하인 경우에만 소수점 5자리 제한 적용
        else if (stringSize.includes('.')) {
            const [integer, decimal] = stringSize.split('.');
            stringSize = `${integer}.${decimal.substring(0, 5)}`;
        }
    }

    return stringSize;
}