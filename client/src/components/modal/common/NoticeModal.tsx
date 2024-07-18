import Modal from 'react-modal';
import styles from '../../../styles/modal/modal.module.css'
import { ModalProps } from '../type/ModalProps';

type NoticeProps = ModalProps & {
    content: string,
}

export default function NoticeModal({ isModalOpen, setIsModalOpen, content }: NoticeProps) {
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
                    width: 460,
                    height: 145,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001
                }
            }}
        >
            <div className={styles.container}>
                <div className={styles.title}>
                    안내
                </div>
                <div className={styles.content}>
                    {content}
                </div>
                <button
                    className='cursor-pointer'
                    onClick={() => {
                        setIsModalOpen(false)
                    }}>
                    확인
                </button>
            </div>
        </Modal>
    )
}