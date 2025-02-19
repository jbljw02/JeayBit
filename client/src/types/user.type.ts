export type User = {
    name: string,
    email: string,
    balance: number
}

export type TransferSort = '입금' | '출금' | '잔고';