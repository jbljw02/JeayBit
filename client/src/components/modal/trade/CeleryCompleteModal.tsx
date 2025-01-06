import Modal from 'react-modal';
import styles from '../../../styles/modal/modal.module.css'
import formatDateString from '../../../utils/date/formatDateString';
import formatWithComas from '../../../utils/format/formatWithComas';
import { ModalProps } from '../type/ModalProps';
import { CeleryData } from '../../trading/TradeSection';

type CeleryModalProps = ModalProps & {
    celeryData: CeleryData,
}

export default function CeleryCompleteModal({ isModalOpen, setIsModalOpen, celeryData }: CeleryModalProps) {
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
                    height: 165,
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
                        <div className={styles.content}>
                            화폐의
                            {
                                celeryData.tradeCategory === 'BUY' ?
                                    <b style={{ color: '#22ab94' }}> 매수 </b> :
                                    <b style={{ color: '#f23645' }}> 매도 </b>
                            }
                            거래가 체결되었습니다.
                            <div className={styles.contentDetail}>
                                <div>거래 화폐: <b>{celeryData.name}</b></div>
                                <div>
                                    거래 요청시간: <b>{celeryData.tradeTime &&
                                        formatDateString(celeryData.tradeTime)}</b>
                                </div>
                                <div>거래가: <b>{formatWithComas(celeryData.price)} KRW</b></div>
                            </div>
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