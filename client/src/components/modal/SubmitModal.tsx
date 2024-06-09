import Modal from 'react-modal';
import styles from '../../styles/modal/modal.module.css'

export type ModalProps = {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    category?: string,
}

export default function SubmitModal({ isModalOpen, setIsModalOpen, category }: ModalProps) {
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
                            매수 요청이 정상적으로 완료되었습니다. <br />
                            요청하신 매수 가격과 일치하는 매도 요청이 발생하면 거래가 완료됩니다.
                        </div> :
                        <div className={styles.content}>
                            매도 요청이 정상적으로 완료되었습니다. <br />
                            요청하신 매도 가격과 일치하는 매수 요청이 발생하면 거래가 완료됩니다.
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