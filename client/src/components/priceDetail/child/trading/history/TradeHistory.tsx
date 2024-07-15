import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setScheduledCancel } from '../../../../../redux/store'
import useFunction from "../../../../useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import RadioInput from "../../../../input/RadioInput";
import SignedHistory from "./SignedHistory";
import UnSignedHistory from "./UnSignedHistory";
import '../../../../../styles/priceDetail/trading/tradeHistory.css'
import TradingThead from "../TradingThead";
import LoginPrompt from "../../../../LoginPrompt";

export default function TradeHistory() {
    const dispatch = useDispatch();

    const { getTradeHistory, checkLogin } = useFunction();

    const user = useSelector((state: RootState) => state.user);
    const scheduledCancel = useSelector((state: RootState) => state.scheduledCancel);

    const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

    const [historySort, setHistorySort] = useState<string>('체결');
    const historySortOptions = [
        { id: 'radio-signed', value: '체결', label: '체결' },
        { id: 'radio-unSigned', value: '미체결', label: '미체결' },
    ];

    const completeToggleModal = () => {
        setCompleteModalOpen(!completeModalOpen);
    }

    const cancelSubmit = () => {
        let ids: string[] = scheduledCancel.map(item => item.id);
        if (ids.length > 0) {
            cancelOrder(user.email, ids);
        }
    }

    // 주문을 취소할 화폐를 서버로 전송
    const cancelOrder = async (email: string, ids: string[]) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/cancel_order/", {
                ids: ids,
                email: email,
            });
            getTradeHistory(user.email);
            dispatch(setScheduledCancel([]));
            completeToggleModal();

            console.log("주문 취소 정보 전송 성공", response.data);
        } catch (error) {
            console.error("주문 취소 정보 전송 실패");
        }
    }

    return (
        <>
            <div className="history-head">
                <TradingThead
                    options={historySortOptions}
                    selectedValue={historySort}
                    onChange={setHistorySort}
                    label="체결구분" />
                <div
                    id="trading-history-cancel"
                    style={{ visibility: historySort === '미체결' ? 'visible' : 'hidden' }}
                    onClick={cancelSubmit}>
                    주문 취소
                </div>
            </div>
            <div className="div-trading-table">
                <table
                    className="table-trading-history"
                    id={`${user.email !== '' ? 'historyHead' : ''}`}>
                    <thead>
                        <tr>
                            <th>주문시간</th>
                            <th>
                                <div>마켓</div>
                                <div>구분</div>
                            </th>
                            <th>
                                <div>체결가격</div>
                                <div>체결금액</div>
                            </th>
                            <th>수량</th>
                        </tr>
                    </thead>
                </table>
                <PerfectScrollbar id="scrollBar-trading-history-table">
                    <table className="table-trading-history" id="historyBody">
                        <tbody>
                            {
                                // 체결된 화폐들의 거래내역
                                historySort === '체결' ?
                                    <SignedHistory /> :
                                    // 체결되지 않은 화폐들의 거래내역
                                    <UnSignedHistory />
                            }
                        </tbody>
                    </table>
                </PerfectScrollbar>
            </div>
        </>
    )
}