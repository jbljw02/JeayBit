// 매수 및 매도를 할 때 input의 값을 조정
export default function adjustInputValue(value: string) {
    // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
    if (value[0] === '0' && value.length > 1) {
        if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
            value = value.substring(1);
        }
    }

    // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
    value = value.replace(/(\..*)\./g, "$1");

    // 숫자와 "." 외의 문자를 제거
    value = value.replace(/[^0-9.]/g, "");

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