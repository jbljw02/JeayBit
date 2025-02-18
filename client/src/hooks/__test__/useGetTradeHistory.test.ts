import { renderHook } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import useGetTradeHistory from '../useGetTradeHistory';
import axios from 'axios';
import { setTradeHistory, setUnSignedTradeHistory } from '../../redux/features/tradeSlice';
import { showNoticeModal } from '../../redux/features/modalSlice';

// axios와 hooks를 모의(mock)화
jest.mock('axios');
jest.mock('../../redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

describe('useGetTradeHistory', () => {
    const mockDispatch = jest.fn();
    const mockUser = { email: 'test@test.com' };
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => 
            selector({ user: mockUser })
        );
    });

    it('거래 내역을 성공적으로 가져와야 함', async () => {
        // API 응답 모의
        const mockResponse = {
            data: [
                {
                    id: '1',
                    tradeTime: '2024-01-01T12:00:00Z',
                    isSigned: true,
                    cryptoPrice: 50000,
                    cryptoName: 'Bitcoin',
                    tradeAmount: '1',
                    tradePrice: '50000'
                },
                {
                    id: '2',
                    tradeTime: '2024-01-01T13:00:00Z',
                    isSigned: false,
                    cryptoPrice: 51000,
                    cryptoName: 'Bitcoin',
                    tradeAmount: '1',
                    tradePrice: '51000'
                }
            ]
        };
        mockedAxios.get.mockResolvedValueOnce(mockResponse);

        // 훅 렌더링
        const { result } = renderHook(() => useGetTradeHistory());

        // getTradeHistory 함수 실행
        await result.current();

        // API 호출 검증
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${process.env.REACT_APP_API_URL}/api/user/trade/`,
            { withCredentials: true }
        );

        // dispatch 호출 검증
        expect(mockDispatch).toHaveBeenCalledWith(
            setTradeHistory([{
                ...mockResponse.data[0],
                tradeTime: expect.any(String)
            }])
        );
        expect(mockDispatch).toHaveBeenCalledWith(
            setUnSignedTradeHistory([{
                ...mockResponse.data[1],
                tradeTime: expect.any(String)
            }])
        );
    });

    it('API 호출 실패 시 에러 모달을 표시해야 함', async () => {
        // API 에러 모의
        mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

        // 훅 렌더링
        const { result } = renderHook(() => useGetTradeHistory());

        // getTradeHistory 함수 실행
        await result.current();

        // 에러 모달 표시 검증
        expect(mockDispatch).toHaveBeenCalledWith(
            showNoticeModal({
                content: '거래 내역을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.'
            })
        );
    });

    it('유저 이메일이 없으면 API를 호출하지 않아야 함', () => {
        // 유저 이메일이 없는 상태로 설정
        (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => 
            selector({ user: { email: '' } })
        );

        // 훅 렌더링
        renderHook(() => useGetTradeHistory());

        // API 호출되지 않았음을 검증
        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('빈 거래 내역을 처리할 수 있어야 함', async () => {
        // 빈 배열 응답 모의
        mockedAxios.get.mockResolvedValueOnce({ data: [] });

        // 훅 렌더링
        const { result } = renderHook(() => useGetTradeHistory());

        // getTradeHistory 함수 실행
        await result.current();

        // 빈 배열로 dispatch 호출 검증
        expect(mockDispatch).toHaveBeenCalledWith(setTradeHistory([]));
        expect(mockDispatch).toHaveBeenCalledWith(setUnSignedTradeHistory([]));
    });
});