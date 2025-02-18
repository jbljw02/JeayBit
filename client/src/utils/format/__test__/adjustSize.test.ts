import adjustSize from '../adjustSize';

describe('adjustSize', () => {
    describe('정수 자릿수 제한', () => {
        it('14자리 이상의 정수는 14자리로 제한되어야 함', () => {
            expect(adjustSize(12345678901234567)).toBe('12345678901234');
            expect(adjustSize(999999999999999)).toBe('99999999999999');
        });

        it('14자리 미만의 정수는 그대로 반환되어야 함', () => {
            expect(adjustSize(123456789012)).toBe('123456789012');
            expect(adjustSize(1234)).toBe('1234');
        });
    });

    describe('소수점 자릿수 제한', () => {
        it('소수점 5자리까지만 표시되어야 함', () => {
            expect(adjustSize(123.456789)).toBe('123.45678');
            expect(adjustSize(0.123456789)).toBe('0.12345');
        });

        it('소수점 5자리 미만은 그대로 표시되어야 함', () => {
            expect(adjustSize(123.123)).toBe('123.123');
            expect(adjustSize(0.1)).toBe('0.1');
        });
    });

    describe('문자열 끝 처리', () => {
        it('문자열 끝의 소수점은 제거되어야 함', () => {
            expect(adjustSize(123.)).toBe('123');
            expect(adjustSize(0.)).toBe('0');
        });
    });

    describe('전체 자릿수 제한', () => {
        it('소수점을 포함하여 14자리를 초과하는 경우 14자리까지만 표시', () => {
            expect(adjustSize(123.45678901234567)).toBe('123.4567890123');
            expect(adjustSize(0.123456789012345)).toBe('0.123456789012');
        });
    });
});