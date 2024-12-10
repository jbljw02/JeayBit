import Modal from 'react-modal';
import styles from '../../../styles/modal/modal.module.css'
import { ModalProps } from '../type/ModalProps';
import { useAppSelector } from '../../../redux/hooks';

export default function NoticeModal({ isModalOpen, setIsModalOpen }: ModalProps) {
    const noticeModal = useAppSelector(state => state.noticeModal);

    const closeEvent = () => {
        setIsModalOpen(false);
        if (noticeModal.onClick) {
            noticeModal.onClick();
        }
    }

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '48%',
                    width: 'fit-content',
                    height: 145,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001
                }
            }}>
            <div className={styles.container}>
                <div className={styles.title}>
                    안내
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.content} style={{ whiteSpace: 'pre-line' }}>
                        {noticeModal.content}
                    </div>
                    <button
                        className={styles.modalButton}
                        onClick={closeEvent}>
                        {noticeModal.buttonLabel || '확인'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}