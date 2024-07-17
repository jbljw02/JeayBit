import { Crypto } from "../../redux/store";

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
    let rise_crypto = [...data].filter(item => item.change_rate > 0);
    let even_crypto = [...data].filter(item => item.change_rate === 0);
    let fall_crypto = [...data].filter(item => item.change_rate < 0);

    if (order === 1) {
        rise_crypto.sort((a, b) => b.change_rate - a.change_rate);
        even_crypto.sort((a, b) => b.change_rate - a.change_rate);
        fall_crypto.sort((a, b) => a.change_rate - b.change_rate);
    } else if (order === 2) {
        fall_crypto.sort((a, b) => b.change_rate - a.change_rate);
        even_crypto.sort((a, b) => b.change_rate - a.change_rate);
        rise_crypto.sort((a, b) => a.change_rate - b.change_rate);
    }

    return [...rise_crypto, ...even_crypto, ...fall_crypto];
};

// 거래대금에 따라 정렬
export const sortByTradeVolume = (data: Crypto[], order: number) => {
    return [...data].sort((a, b) => {
        if (order === 1) {
            return b.trade_price - a.trade_price;
        } else if (order === 2) {
            return a.trade_price - b.trade_price;
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
