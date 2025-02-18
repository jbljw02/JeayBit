import adjustInputValue from '../adjustInputValue';

describe('adjustInputValue', () => {
    describe('숫자 입력 처리', () => {
        it('일반 숫자는 그대로 반환해야 함', () => {
            expect(adjustInputValue('123')).toBe('123');
            expect(adjustInputValue('0')).toBe('0');
        });

        it('소수점이 있는 숫자는 그대로 반환해야 함', () => {
            expect(adjustInputValue('123.456')).toBe('123.456'); // 일반적인 소수 테스트
            expect(adjustInputValue('0.123')).toBe('0.123'); // 0으로 시작하는 소수 테스트
        });

        it('음수 부호는 제거되어야 함', () => {
            expect(adjustInputValue('-123')).toBe('123'); // 음의 정수 테스트
            expect(adjustInputValue('-0.123')).toBe('0.123'); // 음의 소수 테스트
        });
    });

    describe('선행 0 처리', () => {
        it('단일 0은 그대로 유지되어야 함', () => {
            expect(adjustInputValue('0')).toBe('0');
        });

        it('00으로 시작하는 경우 첫 번째 0만 남겨야 함', () => {
            expect(adjustInputValue('00')).toBe('0');
            expect(adjustInputValue('001')).toBe('1');
        });

        it('0 다음에 숫자가 오는 경우 0을 제거해야 함', () => {
            expect(adjustInputValue('01')).toBe('1');
            expect(adjustInputValue('02')).toBe('2');
            expect(adjustInputValue('09')).toBe('9');
        });

        it('0 다음에 문자가 오는 경우 문자를 제거하고 0을 유지해야 함', () => {
            expect(adjustInputValue('0a')).toBe('0'); // 알파벳 테스트
            expect(adjustInputValue('0#')).toBe('0'); // 특수문자 테스트
        });
    });

    describe('특수 문자 처리', () => {
        it('콤마는 제거되어야 함', () => {
            expect(adjustInputValue('1,234')).toBe('1234');
            expect(adjustInputValue('1,234,567')).toBe('1234567');
        });

        it('알파벳은 제거되어야 함', () => {
            expect(adjustInputValue('abc123')).toBe('123');
            expect(adjustInputValue('123abc')).toBe('123');
        });

        it('특수 문자는 제거되어야 함', () => {
            expect(adjustInputValue('123#@!')).toBe('123');
            expect(adjustInputValue('!@#123')).toBe('123');
        });
    });

    describe('빈 입력 처리', () => {
        it('빈 문자열은 0을 반환해야 함', () => {
            expect(adjustInputValue('')).toBe('0');
        });

        it('공백은 0을 반환해야 함', () => {
            expect(adjustInputValue(' ')).toBe('0');
        });

        it('undefined는 0을 반환해야 함', () => {
            expect(adjustInputValue(undefined as unknown as string)).toBe('0');
        });
    });

    describe('소수점 처리', () => {
        it('소수점이 여러 개인 경우 첫 번째만 유지해야 함', () => {
            expect(adjustInputValue('123.456.789')).toBe('123.456789');
            expect(adjustInputValue('123..456')).toBe('123.456');
        });

        it('소수점으로 시작하는 경우 0을 추가해야 함', () => {
            expect(adjustInputValue('.123')).toBe('0.123');
            expect(adjustInputValue('.')).toBe('0.');
        });

        it('소수점으로 끝나는 경우 유지해야 함', () => {
            expect(adjustInputValue('123.')).toBe('123.');
            expect(adjustInputValue('0.')).toBe('0.');
        });

        it('소수점과 다른 특수문자가 섞인 경우', () => {
            expect(adjustInputValue('1.2.3#.4')).toBe('1.234');
            expect(adjustInputValue('.#.')).toBe('0.');
        });
    });
});