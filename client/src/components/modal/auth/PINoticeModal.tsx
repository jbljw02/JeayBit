import Modal from 'react-modal';
import CommonButton from '../../common/CommonButton';
import { ReactComponent as CloseIcon } from '../../../assets/images/home-btn.svg';
import '../../../styles/modal/piNoticeModal.css'

interface modalProps {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAgree: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function PINoticeModal({ isModalOpen, setIsModalOpen, setIsAgree }: modalProps) {
    const modalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
        },
        content: {
            position: 'absolute' as const,
            width: 520,
            height: 'fit-content',
            padding: 30,
            overflow: 'auto',
            border: 'none',
            borderRadius: '4px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    return (
        <Modal
            isOpen={isModalOpen}
            style={modalStyle}>
            <div className="pi-notice-container">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className='pi-notice-close-btn'>
                    <CloseIcon
                        className="pi-notice-close-icon"
                        width="15" />
                </button>
                <div className="pi-notice-header">
                    <div className="pi-notice-title">개인정보 처리방침</div>
                </div>
                <div className="pi-notice-section">
                    <div className="pi-notice-subtitle">1. 개인정보 수집 이용에 대한 동의</div>
                    <div className="pi-notice-content">
                        귀하의 개인정보는 아래의 방침에 따라 수집 및 이용됩니다. <br />
                        JeayBit은 필요한 최소한의 개인정보만을 수집하며, 수집된 개인정보는 철저한 보호와 관리를 통해 취급될 것임을 약속드립니다. <br />
                        이에 따라, 개인정보의 수집 및 활용에 관한 귀하의 동의를 요청드립니다.
                    </div>
                </div>
                <div className="pi-notice-section">
                    <div className="pi-notice-subtitle">2. 개인정보 수집 목적</div>
                    <div className="pi-notice-content">
                        귀하를 JeayBit의 회원으로서 관리하기 위해 개인정보가 수집됩니다.
                    </div>
                </div>
                <div className="pi-notice-section">
                    <div className="pi-notice-subtitle">3. 개인정보의 수집 항목</div>
                    <div className="pi-notice-content">
                        필수항목: 성명, 이메일, 비밀번호
                    </div>
                </div>
                <div className="pi-notice-section">
                    <div className="pi-notice-subtitle">4. 개인정보의 보존 기간</div>
                    <div className="pi-notice-content">
                        보존기간: 회원 탈퇴 전까지 <br />
                        회원 탈퇴 후에는 개인 정보를 즉시 파기합니다.
                    </div>
                </div>
                <div className="pi-notice-section">
                    <div className="pi-notice-subtitle">5. 개인정보 수집을 거부할 수 있는 권리 및 거부 시의 영향</div>
                    <div className="pi-notice-content">
                        회원가입을 위해 필수적인 개인정보의 수집 및 이용에 대한 동의는 필수입니다. 이에 동의하지 않으시면, 회원가입이 불가능합니다.
                    </div>
                </div>
                <div className='pi-notice-button-group'>
                    <CommonButton
                        label="동의"
                        category="black"
                        onClick={() => {
                            setIsModalOpen(false)
                            setIsAgree(true);
                        }} />
                    <CommonButton
                        label="거부"
                        category="white"
                        onClick={() => {
                            setIsModalOpen(false)
                            setIsAgree(false);
                        }} />
                </div>
            </div>
        </Modal>
    )
}