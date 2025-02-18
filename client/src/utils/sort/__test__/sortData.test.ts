import { sortData, sortByName, sortByPrice, sortByChangeRate, sortByTradeVolume } from '../sortData';
import { Crypto } from '../../../redux/features/cryptoListSlice';

describe('정렬 함수 테스트', () => {
    const mockData: Crypto[] = [
        {
            name: 'Bitcoin',
            price: 50000,
            market: 'KRW-BTC',
            change: 'RISE',
            changeRate: 5.5,
            changePrice: 2500,
            tradePrice: 1000000,
            tradeVolume: 20,
            openPrice: 47500,
            highPrice: 51000,
            lowPrice: 47000,
            isFavorited: false,
            isOwned: false,
            ownedQuantity: 0
        },
        {
            name: 'Ethereum',
            price: 3000,
            market: 'KRW-ETH',
            change: 'FALL',
            changeRate: -2.3,
            changePrice: -69,
            tradePrice: 500000,
            tradeVolume: 10,
            openPrice: 3050,
            highPrice: 3100,
            lowPrice: 2950,
            isFavorited: false,
            isOwned: false,
            ownedQuantity: 0
        },
        {
            name: 'XRP',
            price: 1,
            market: 'KRW-XRP',
            change: 'EVEN',
            changeRate: 0,
            changePrice: 0,
            tradePrice: 100000,
            tradeVolume: 100,
            openPrice: 0.99,
            highPrice: 1.01,
            lowPrice: 0.98,
            isFavorited: false,
            isOwned: false,
            ownedQuantity: 0
        },
        {
            name: 'Dogecoin',
            price: 0.5,
            market: 'KRW-DOGE',
            change: 'RISE',
            changeRate: 3.2,
            changePrice: 1500,
            tradePrice: 300000,
            tradeVolume: 1000,
            openPrice: 0.45,
            highPrice: 0.47,
            lowPrice: 0.44,
            isFavorited: false,
            isOwned: false,
            ownedQuantity: 0
        }
    ];

    describe('화폐명 정렬', () => {
        it('오름차순으로 정렬되어야 함', () => {
            const result = sortByName(mockData, 1);
            expect(result.map(item => item.name)).toEqual(['Bitcoin', 'Dogecoin', 'Ethereum', 'XRP']);
        });

        it('내림차순으로 정렬되어야 함', () => {
            const result = sortByName(mockData, 2);
            expect(result.map(item => item.name)).toEqual(['XRP', 'Ethereum', 'Dogecoin', 'Bitcoin']);
        });

        it('정렬 순서가 0이면 원본 배열을 반환해야 함', () => {
            const result = sortByName(mockData, 0);
            expect(result).toEqual(mockData);
        });
    });

    describe('가격 정렬', () => {
        it('오름차순으로 정렬되어야 함', () => {
            const result = sortByPrice(mockData, 1);
            expect(result.map(item => item.price)).toEqual([0.5, 1, 3000, 50000]);
        });

        it('내림차순으로 정렬되어야 함', () => {
            const result = sortByPrice(mockData, 2);
            expect(result.map(item => item.price)).toEqual([50000, 3000, 1, 0.5]);
        });

        it('정렬 순서가 0이면 원본 배열을 반환해야 함', () => {
            const result = sortByPrice(mockData, 0);
            expect(result).toEqual(mockData);
        });
    });

    describe('변화율 정렬', () => {
        it('상승순으로 정렬되어야 함 (RISE > EVEN > FALL)', () => {
            const result = sortByChangeRate(mockData, 1);
            expect(result.map(item => item.change)).toEqual(['RISE', 'RISE', 'EVEN', 'FALL']);
            expect(result.filter(item => item.change === 'RISE').map(item => item.changeRate))
                .toEqual([5.5, 3.2]); // 상승순이므로 RISE 내에서는 변화율 높은 순
        });

        it('하락순으로 정렬되어야 함 (FALL > EVEN > RISE)', () => {
            const result = sortByChangeRate(mockData, 2);
            expect(result.map(item => item.change)).toEqual(['FALL', 'EVEN', 'RISE', 'RISE']);
            expect(result.filter(item => item.change === 'RISE').map(item => item.changeRate))
                .toEqual([3.2, 5.5]); // 하락순이므로 RISE 내에서는 변화율 낮은 순
        });

        it('RISE, EVEN, FALL 각각의 그룹 내에서 올바르게 정렬되어야 함', () => {
            const extendedMockData = [
                ...mockData,
                {
                    ...mockData[0],
                    name: 'Bitcoin2',
                    change: 'RISE',
                    changeRate: 2.5
                },
                {
                    ...mockData[0],
                    name: 'Ethereum2',
                    change: 'EVEN',
                    changeRate: -0.1
                },
                {
                    ...mockData[0],
                    name: 'XRP2',
                    change: 'FALL',
                    changeRate: -3.5
                }
            ];

            // 상승순(order=1) 정렬 테스트
            const resultAsc = sortByChangeRate(extendedMockData, 1);
            // RISE 그룹 내에서는 변화율이 높은 순서대로 정렬되어야 함 (5.5 > 3.2 > 2.5)
            expect(resultAsc.filter(item => item.change === 'RISE').map(item => item.changeRate))
                .toEqual([5.5, 3.2, 2.5]);
            // EVEN 그룹 내에서는 변화율이 높은 순서대로 정렬되어야 함 (0 > -0.1)
            expect(resultAsc.filter(item => item.change === 'EVEN').map(item => item.changeRate))
                .toEqual([0, -0.1]);
            // 상승순이므로 FALL 그룹 내에서는 변화율이 낮은 순서대로 정렬되어야 함 (-3.5 < -2.3)
            expect(resultAsc.filter(item => item.change === 'FALL').map(item => item.changeRate))
                .toEqual([-3.5, -2.3]);

            // 하락순(order=2) 정렬 테스트
            const resultDesc = sortByChangeRate(extendedMockData, 2);
            // FALL 그룹 내에서는 변화율이 높은 순서대로 정렬되어야 함 (-2.3 > -3.5)
            expect(resultDesc.filter(item => item.change === 'FALL').map(item => item.changeRate))
                .toEqual([-2.3, -3.5]);
            // EVEN 그룹 내에서는 변화율이 높은 순서대로 정렬되어야 함 (0 > -0.1)
            expect(resultDesc.filter(item => item.change === 'EVEN').map(item => item.changeRate))
                .toEqual([0, -0.1]);
            // 하락순이므로 RISE 그룹 내에서는 변화율이 낮은 순서대로 정렬되어야 함 (2.5 < 3.2 < 5.5)
            expect(resultDesc.filter(item => item.change === 'RISE').map(item => item.changeRate))
                .toEqual([2.5, 3.2, 5.5]);
        });

        it('정렬 순서가 0이면 원본 배열을 반환해야 함', () => {
            const result = sortByChangeRate(mockData, 0);
            expect(result).toEqual(mockData);
        });
    });

    describe('거래대금 정렬', () => {
        it('오름차순으로 정렬되어야 함', () => {
            const result = sortByTradeVolume(mockData, 1);
            expect(result.map(item => item.tradePrice)).toEqual([1000000, 500000, 300000, 100000]);
        });

        it('내림차순으로 정렬되어야 함', () => {
            const result = sortByTradeVolume(mockData, 2);
            expect(result.map(item => item.tradePrice)).toEqual([100000, 300000, 500000, 1000000]);
        });

        it('정렬 순서가 0이면 원본 배열을 반환해야 함', () => {
            const result = sortByTradeVolume(mockData, 0);
            expect(result).toEqual(mockData);
        });
    });

    describe('통합 정렬 함수', () => {
        it('정렬 상태에 따라 적절한 정렬이 적용되어야 함', () => {
            // 화폐명 오름차순
            expect(sortData(mockData, [1, 0, 0, 0]).map(item => item.name))
                .toEqual(['Bitcoin', 'Dogecoin', 'Ethereum', 'XRP']);

            // 가격 내림차순
            expect(sortData(mockData, [0, 2, 0, 0]).map(item => item.price))
                .toEqual([50000, 3000, 1, 0.5]);

            // 변화율 상승순
            expect(sortData(mockData, [0, 0, 1, 0]).map(item => item.change))
                .toEqual(['RISE', 'RISE', 'EVEN', 'FALL']);

            // 거래대금 오름차순
            expect(sortData(mockData, [0, 0, 0, 1]).map(item => item.tradePrice))
                .toEqual([1000000, 500000, 300000, 100000]);
        });

        it('정렬 상태가 모두 0이면 원본 배열을 반환해야 함', () => {
            expect(sortData(mockData, [0, 0, 0, 0])).toEqual(mockData);
        });

        it('여러 정렬 상태가 동시에 설정된 경우 우선순위에 따라 정렬되어야 함', () => {
            // 화폐명이 우선순위가 가장 높음
            expect(sortData(mockData, [1, 1, 1, 1]).map(item => item.name))
                .toEqual(['Bitcoin', 'Dogecoin', 'Ethereum', 'XRP']);

            // 가격이 두 번째 우선순위
            expect(sortData(mockData, [0, 2, 1, 1]).map(item => item.price))
                .toEqual([50000, 3000, 1, 0.5]);

            // 변화율이 세 번째 우선순위
            expect(sortData(mockData, [0, 0, 1, 1]).map(item => item.change))
                .toEqual(['RISE', 'RISE', 'EVEN', 'FALL']);

            // 거래대금이 마지막 우선순위
            expect(sortData(mockData, [0, 0, 0, 1]).map(item => item.tradePrice))
                .toEqual([1000000, 500000, 300000, 100000]);
        });
    });
});