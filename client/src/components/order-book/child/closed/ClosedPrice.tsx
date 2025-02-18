import { useAppSelector } from "../../../../redux/hooks";
import adjustSize from "../../../../utils/format/adjustSize";
import convertToDate from "../../../../utils/format/covertToDate";
import '../../../../styles/price-detail/orderbook/orderbook.css'
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";
import { useState } from "react";
import SkeletonUI from "../../../placeholder/SkeletonUI";
import LoadingSpinner from "../../../placeholder/LoadingSpinner";

export default function ClosedPrice() {
    const askingSpinner = useAppSelector(state => state.askingSpinner);
    const askingData = useAppSelector(state => state.askingData);
    const closedData = useAppSelector(state => state.closedData);
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const [closeHide, setCloseHide] = useState(false);

    return (
        <>
            <div className="orderbook-section">
                {
                    !closeHide ?
                        <>
                            <table className="orderbook-table">
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
                            <div className="orderbook-content">
                                {
                                    askingSpinner ?
                                        <LoadingSpinner
                                            containerHeight={"100%"}
                                            size={40} /> :
                                        (

                                            askingData.length ?
                                                <CustomScrollbars id="scrollbar-orderbook">
                                                    <table className="orderbook-table">
                                                        <tbody>
                                                            {
                                                                closedData.map((item, i) => {
                                                                    const trade_time = convertToDate(item.timestamp);
                                                                    const str_trade_volume = adjustSize(item.tradeVolume);

                                                                    return (
                                                                        <tr key={i}>
                                                                            <td>{trade_time}</td>
                                                                            <td>{(item.tradePrice).toLocaleString()}</td>
                                                                            {
                                                                                item.askBid === 'BID' ?
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