// 호가 및 체결내역을 출력하기 전에, 자릿수를 조정
export default function adjustSize(size: number) {
    let str_size;

    // 14자리 이상의 정수인 경우, 14자리로 줄이고 문자열로 반환
    if (size > 9999999999999) {
        str_size = String(Math.floor(size));
    }
    // 소수점을 포함하여 14자리를 넘어갈 수 있는 경우를 처리
    else {
        str_size = String(size);
        str_size = str_size.substring(0, 14);
    }

    // 문자열의 끝이 '.'로 끝난다면 .을 제거
    if (str_size.endsWith('.')) {
        str_size = str_size.slice(0, -1);
    }

    if (str_size.includes('.')) {
        const [integer, decimal] = str_size.split('.');
        str_size = `${integer}.${decimal.substring(0, 5)}`;
    }

    return str_size;
}