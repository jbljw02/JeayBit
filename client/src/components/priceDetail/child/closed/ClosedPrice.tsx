import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import adjustSize from "../../../../utils/format/adjustSize";
import convertToDate from "../../../../utils/date/covertToDate";
import '../../../../styles/priceDetail/asking/asking.css'
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";
import AskingTitle from "../asking/AskingTitle";
import { useState } from "react";
import SkeletonUI from "../../../placeholder/SkeletonUI";
import LoadingSpinner from "../../../placeholder/LoadingSpinner";

export default function ClosedPrice() {
    const askingSpinner = useSelector((state: RootState) => state.askingSpinner);
    const askingData = useSelector((state: RootState) => state.askingData);
    const closedData = useSelector((state: RootState) => state.closedData);
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const [closeHide, setCloseHide] = useState(false);

    return (
        <>
            <div className="closed-section">
                <AskingTitle
                    contentsHide={closeHide}
                    setContentsHide={setCloseHide}
                    title="체결내역" />
                {
                    !closeHide ?
                        <>
                            <table className="asking-table">
                                <thead>
                                    <tr>
                                        <th>체결시간</th>
                                        <th>체결가격</th>
                                        <th>
                                            체결량
                                            <span>
                                                ({
                                                    selectedCrypto && selectedCrypto.market &&
                                                    (selectedCrypto.market).slice(4)
                                                })
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                            <div style={{ height: '335px' }}>
                                {
                                    askingSpinner ?
                                        <LoadingSpinner
                                            containerHeight={"100%"}
                                            size={40} /> :
                                        (

                                            askingData.length ?
                                                <CustomScrollbars style={{ width: '100%', height: '100%' }}>
                                                    <table className="asking-table">
                                                        <tbody>
                                                            {
                                                                closedData.map((item, i) => {
                                                                    const trade_time = convertToDate(item.timestamp);
                                                                    const str_trade_volume = adjustSize(item.trade_volume);

                                                                    return (
                                                                        <tr key={i}>
                                                                            <td>{trade_time}</td>
                                                                            <td>{(item.trade_price).toLocaleString()}</td>
                                                                            {
                                                                                item.ask_bid === 'BID' ?
                                                                                    <td className="rise">{str_trade_volume}</td> :
                                                                                    <td className="fall">{str_trade_volume}</td>
                                                                            }
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </CustomScrollbars> :
                                                <SkeletonUI
                                                    containerHeight="335px"
                                                    elementsHeight={20} />
                                        )
                                }
                            </div>
                        </> :
                        <div className="hide-element">...</div>
                }
            </div>
        </>
    )
}