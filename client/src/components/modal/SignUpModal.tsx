import Modal from 'react-modal';
import styles from '../../styles/modal/modal.module.css'
import { ModalProps } from './SubmitModal';
import { useNavigate } from 'react-router-dom';

export default function SignUpModal({ isModalOpen, setIsModalOpen }: ModalProps) {
    const navigate = useNavigate();

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
                <div className={styles.content}>
                    회원가입이 성공적으로 완료되었습니다.
                </div>
                <button
                    className='cursor-pointer'
                    onClick={() => {
                        setIsModalOpen(false)
                        navigate('/login')
                    }}>
                    확인
                </button>
            </div>
        </Modal>
    )
}