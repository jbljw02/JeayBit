export type ModalProps = {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export type TradeModalProps = ModalProps & {
    category: 'buy' | 'sell',
}