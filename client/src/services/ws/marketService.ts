import axios from '../../api/axios';
import camelcaseKeys from 'camelcase-keys';

interface MarketInfo {
    market: string;
    koreanName: string;
}

// 마켓 정보를 담는 맵
export let marketInfoMap: Record<string, string> = {};

// 마켓 정보 초기화
export const initializeMarkets = async () => {
    try {
        const response = await axios.get('https://api.upbit.com/v1/market/all');
        const marketList = camelcaseKeys(response.data, { deep: true });

        // 마켓 정보 맵 업데이트
        marketInfoMap = marketList.reduce((acc: Record<string, string>, item: MarketInfo) => {
            if (item.market.startsWith('KRW-')) {
                acc[item.market] = item.koreanName;
            }
            return acc;
        }, {});

        return Object.keys(marketInfoMap);
    } catch (error) {
        console.error("마켓 데이터 조회 실패:", error);
        throw error;
    }
};