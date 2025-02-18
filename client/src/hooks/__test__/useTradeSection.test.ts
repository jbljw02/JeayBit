import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { showNoticeModal } from "../../redux/features/modalSlice";
import { setWorkingSpinner } from "../../redux/features/placeholderSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useAddTradeHistory from "../useAddTradeHistory";
import { useTradeSection } from "../useTradeSection";

jest.mock('../../redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock('../useAddTradeHistory', () => ({
    __esModule: true,
    default: jest.fn()
}));

describe('useTradeSection', () => {
    // 테스트에 사용할 mock 함수와 초기 상태 정의
    const mockDispatch = jest.fn();
    const mockAddTradeHistory = jest.fn();
    const mockInitialState = {
        selectedCrypto: { name: 'Bitcoin', price: 50000000, market: 'KRW-BTC' },
        user: { email: 'test@test.com', balance: 10000000 },
        ownedCrypto: [
            { name: 'Bitcoin', isOwned: true, ownedQuantity: 1 }
        ]
    };

    // 각 테스트 전에 mock 초기화 및 설정
    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
            return selector(mockInitialState);
        });
        (useAddTradeHistory as jest.Mock).mockReturnValue(mockAddTradeHistory);
    });

    describe('가격 변경 처리', () => {
        it('가격이 변경되면 관련 상태가 올바르게 업데이트되어야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 가격을 60000000으로 변경
            act(() => {
                result.current.handlePriceChange('60000000');
            });

            // 변경된 가격과 총액 검증
            expect(result.current.priceInputValue).toBe('60000000');
            expect(result.current.total).toBe(0); // 초기 수량이 0이므로 총액도 0
        });
    });

    describe('수량 변경 처리', () => {
        it('수량이 변경되면 총액이 올바르게 계산되어야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 수량을 2로 변경
            act(() => {
                result.current.handleQuantityChange('2');
            });

            // 변경된 수량과 총액 검증
            expect(result.current.quantityInputValue).toBe('2');
            expect(result.current.total).toBe(100000000); // 50000000 * 2
        });

        it('소수점 8자리 초과 입력시 처리되지 않아야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 초기값 확인
            expect(result.current.quantityInputValue).toBe('0');

            // 소수점 9자리 수량 입력 시도
            act(() => {
                result.current.handleQuantityChange('0.123456789');
            });

            // 입력이 처리되지 않고 초기값 유지 확인
            expect(result.current.quantityInputValue).toBe('0');
        });

        it('문자열 입력은 처리되지 않아야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 초기값 확인
            expect(result.current.quantityInputValue).toBe('0');

            // 문자열 입력 시도
            act(() => {
                result.current.handleQuantityChange('abc');
            });

            // 입력이 처리되지 않고 초기값 유지 확인
            expect(result.current.quantityInputValue).toBe('0');
            expect(result.current.quantity).toBe(0);
            expect(result.current.total).toBe(0);
        });

        it('빈 문자열 입력시 0으로 처리되어야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 빈 문자열 입력
            act(() => {
                result.current.handleQuantityChange('');
            });

            // 모든 값이 0으로 초기화되었는지 확인
            expect(result.current.quantityInputValue).toBe('0');
            expect(result.current.quantity).toBe(0);
            expect(result.current.total).toBe(0);
        });
    });

    describe('거래 제출 처리', () => {
        it('매수 시 잔고 초과 주문은 에러 모달을 표시해야 함', async () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 잔고를 초과하는 수량 입력
            act(() => {
                result.current.handleQuantityChange('0.5'); // 25000000 KRW
            });

            // 거래 제출 시도
            await act(async () => {
                await result.current.submitTrade(false, 50000000);
            });

            // 에러 모달 출력 검증
            expect(mockDispatch).toHaveBeenCalledWith(
                showNoticeModal({ content: '주문 총액이 잔고 보유량을 초과했습니다.' })
            );
        });

        it('매도 시 보유량 초과 주문은 에러 모달을 출력해야 함', async () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'sell',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 보유량을 초과하는 수량 입력
            act(() => {
                result.current.handleQuantityChange('2'); // 보유량(1) 초과
            });

            // 거래 제출 시도
            await act(async () => {
                await result.current.submitTrade(false, 50000000);
            });

            // 에러 메시지 표시 검증
            expect(mockDispatch).toHaveBeenCalledWith(
                showNoticeModal({ content: '주문 수량이 보유 화폐량을 초과했습니다.' })
            );
        });

        it('매도 시 보유하지 않은 화폐 거래 시도는 에러 메시지를 표시해야 함', async () => {
            // 보유 화폐가 없는 상태 설정
            const noOwnedCryptoState = {
                ...mockInitialState,
                ownedCrypto: []
            };

            (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
                return selector(noOwnedCryptoState);
            });

            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'sell',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 거래 제출 시도
            await act(async () => {
                await result.current.submitTrade(false, 50000000);
            });

            // 에러 메시지 표시 검증
            expect(mockDispatch).toHaveBeenCalledWith(
                showNoticeModal({ content: '해당 화폐를 보유하고 있지 않습니다.' })
            );
        });

        it('거래 성공 시 적절한 메시지를 표시해야 함', async () => {
            // 거래 성공 응답 설정
            mockAddTradeHistory.mockResolvedValue(200);

            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 수량 설정
            act(() => {
                result.current.handleQuantityChange('0.1');
            });

            // 거래 제출
            await act(async () => {
                await result.current.submitTrade(true, 50000000);
            });

            // 스피너 표시 및 성공 메시지 검증
            expect(mockDispatch).toHaveBeenCalledWith(
                setWorkingSpinner(true)
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                showNoticeModal({ content: '성공적으로 화폐를 매수했습니다.' })
            );
        });

        it('지정가 거래 요청 시 적절한 메시지를 표시해야 함', async () => {
            mockAddTradeHistory.mockResolvedValue(202);

            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 수량 설정
            act(() => {
                result.current.handleQuantityChange('0.1');
            });

            // 지정가 거래 제출
            await act(async () => {
                await result.current.submitTrade(false, 50000000);
            });

            // 지정가 거래 메시지 검증
            expect(mockDispatch).toHaveBeenCalledWith(
                showNoticeModal({
                    content: '매수 요청이 완료되었습니다. \n요청하신 가격과 일치하는 매도 요청이 발생하면 거래가 완료됩니다.'
                })
            );
        });

        it('거래 실패 시 에러 메시지를 표시해야 함', async () => {
            mockAddTradeHistory.mockResolvedValue(500);

            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 거래 제출
            await act(async () => {
                await result.current.submitTrade(true, 50000000);
            });

            // 실패 메시지 검증
            expect(mockDispatch).toHaveBeenCalledWith(
                showNoticeModal({ content: '화폐 매수에 실패했습니다.' })
            );
        });
    });

    describe('초기화 처리', () => {
        it('resetValue 호출 시 모든 값이 초기화되어야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 값 설정 후 초기화
            act(() => {
                result.current.handleQuantityChange('1');
                result.current.selectPercentage('25%');
                result.current.resetValue();
            });

            // 모든 값이 초기화되었는지 검증
            expect(result.current.quantity).toBe(0);
            expect(result.current.total).toBe(0);
            expect(result.current.selectedPercentage).toBe('');
            expect(result.current.quantityInputValue).toBe('0');
            expect(result.current.totalInputValue).toBe('0');
        });
    });

    describe('총액 변경 처리', () => {
        it('총액이 변경되면 수량이 올바르게 계산되어야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 초기값 확인
            expect(result.current.totalInputValue).toBe('0');

            // 총액 변경
            act(() => {
                result.current.totalValueChange('100000000');
            });

            // 변경된 값 검증
            expect(result.current.totalInputValue).toBe('100000000');
            expect(result.current.quantity).toBe(2); // 100000000 / 50000000
            expect(result.current.quantityInputValue).toBe('2');
        });

        it('가격이 0일 때 총액 변경은 수량을 변경하지 않아야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 0,
                    setPrice: jest.fn()
                })
            );

            // 초기값 확인
            expect(result.current.totalInputValue).toBe('0');
            expect(result.current.quantity).toBe(0);

            // 총액 변경 시도
            act(() => {
                result.current.totalValueChange('100000000');
            });

            // 가격이 0이므로 변화가 없어야 함
            expect(result.current.totalInputValue).toBe('0');
            expect(result.current.quantity).toBe(0);
            expect(result.current.quantityInputValue).toBe('0');
        });

        it('잘못된 총액 입력은 처리되지 않아야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 초기값 확인
            expect(result.current.totalInputValue).toBe('0');

            // 잘못된 입력 시도
            act(() => {
                result.current.totalValueChange('abc');
            });

            // 값이 변경되지 않아야 함
            expect(result.current.totalInputValue).toBe('0');
            expect(result.current.quantity).toBe(0);
            expect(result.current.quantityInputValue).toBe('0');
        });

        it('음수 총액 입력은 양수로 처리되어야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 초기값 확인
            expect(result.current.totalInputValue).toBe('0');

            // 음수 입력 시도
            act(() => {
                result.current.totalValueChange('-100000');
            });

            // 양수로 처리되어야 함
            expect(result.current.totalInputValue).toBe('100000');
            expect(result.current.quantity).toBe(0.002); // 100000 / 50000000
            expect(result.current.quantityInputValue).toBe('0.002');
        });
    });

    describe('퍼센트 선택 처리', () => {
        it('매수 시 선택된 퍼센트에 따라 총액이 계산되어야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 각 퍼센트별 테스트
            act(() => {
                result.current.selectPercentage('25%');
            });
            expect(result.current.total).toBe(2500000); // 10000000(잔고) * 0.25

            act(() => {
                result.current.selectPercentage('50%');
            });
            expect(result.current.total).toBe(5000000); // 10000000(잔고) * 0.5

            act(() => {
                result.current.selectPercentage('75%');
            });
            expect(result.current.total).toBe(7500000); // 10000000(잔고) * 0.75

            act(() => {
                result.current.selectPercentage('100%');
            });
            expect(result.current.total).toBe(10000000); // 10000000(잔고) * 1
        });

        it('매도 시 선택된 퍼센트에 따라 수량이 계산되어야 함', () => {
            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'sell',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 각 퍼센트별 테스트
            act(() => {
                result.current.selectPercentage('25%');
            });
            expect(result.current.quantity).toBe(0.25); // 1(보유량) * 0.25

            act(() => {
                result.current.selectPercentage('50%');
            });
            expect(result.current.quantity).toBe(0.5); // 1(보유량) * 0.5

            act(() => {
                result.current.selectPercentage('75%');
            });
            expect(result.current.quantity).toBe(0.75); // 1(보유량) * 0.75

            act(() => {
                result.current.selectPercentage('100%');
            });
            expect(result.current.quantity).toBe(1); // 1(보유량) * 1
        });

        it('보유하지 않은 화폐 매도 시 퍼센트 선택이 처리되지 않아야 함', () => {
            // 보유 화폐가 없는 상태 설정
            const noOwnedCryptoState = {
                ...mockInitialState,
                ownedCrypto: []
            };

            (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
                return selector(noOwnedCryptoState);
            });

            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'sell',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 퍼센트 선택 시도
            act(() => {
                result.current.selectPercentage('50%');
            });

            // 값이 변경되지 않아야 함
            expect(result.current.quantity).toBe(0);
            expect(result.current.total).toBe(0);
        });

        it('잔고가 0일 때 매수 퍼센트 선택이 처리되지 않아야 함', () => {
            // 잔고가 0인 상태 설정
            const noBalanceState = {
                ...mockInitialState,
                user: { ...mockInitialState.user, balance: 0 }
            };

            (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => {
                return selector(noBalanceState);
            });

            const { result } = renderHook(() =>
                useTradeSection({
                    tradeType: 'buy',
                    price: 50000000,
                    setPrice: jest.fn()
                })
            );

            // 퍼센트 선택 시도
            act(() => {
                result.current.selectPercentage('50%');
            });

            // 값이 변경되지 않아야 함
            expect(result.current.quantity).toBe(0);
            expect(result.current.total).toBe(0);
        });
    });
});