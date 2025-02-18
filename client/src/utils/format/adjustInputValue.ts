// 매수 및 매도를 할 때 input의 값을 조정
export default function adjustInputValue(value: string) {
    if (!value) {
        return '0';
    }

    // 숫자와 "." 외의 문자를 제거
    value = value.replace(/[^0-9.]/g, "");

    // 첫 번째 소수점만 남기고 나머지 제거
    const parts = value.split('.');
    if (parts.length > 1) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
    if (value[0] === '0' && value.length > 1) {
        // 소수점이 아닌 경우에만 처리
        if (value[1] !== '.') {
            value = value.replace(/^0+/, '');
        }
    }

    // "."이 맨 처음에 오지 않도록 함
    if (value[0] === '.') {
        value = '0' + value;
    }

    // value값이 비게 되면 '0'으로 설정(NaN값 방지)
    if (value === '') {
        value = '0';
    }

    return value;
}