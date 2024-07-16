import { useDispatch, useSelector } from "react-redux";
import { RootState, setCloseHide } from "../../../../redux/store";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import adjustSize from "../../../../utils/format/adjustSize";
import convertToDate from "../../../../utils/date/covertToDate";
import '../../../../styles/priceDetail/asking/asking.css'
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";

export default function ClosedPrice() {
    const dispatch = useDispatch();

    const closed_data = useSelector((state: RootState) => state.closed_data);
    const closeHide = useSelector((state: RootState) => state.closeHide);
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

    return (
        <>
            <div className="closed-section">
                <div className="priceDetail-title closed">
                    체결내역
                    <svg className="arrow-hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 5"
                        onClick={() => dispatch(setCloseHide(!closeHide))}
                        style={{
                            pointerEvents: 'all',
                            transformOrigin: closeHide ? '50% 50%' : undefined,
                            transform: closeHide ? 'rotate(270deg)' : undefined
                        }}>
                        <path d="M5.016 0 0 .003 2.506 2.5 5.016 5l2.509-2.5L10.033.003 5.016 0z" />
                    </svg>
                </div>
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
                            <CustomScrollbars
                                id="scrollBar-closedPriceTable"
                                style={{ width: '100%', height: '360px' }}>
                                <table className="asking-table">
                                    <tbody>
                                        {
                                            closed_data.map((item, i) => {
                                                const trade_time = convertToDate(item.timestamp)
                                                const str_trade_volume = adjustSize(item.trade_volume);

                                                return (
                                                    <tr key={i}>
                                                        <td>{trade_time}</td>
                                                        <td>{(item.trade_price).toLocaleString()}</td>
                                                        {
                                                            item.ask_bid === 'BID' ?
                                                                <td className="td-rise">{str_trade_volume}</td> :
                                                                <td className="td-fall">{str_trade_volume}</td>
                                                        }
                                                    </tr>
                                                )
                                            }
                                            )
                                        }
                                    </tbody>
                                </table>
                            </CustomScrollbars>
                        </> :
                        <div className="hide-element">...</div>
                }
            </div>
        </>
    )
}