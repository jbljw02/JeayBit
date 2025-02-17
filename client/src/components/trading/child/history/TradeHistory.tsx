import axios from "axios";
import { useRef, useState } from "react";
import { showNoticeModal } from "../../../../redux/features/modalSlice";
import { setWorkingSpinner } from "../../../../redux/features/placeholderSlice";
import { cancelUnSignedOrder, setScheduledCancel } from "../../../../redux/features/tradeSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import PlaceholderDisplay from "../../../placeholder/PlaceholderDisplay";
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";
import TradingThead from "../TradingThead";
import SignedHistory from "./SignedHistory";
import UnSignedHistory from "./UnSignedHistory";
import '../../../../styles/price-detail/trading/tradeHistory.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function TradeHistory() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const scheduledCancel = useAppSelector(state => state.scheduledCancel);
    const tradeHistory = useAppSelector(state => state.tradeHistory);
    const unSignedTradeHistory = useAppSelector(state => state.unSignedTradeHistory);

    const tableRef = useRef<HTMLTableElement | null>(null);

    const [historySort, setHistorySort] = useState<string>('체결');
    const historySortOptions = [
        { id: 'radio-signed', value: '체결', label: '체결' },
        { id: 'radio-unSigned', value: '미체결', label: '미체결' },
    ];

    const cancelSubmit = async () => {
        let ids: string[] = scheduledCancel.map(item => item.id);
        if (ids.length > 0) {
            dispatch(setWorkingSpinner(true));

            await cancelOrder(ids);
            dispatch(cancelUnSignedOrder(ids));

            dispatch(setWorkingSpinner(false));
            dispatch(showNoticeModal({ content: '주문 취소가 완료되었습니다.' }));
        }
    }

    // 주문을 취소할 화폐를 서버로 전송
    const cancelOrder = async (ids: string[]) => {
        try {
            await axios.delete(`${API_URL}/api/user/trade/`, {
                params: {
                    ids: ids,
                },
                withCredentials: true,
            });
            dispatch(setScheduledCancel([]));
        } catch (error) {
            dispatch(showNoticeModal({ content: '주문 취소에 실패했습니다. 잠시 후 다시 시도해주세요.' }));
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
                <button
                    id="trading-history-cancel"
                    style={{ visibility: historySort === '미체결' ? 'visible' : 'hidden' }}
                    onClick={cancelSubmit}>
                    주문 취소
                </button>
            </div>
            <table className="table-trading-history" id={`${user.email !== '' ? 'historyHead' : ''}`}>
                <thead>
                    <tr>
                        <th>주문시간</th>
                        <th>
                            <div>화폐명</div>
                            <div>구분</div>
                        </th>
                        <th>
                            <div>매수가격</div>
                            <div>주문총액</div>
                        </th>
                        <th>수량</th>
                    </tr>
                </thead>
            </table>
            {
                (historySort === '체결' && !tradeHistory.length) ||
                    (historySort === '미체결' && !unSignedTradeHistory.length) ?
                    <PlaceholderDisplay content={`${historySort} 내역이 없습니다.`} /> :
                    (
                        <CustomScrollbars
                            className="history-scroll-container"
                            style={{ borderBottom: '1px solid #E3E8EC' }}>
                            <table className="table-trading-history" id="historyBody" ref={tableRef}>
                                <tbody>
                                    {
                                        historySort === '체결' ?
                                            <SignedHistory /> :
                                            <UnSignedHistory />
                                    }
                                </tbody>
                            </table>
                        </CustomScrollbars>
                    )
            }
        </>
    )
}