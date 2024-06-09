import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

export default function ClosedPrice() {

    const closed_data = useSelector((state: RootState) => state.closed_data);
    const cr_market_selected = useSelector((state: RootState) => state.cr_market_selected);
    const closeHide = useSelector((state: RootState) => state.closeHide);

    return (
        <>
            {/* 스크롤바를 넣기 위해 테이블을 두 개로 구성 */}
            {
                !closeHide ?
                    <>
                        <table className="closedPrice-table lightMode-title">
                            <thead>
                                <tr>
                                    <th>체결시간</th>
                                    <th>체결가격</th>
                                    <th>
                                        체결량<span>({(cr_market_selected).slice(4)})</span>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                        <PerfectScrollbar id="scrollBar-closedPriceTable">
                            <table className="closedPrice-table">
                                <tbody>
                                    {
                                        closed_data.map((item, i) => {
                                            const date = new Date(item.timestamp);
                                            let trade_time = new Intl.DateTimeFormat('ko-KR', {
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,  // 24시간 형식
                                            }).format(date);

                                            trade_time = trade_time.replace(". ", "/").replace(".", "").replace("오전 ", "").replace("오후 ", "")

                                            let str_trade_volume;

                                            // 14자리 이상의 정수인 경우, 14자리로 줄이고 문자열로 반환
                                            if (item.trade_volume > 9999999999999) {
                                                str_trade_volume = String(Math.floor(item.trade_volume));
                                            }
                                            // 소수점을 포함하여 14자리를 넘어갈 수 있는 경우를 처리
                                            else {
                                                str_trade_volume = String(item.trade_volume);
                                                str_trade_volume = str_trade_volume.substring(0, 14);
                                            }

                                            // 문자열의 끝이 '.'로 끝난다면 .을 제거
                                            if (str_trade_volume.endsWith('.')) {
                                                str_trade_volume = str_trade_volume.slice(0, -1)
                                            }

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
                        </PerfectScrollbar>
                    </> :
                    <div className="hide-element">...</div>
            }
        </>
    )
}