import { useState } from "react";
import PINoticeModal from "../../modal/auth/PINoticeModal"

type PICheckboxProps = {
    isAgreeForPersonalInfo: boolean,
    setIsAgreeForPersonalInfo: React.Dispatch<React.SetStateAction<boolean>>,
    isVibrate: boolean,
    isSubmitted: boolean,
}

export default function PICheckbox({ isAgreeForPersonalInfo, setIsAgreeForPersonalInfo, isVibrate, isSubmitted }: PICheckboxProps) {
    const [isPIModalOpen, setIsPIModalOpen] = useState<boolean>(false);
    return (
        <>
            <div className="personal-info-container">
                <input
                    type="checkbox"
                    className="cursor-pointer"
                    onChange={() => setIsAgreeForPersonalInfo(!isAgreeForPersonalInfo)}
                    checked={isAgreeForPersonalInfo} />
                <div>
                    <button
                        onClick={() => setIsPIModalOpen(true)}
                        className={`${isVibrate && 'vibrate'}`}
                        style={{
                            color: `${isSubmitted && !isAgreeForPersonalInfo ? 'red' : 'black'}`
                        }}>
                        개인정보 처리방침</button>
                    에 동의합니다.
                </div>
            </div>
            <PINoticeModal
                isModalOpen={isPIModalOpen}
                setIsModalOpen={setIsPIModalOpen}
                setIsAgree={setIsAgreeForPersonalInfo} />
        </>
    )
}