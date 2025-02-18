import formatWithComas from '../formatWithComas';

describe('formatWithComas', () => {
    describe('1000 미만의 숫자 처리', () => {
        test('소수점이 있는 경우 5자리까지만 표시', () => {
            expect(formatWithComas(123.4567891)).toBe('123.45678');
            expect(formatWithComas(0.123456789)).toBe('0.12345');
        });

        test('소수점이 없는 경우 그대로 표시', () => {
            expect(formatWithComas(123)).toBe('123');
            expect(formatWithComas(999)).toBe('999');
        });
    });

    describe('1000 이상의 숫자 처리', () => {
        test('천 단위로 콤마 추가', () => {
            expect(formatWithComas(1234567)).toBe('1,234,567');
            expect(formatWithComas(1000000)).toBe('1,000,000');
        });

        test('소수점이 있는 경우 정수부분만 콤마 추가', () => {
            expect(formatWithComas(1234567.89)).toBe('1,234,567.89');
        });

        test('dump 옵션이 true일 때 소수점 제거', () => {
            expect(formatWithComas(1234567.89, true)).toBe('1,234,567');
        });
    });

    describe('문자열 입력 처리', () => {
        test('숫자 문자열에 콤마 추가', () => {
            expect(formatWithComas('1234567')).toBe('1,234,567');
            expect(formatWithComas('1234567.89')).toBe('1,234,567.89');
        });
    });
});