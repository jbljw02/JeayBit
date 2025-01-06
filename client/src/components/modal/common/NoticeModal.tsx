import Modal from 'react-modal';
import styles from '../../../styles/modal/modal.module.css'
import { ModalProps } from '../type/ModalProps';
import { useAppSelector } from '../../../redux/hooks';
import { useEffect } from 'react';

export default function NoticeModal({ isModalOpen, setIsModalOpen }: ModalProps) {
    const noticeModal = useAppSelector(state => state.noticeModal);

    const closeEvent = () => {
        setIsModalOpen(false);

        if (noticeModal.actionType === 'LOGOUT') {
            window.location.href = '/';
        }
        else if (noticeModal.actionType === 'REDIRECT_LOGIN') {
            window.location.href = '/login';
        }
        else if (noticeModal.actionType === 'WINDOW_CLOSE') {
            window.close();
        }
    }

    const enterCloseEvent = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('keydown', enterCloseEvent);
        }
        return () => {
            document.removeEventListener('keydown', enterCloseEvent);
        };
    }, [isModalOpen]);

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
                    zIndex: 1001,
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