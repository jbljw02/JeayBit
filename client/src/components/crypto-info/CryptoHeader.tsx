import { useAppSelector } from "../../redux/hooks";
import '../../styles/crypto-info/cryptoHeader.css'
import SkeletonUI from "../placeholder/SkeletonUI";
import { ReactComponent as ListIcon } from "../../assets/images/list.svg";
import CryptoIconWrapper from "./child/CryptoIconWrapper";
import { useState } from "react";
import CryptoList from "../crypto-list/CryptoList";
import checkCurrentScreen from "../../utils/responsive/checkCurrentScreen";

export default function CryptoHeader() {
    const allCrypto = useAppSelector(state => state.allCrypto);
    const [isListOpen, setIsListOpen] = useState(false);

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
                                    <div className="list-container">
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