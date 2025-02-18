import { useState, useEffect } from 'react';
import useAddTradeHistory from './useAddTradeHistory';
import { showNoticeModal } from '../../redux/features/modalSlice';
import { setWorkingSpinner } from '../../redux/features/placeholderSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import calculatePercentage from '../../utils/form/calculatePercentage';
import adjustInputValue from '../../utils/format/adjustInputValue';
import limitDecimalPlace from '../../utils/format/limitDecimalPlace';

interface UseTradeSectionProps {
    tradeType: 'buy' | 'sell';
    price: number;
    setPrice: (price: number) => void;
}

export const useTradeSection = ({ tradeType, price, setPrice }: UseTradeSectionProps) => {
    const dispatch = useAppDispatch();
    const addTradeHistory = useAddTradeHistory();

    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const user = useAppSelector(state => state.user);
    const ownedCrypto = useAppSelector(state => state.ownedCrypto);

    const [selectedPercentage, setSelectedPercentage] = useState<string>('');
    const [bidSort, setBidSort] = useState<string>('지정가');
    const [total, setTotal] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [quantityInputValue, setQuantityInputValue] = useState('0');
    const [totalInputValue, setTotalInputValue] = useState('0');
    const [priceInputValue, setPriceInputValue] = useState('0');
    const [time] = useState(new Date());

    // 거래 관련 값 초기화
    const resetValue = () => {
        setQuantity(0);
        setQuantityInputValue('0');
        setTotal(0);
        setTotalInputValue('0');
        setSelectedPercentage('');
    };

    // 가격 변화 감지
    const handlePriceChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);
        setPrice(Number(adjustedValue));
        setPriceInputValue(adjustedValue);
        setTotal(Math.floor(parseFloat(adjustedValue) * quantity));
        setTotalInputValue((Math.floor(parseFloat(adjustedValue) * quantity)).toString());
    };

    // 수량 변화 감지
    const handleQuantityChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);
        const decimalPart = (adjustedValue.split('.')[1] || '').length;

        if (decimalPart <= 8) {
            setQuantityInputValue(adjustedValue);
            setQuantity(parseFloat(adjustedValue));
            setTotal(Math.floor(price * parseFloat(adjustedValue)));
            setTotalInputValue((Math.floor(price * parseFloat(adjustedValue))).toString());
        }
    };

    // 퍼센트 선택 처리
    const selectPercentage = (percentage: string) => {
        setSelectedPercentage(percentage);

        const percentageValue = calculatePercentage(percentage);
        if (percentageValue === 0) return;

        // 매수 주문
        if (tradeType === 'buy') {
            // 선택한 퍼센트에 따라 주문 가능 금액 계산
            const dividedTotal = user.balance * percentageValue;

            // 주문 총액 설정 (소수점 제거)
            setTotal(Math.floor(dividedTotal));
            setTotalInputValue(Math.floor(dividedTotal).toString());

            // 화폐 주문 수량 계산(주문 총액 / 현재가)
            let dividedQuantity = dividedTotal / price;
            // 소수점 8자리로 제한
            dividedQuantity = limitDecimalPlace(dividedQuantity, 8);

            // 주문 수량 설정
            setQuantity(dividedQuantity);
            setQuantityInputValue(dividedQuantity.toString());
        }
        // 매도 주문
        else if (tradeType === 'sell') {
            // 보유중인 화폐 찾기
            const targetCrypto = ownedCrypto.find(crypto => crypto.name === selectedCrypto.name);
            // 매도 가능 수량
            const availableQuantity = targetCrypto?.ownedQuantity || 0;

            // 가격이 0이 아니며 보유 수량이 있는 경우
            if (price !== 0 && availableQuantity > 0) {
                // 선택한 퍼센트에 따라 매도 수량 계산
                let dividedQuantity = availableQuantity * percentageValue;
                // 소수점 8자리로 제한
                dividedQuantity = limitDecimalPlace(dividedQuantity, 8);

                // 화폐 매도 수량 설정
                setQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());

                // 매도 총액 계산(매도수량 * 현재가)
                const dividedTotal = Math.floor(price * dividedQuantity);
                // 매도 총액 설정
                setTotal(dividedTotal);
                setTotalInputValue(dividedTotal.toString());
            }
        }
    };

    // 주문 총액 변화 감지
    const totalValueChange = (value: string) => {
        const adjustedValue = adjustInputValue(value);
        const isNumber = /^[0-9]*$/.test(adjustedValue);

        if (price && isNumber) {
            setTotalInputValue(adjustedValue);
            setTotal(parseFloat(adjustedValue));

            let dividedQuantity = Number(adjustedValue) / price;

            // 소수점 아래 8자리로 제한
            if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
            }

            setQuantity(dividedQuantity);
            setQuantityInputValue(dividedQuantity.toString());
        }
    };

    // 거래 제출
    const submitTrade = async (isMarketValue: boolean, currentPrice: number) => {
        // 유효성 검사
        if (tradeType === 'buy' && total > user.balance) {
            // 주문 총액이 잔고량을 초과하는 경우
            dispatch(showNoticeModal({ content: '주문 총액이 잔고 보유량을 초과했습니다.' }));
            return;
        } else if (tradeType === 'sell') {
            // 보유중인 화폐 찾기
            const targetCrypto = ownedCrypto.find(crypto => crypto.name === selectedCrypto.name);
            // 보유중인 화폐가 없는 경우
            if (!targetCrypto?.isOwned || targetCrypto.ownedQuantity === 0) {
                dispatch(showNoticeModal({ content: '해당 화폐를 보유하고 있지 않습니다.' }));
                return;
            }
            // 주문 수량이 보유 화폐량을 초과하는 경우
            if (quantity > targetCrypto.ownedQuantity) {
                dispatch(showNoticeModal({ content: '주문 수량이 보유 화폐량을 초과했습니다.' }));
                return;
            }
        }

        dispatch(setWorkingSpinner(true));

        const statusCode = await addTradeHistory(
            user.email,
            selectedCrypto.name,
            tradeType === 'buy' ? '매수' : '매도',
            time,
            selectedCrypto.market,
            currentPrice,
            total,
            selectedPercentage === '100%' && tradeType === 'sell' ? 'ALL' : quantity,
            selectedCrypto.market,
            isMarketValue
        );

        dispatch(setWorkingSpinner(false));
        showModalWithResponse(statusCode, isMarketValue);
    };

    const showModalWithResponse = (statusCode: number, isMarketValue: boolean) => {
        if (statusCode === 200) {
            resetValue();
            dispatch(showNoticeModal({
                content: `성공적으로 화폐를 ${tradeType === 'buy' ? '매수' : '매도'}했습니다.`,
            }));
        } else if (statusCode === 202 && !isMarketValue) {
            resetValue();
            dispatch(showNoticeModal({
                content: `${tradeType === 'buy' ? '매수' : '매도'} 요청이 완료되었습니다. \n요청하신 가격과 일치하는 ${tradeType === 'buy' ? '매도' : '매수'} 요청이 발생하면 거래가 완료됩니다.`,
            }));
        } else {
            dispatch(showNoticeModal({
                content: `화폐 ${tradeType === 'buy' ? '매수' : '매도'}에 실패했습니다.`,
            }));
        }
    };

    useEffect(() => {
        // 주문 수량 초기화
        setQuantity(0);
        setQuantityInputValue('0');

        // 주문 총액 초기화
        setTotal(0);
        setTotalInputValue('0');

        if (selectedCrypto && selectedCrypto.price) {
            setPrice(selectedCrypto.price);
            setPriceInputValue(String(selectedCrypto.price));
        }
    }, [selectedCrypto]);

    return {
        selectedPercentage,
        bidSort,
        total,
        quantity,
        quantityInputValue,
        totalInputValue,
        priceInputValue,
        setBidSort,
        handlePriceChange,
        handleQuantityChange,
        selectPercentage,
        submitTrade,
        resetValue,
        totalValueChange,
    };
};