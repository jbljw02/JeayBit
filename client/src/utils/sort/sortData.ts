import { Crypto } from "../../redux/features/cryptoListSlice";

// 화폐명에 따라 정렬
export const sortByName = (data: Crypto[], order: number) => {
    // 새로운 배열을 반환하여 원본 배열을 수정하지 않도록
    return [...data].sort((a, b) => {
        if (order === 1) {
            return a.name.localeCompare(b.name);
        } else if (order === 2) {
            return b.name.localeCompare(a.name);
        }
        return 0;
    });
};

// 가격에 따라 정렬
export const sortByPrice = (data: Crypto[], sortOrder: number): Crypto[] => {
    return [...data].sort((a, b) => {
        if (sortOrder === 1) {
            return a.price - b.price; // 오름차순
        } else if (sortOrder === 2) {
            return b.price - a.price; // 내림차순
        }
        return 0; // 정렬하지 않음
    });
};

// 변화율에 따라 정렬
export const sortByChangeRate = (data: Crypto[], order: number) => {
    let riseCrypto = [...data].filter(item => item.change === 'RISE');
    let evenCrypto = [...data].filter(item => item.change === 'EVEN');
    let fallCrypto = [...data].filter(item => item.change === 'FALL');

    if (order === 1) {
        riseCrypto.sort((a, b) => b.changeRate - a.changeRate);
        evenCrypto.sort((a, b) => b.changeRate - a.changeRate);
        fallCrypto.sort((a, b) => a.changeRate - b.changeRate);

        return [...riseCrypto, ...evenCrypto, ...fallCrypto];
    } else if (order === 2) {
        fallCrypto.sort((a, b) => b.changeRate - a.changeRate);
        evenCrypto.sort((a, b) => b.changeRate - a.changeRate);
        riseCrypto.sort((a, b) => a.changeRate - b.changeRate);

        return [...fallCrypto, ...evenCrypto, ...riseCrypto];
    }

    return data;
};

// 거래대금에 따라 정렬
export const sortByTradeVolume = (data: Crypto[], order: number) => {
    return [...data].sort((a, b) => {
        if (order === 1) {
            return b.tradePrice - a.tradePrice;
        } else if (order === 2) {
            return a.tradePrice - b.tradePrice;
        }
        return 0;
    });
};

export const sortData = (data: Crypto[], sortStates: number[]) => {
    if (sortStates[0] !== 0) {
        return sortByName(data, sortStates[0]);
    } else if (sortStates[1] !== 0) {
        return sortByPrice(data, sortStates[1]);
    } else if (sortStates[2] !== 0) {
        return sortByChangeRate(data, sortStates[2]);
    } else if (sortStates[3] !== 0) {
        return sortByTradeVolume(data, sortStates[3]);
    }
    return data;
};
