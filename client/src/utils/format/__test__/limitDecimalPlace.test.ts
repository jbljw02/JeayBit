import limitDecimalPlace from '../limitDecimalPlace';

describe('limitDecimalPlace', () => {
    describe('소수점 자릿수 제한', () => {
        it('지정된 자릿수로 소수점을 제한해야 함', () => {
            expect(limitDecimalPlace(123.456789, 2)).toBe(123.45);
            expect(limitDecimalPlace(0.123456789, 4)).toBe(0.1234);
        });

        it('지정된 자릿수보다 짧은 소수점은 그대로 유지해야 함', () => {
            expect(limitDecimalPlace(123.45, 8)).toBe(123.45);
            expect(limitDecimalPlace(0.1, 8)).toBe(0.1);
        });

        it('소수점이 없는 숫자는 그대로 반환해야 함', () => {
            expect(limitDecimalPlace(123, 2)).toBe(123);
            expect(limitDecimalPlace(0, 2)).toBe(0);
        });

        it('소수점 자리가 정확히 일치하는 경우 그대로 반환해야 함', () => {
            expect(limitDecimalPlace(123.45, 2)).toBe(123.45);
            expect(limitDecimalPlace(0.1234, 4)).toBe(0.1234);
        });
    });

    describe('예외 처리', () => {
        it('자릿수가 음수인 경우 원래 값을 반환해야 함', () => {
            expect(limitDecimalPlace(123.456, -2)).toBe(123.456);
            expect(limitDecimalPlace(0.123456, -4)).toBe(0.123456);
        });

        it('자릿수가 0인 경우 정수부만 반환해야 함', () => {
            expect(limitDecimalPlace(123.456, 0)).toBe(123);
            expect(limitDecimalPlace(0.123, 0)).toBe(0);
        });

        it('매우 큰 숫자의 소수점도 올바르게 처리해야 함', () => {
            expect(limitDecimalPlace(1234567.89012345, 2)).toBe(1234567.89);
            expect(limitDecimalPlace(0.000000001, 8)).toBe(0);
        });

        it('매우 작은 숫자의 소수점도 올바르게 처리해야 함', () => {
            expect(limitDecimalPlace(0.000000001, 8)).toBe(0);
            expect(limitDecimalPlace(0.00000001, 8)).toBe(0.00000001);
        });
    });
});