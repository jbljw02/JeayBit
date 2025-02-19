export type UserTradeHistory = {
    id: string,
    cryptoMarket: string,
    cryptoName: string,
    cryptoPrice: number,
    tradeAmount: string,
    tradeCategory: string,
    tradePrice: string,
    tradeTime: any,
    user: string,
    isSigned: boolean,
}

export type ScheduleCancel = {
    id: string,
    index: number,
}

export type NoticeModalProps = {
    isOpen: boolean;
    content: string;
    buttonLabel?: string;
    actionType?: string;
}