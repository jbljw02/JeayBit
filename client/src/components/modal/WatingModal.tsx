import Modal from 'react-modal';
import styles from '../../styles/modal/modal.module.css'
import { ModalProps } from './SubmitModal';

export default function WaitingModal({ isModalOpen, setIsModalOpen, category }: ModalProps) {
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
                    width: 460,
                    height: 145,
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
                            매수 요청이 완료되었습니다. <br />
                            요청하신 가격과 일치하는 매도 요청이 발생하면 거래가 완료됩니다.
                        </div> :
                        <div className={styles.content}>
                            매도 요청이 완료되었습니다. <br />
                            요청하신 가격과 일치하는 매수 요청이 발생하면 거래가 완료됩니다.
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