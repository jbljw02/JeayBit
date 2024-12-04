import { setSuccessTransfer, setFailTransfer } from "../../redux/features/walletSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import NoticeModal from "../modal/common/NoticeModal";

export default function useRenderTransferModal() {
    const dispatch = useAppDispatch();

    const successTransfer = useAppSelector(state => state.successTransfer);
    const failTransfer = useAppSelector(state => state.failTransfer);
    const transferCategory = useAppSelector(state => state.transferCategory);

    // 입/출금 완료 시 띄울 모달 결정
    const renderTransferModal = () => {
        if (successTransfer) {
            return (
                <NoticeModal
                    isModalOpen={successTransfer}
                    setIsModalOpen={() => dispatch(setSuccessTransfer(false))}
                    content={`${transferCategory === 'deposit' ? '입금' : '출금'}이 성공적으로 완료되었습니다.`} />
            );
        }
        if (failTransfer) {
            return (
                <NoticeModal
                    isModalOpen={failTransfer}
                    setIsModalOpen={() => dispatch(setFailTransfer(false))}
                    content={`${transferCategory === 'deposit' ? '입금' : '출금'}에 실패했습니다.`} />
            );
        }

        return null;
    };

    return renderTransferModal;
}