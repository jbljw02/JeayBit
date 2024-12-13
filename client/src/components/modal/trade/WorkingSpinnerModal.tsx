import { ClipLoader } from "react-spinners"
import Modal from 'react-modal';
import { ModalProps } from '../type/ModalProps';
import '../../../styles/placeholder/spinner.css'
import { useEffect, useState } from "react";
import checkCurrentScreen from "../../../utils/responsive/checkCurrentScreen";

// 화면의 크기에 따라 로더의 크기 지정
const getLoaderSize = () => {
    const screen = checkCurrentScreen();
    switch (screen.device) {
        case 'mobile':
            return 60;
        case 'tablet':
            return 70;
        default:
            return 80;
    }
};

export default function WorkingSpinner({ isModalOpen, setIsModalOpen }: ModalProps) {
    const [loaderSize, setLoaderSize] = useState(getLoaderSize());

    useEffect(() => {
        const screenResize = () => {
            const screen = checkCurrentScreen();
            switch (screen.device) {
                case 'mobile':
                    return 60;
                case 'tablet':
                    return 70;
                default:
                    return 80;
            }
        };

        window.addEventListener('resize', screenResize);
        return () => window.removeEventListener('resize', screenResize);
    }, []);

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
                    WebkitBackdropFilter: 'blur(5px)', // Safari 
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
                    alignItems: 'center',
                    width: '100%',
                }
            }}>
            <ClipLoader
                color="#ffffff"
                size={loaderSize}
                loading={true}
                cssOverride={{
                    border: '3px solid #585858'
                }} />
            <div className="working-spinner-msg">
                <div className="msg-title">요청하신 작업을 처리중이에요</div>
                <div className="msg-content">새로고침을 하시거나 페이지를 이탈하시면 작업이 취소될 수 있습니다. 잠시만 기다려 주세요.</div>
            </div>
        </Modal>
    )
}