import { useAppSelector } from "../../redux/hooks";
import '../../styles/crypto-info/cryptoHeader.css'
import SkeletonUI from "../placeholder/SkeletonUI";
import { ReactComponent as ListIcon } from "../../assets/images/list.svg";
import CryptoIconWrapper from "./child/CryptoIconWrapper";
import { useState, useEffect, useRef } from "react";
import CryptoList from "../crypto-list/CryptoList";
import checkCurrentScreen from "../../utils/responsive/checkCurrentScreen";

export default function CryptoHeader() {
    const allCrypto = useAppSelector(state => state.allCrypto);
    const [isListOpen, setIsListOpen] = useState(false);
    const [listHeight, setListHeight] = useState(0);
    const listContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 리스트의 높이를 업데이트
        const updateListHeight = () => {
            if (listContainerRef.current) {
                // 리스트 컨테이너의 위치 정보 가져오기
                const headerRect = listContainerRef.current.getBoundingClientRect();
                // 현재 뷰포트의 높이
                const viewportHeight = window.innerHeight;
                // 리스트 컨테이너의 상단 위치
                const topOffset = headerRect.top;
                // 하단 여백 설정
                const bottomPadding = 20;

                // 리스트의 높이를 계산하여 설정
                // (뷰포트 높이 - 상단 위치 - 하단 여백)
                setListHeight(viewportHeight - topOffset - bottomPadding);
            }
        };

        if (isListOpen) {
            updateListHeight();
            // 화면 크기가 변경될 때마다 리스트 높이 업데이트
            window.addEventListener('resize', updateListHeight);
        }

        return () => window.removeEventListener('resize', updateListHeight);
    }, [isListOpen]);

    return (
        <>
            {
                allCrypto.length ? (
                    <div className="crypto-header">
                        <CryptoIconWrapper />
                        {
                            checkCurrentScreen().device === 'laptop' &&
                            <>
                                <button
                                    onClick={() => setIsListOpen(!isListOpen)}
                                    className="list-icon-wrapper">
                                    <ListIcon
                                        width={23}
                                        height={23} />
                                </button>
                                {
                                    isListOpen && checkCurrentScreen().device === 'laptop' &&
                                    <div
                                        ref={listContainerRef}
                                        className="list-container"
                                        style={{ height: `${listHeight}px` }}>
                                        <CryptoList />
                                    </div>
                                }
                            </>
                        }
                    </div>
                ) :
                    <div className="crypto-header-skeleton">
                        <SkeletonUI
                            containerHeight="100%"
                            elementsHeight={35}
                            counts={1} />
                    </div>
            }
        </>
    );
}