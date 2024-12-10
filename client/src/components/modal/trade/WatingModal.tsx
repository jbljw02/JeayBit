import Modal from 'react-modal';
import styles from '../../../styles/modal/modal.module.css'
import { TradeModalProps } from '../type/ModalProps';

export default function WaitingModal({ isModalOpen, setIsModalOpen, category }: TradeModalProps) {
    return (
        <Modal
            isOpen={isModalOpen}
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
                        className={styles.modalButton}
                        onClick={() => setIsModalOpen(false)}>
                        확인
                    </button>
                </div>
            </div>
        </Modal>
    )
}