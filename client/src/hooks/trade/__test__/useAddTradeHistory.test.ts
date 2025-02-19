import { renderHook } from "@testing-library/react";
import axios from "axios";
import { adjustOwnedCrypto } from "../../../redux/features/crypto/userCryptoSlice";
import { setUserBalance } from "../../../redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import useAddTradeHistory from "../useAddTradeHistory";
import { addTradeHistory, addUnSignedTradeHistory } from "../../../redux/features/trade/tradeSlice";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

describe('useAddTradeHistory', () => {
    const mockDispatch = jest.fn();
    const mockInitialState = {
        selectedCrypto: {
            name: 'Bitcoin',
            market: 'KRW-BTC',
            price: 50000000,
            isOwned: true
        }
    };

    // 각 테스트 케이스 실행 전에 모의 함수들을 초기화
    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockImplementation((selector) =>
            selector(mockInitialState)
        );
    });

    it('즉시 체결된 거래는 모든 상태를 업데이트해야 함', async () => {
        // 체결된 API 응답을 모의로 설정
        const mockResponse = {
            data: {
                isSigned: true, // 거래가 체결됨
                tradeHistory: {
                    id: 1,
                    cryptoName: 'Bitcoin',
                    tradeCategory: 'buy'
                },
                ownedCrypto: {
                    isOwned: true,
                    ownedQuantity: 1
                },
                balance: 5000000
            },
            status: 200
        };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useAddTradeHistory());

        // 거래 내역 추가 함수 호출 및 결과 저장
        const status = await result.current(
            'test@test.com',
            'Bitcoin',
            'buy',
            new Date(),
            'KRW-BTC',
            50000000,
            50000000,
            1,
            'KRW',
            true
        );

        // API 호출이 올바른 매개변수로 이루어졌는지 검증
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/api/user/trade/'),
            {
                email: 'test@test.com',
                cryptoName: 'Bitcoin',
                tradeCategory: 'buy',
                tradeTime: expect.any(Date),
                cryptoMarket: 'KRW-BTC',
                cryptoPrice: 50000000,
                tradePrice: 50000000,
                tradeAmount: 1,
                market: 'KRW',
                isMarketValue: true
            },
            { withCredentials: true }
        );

        // Redux 액션들이 올바르게 디스패치되었는지 검증
        expect(mockDispatch).toHaveBeenCalledWith(
            addTradeHistory(mockResponse.data.tradeHistory)
        );
        expect(mockDispatch).toHaveBeenCalledWith(
            adjustOwnedCrypto({
                ...mockInitialState.selectedCrypto,
                isOwned: true,
                ownedQuantity: 1
            })
        );
        expect(mockDispatch).toHaveBeenCalledWith(
            setUserBalance(5000000)
        );

        // API 응답 상태 코드가 올바른지 검증
        expect(status).toBe(200);
    });

    it('미체결 거래는 거래 내역만 업데이트해야 함', async () => {
        // 미체결 거래에 대한 API 응답 모의 설정
        const mockResponse = {
            data: {
                isSigned: false, // 체결되지 않은 거래
                tradeHistory: {
                    id: 2,
                    cryptoName: 'Bitcoin',
                    tradeCategory: 'buy'
                }
            },
            status: 202
        };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useAddTradeHistory());

        const status = await result.current(
            'test@test.com',
            'Bitcoin',
            'buy',
            new Date(),
            'KRW-BTC',
            50000000,
            48000000,
            1,
            'KRW',
            false
        );

        // 미체결 거래의 경우 거래 내역만 업데이트되고 다른 상태는 변경되지 않는지 검증
        expect(mockDispatch).toHaveBeenCalledWith(
            addUnSignedTradeHistory(mockResponse.data.tradeHistory)
        );
        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.any(adjustOwnedCrypto)
        );
        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.any(setUserBalance)
        );

        expect(status).toBe(202);
    });

    // 네트워크 오류 처리 테스트
    it('네트워크 오류 시 500 상태를 반환해야 함', async () => {
        // 네트워크 오류 상황 모의 설정
        mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

        const { result } = renderHook(() => useAddTradeHistory());

        const status = await result.current(
            'test@test.com',
            'Bitcoin',
            'buy',
            new Date(),
            'KRW-BTC',
            50000000,
            50000000,
            1,
            'KRW',
            true
        );

        // 네트워크 오류 시 500 상태 코드를 반환하고 상태 업데이트가 없는지 검증
        expect(status).toBe(500);
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    // 일반 에러 처리 테스트
    it('일반 에러 발생 시 500 상태를 반환해야 함', async () => {
        // Axios 에러가 아닌 일반 에러 상황 모의 설정
        mockedAxios.post.mockRejectedValueOnce({
            message: 'Generic Error',
            name: 'Error'
        });

        const { result } = renderHook(() => useAddTradeHistory());

        const status = await result.current(
            'test@test.com',
            'Bitcoin',
            'buy',
            new Date(),
            'KRW-BTC',
            50000000,
            50000000,
            1,
            'KRW',
            true
        );

        // 일반 에러 시 500 상태 코드를 반환하고 상태 업데이트가 없는지 검증
        expect(status).toBe(500);
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('axios.isAxiosError가 false인 경우 500 상태를 반환해야 함', async () => {
        // axios.isAxiosError가 false를 반환하도록 설정
        (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(false);

        mockedAxios.post.mockRejectedValueOnce({
            message: 'Unknown Error Type'
        });

        const { result } = renderHook(() => useAddTradeHistory());

        const status = await result.current(
            'test@test.com',
            'Bitcoin',
            'buy',
            new Date(),
            'KRW-BTC',
            50000000,
            50000000,
            1,
            'KRW',
            true
        );

        // axios.isAxiosError가 false일 때 500 상태 코드를 반환하고 상태 업데이트가 없는지 검증
        expect(status).toBe(500);
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    // response가 없는 Axios 에러 처리 테스트
    it('response가 없는 Axios 에러의 경우 500 상태를 반환해야 함', async () => {
        // response가 없는 Axios 에러 상황 모의 설정
        const axiosError = {
            isAxiosError: true,
            response: undefined,
            message: 'Network Error'
        };

        // axios.isAxiosError가 true를 반환하도록 설정
        (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);
        mockedAxios.post.mockRejectedValueOnce(axiosError);

        const { result } = renderHook(() => useAddTradeHistory());

        const status = await result.current(
            'test@test.com',
            'Bitcoin',
            'buy',
            new Date(),
            'KRW-BTC',
            50000000,
            50000000,
            1,
            'KRW',
            true
        );

        // response가 없는 Axios 에러 시 500 상태 코드를 반환하고 상태 업데이트가 없는지 검증
        expect(status).toBe(500);
        expect(mockDispatch).not.toHaveBeenCalled();
    });
});