import { ClipLoader } from "react-spinners"
import Modal from 'react-modal';
import { ModalProps } from '../type/ModalProps';
import '../../../styles/placeholder/spinner.css'

const loaderStyle = {
    border: '3px solid #585858'
}

export default function WorkingSpinner({ isModalOpen, setIsModalOpen }: ModalProps) {
    return (
        <Modal
            isOpen={isModalOpen}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)' // Safari 
                },
                content: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }}>
            <ClipLoader
                color="#ffffff"
                size={80}
                loading={true}
                cssOverride={loaderStyle}
            />
            <div className="working-spinner-msg">
                <div className="msg-title">작업을 처리중입니다</div>
                <div className="msg-content">새로고침을 하시거나 페이지를 이탈하시면 작업이 취소될 수 있습니다. 잠시만 기다려 주세요.</div>
            </div>
        </Modal>
    )
}