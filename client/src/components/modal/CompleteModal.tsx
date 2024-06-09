import Modal from 'react-modal';
import styles from '../../styles/modal/modal.module.css'
import { ModalProps } from './SubmitModal';

export default function CompleteModal({ isModalOpen, setIsModalOpen, category }: ModalProps) {
    return (
        <Modal
            isOpen={isModalOpen}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    position: 'absolute',
                    left: '50%',
                    top: '48%',
                    width: 500,
                    height: 155,
                    transform: 'translate(-50%, -50%)',
                }
            }}>
            <div className={styles.container}>
                <div className={styles.title}>
                    안내
                </div>
                {
                    category === 'buy' ?
                        <div className={styles.content}>
                            성공적으로 화폐를 매수했습니다.
                        </div> :
                        <div className={styles.content}>
                            성공적으로 화폐를 매도했습니다.
                        </div>
                }
                <button
                    className='cursor-pointer'
                    onClick={() => setIsModalOpen(false)}>
                    확인
                </button>
            </div>
        </Modal>
    )
}