import axios from "axios";
import { useEffect, useRef, useState } from "react";
import SignedHistory from "./SignedHistory";
import UnSignedHistory from "./UnSignedHistory";
import '../../../../../styles/priceDetail/trading/tradeHistory.css'
import TradingThead from "../TradingThead";
import CustomScrollbars from "../../../../scrollbar/CustomScorllbars";
import PlaceholderDisplay from "../../../../placeholder/PlaceholderDisplay";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { cancelUnSignedOrder, setScheduledCancel } from "../../../../../redux/features/tradeSlice";
import { setWorkingSpinner } from "../../../../../redux/features/placeholderSlice";
import { showNoticeModal } from "../../../../../redux/features/modalSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function TradeHistory() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const scheduledCancel = useAppSelector(state => state.scheduledCancel);
    const userTradeHistory = useAppSelector(state => state.userTradeHistory);
    const userTradeHistory_unSigned = useAppSelector(state => state.userTradeHistory_unSigned);

    const tableRef = useRef<HTMLTableElement | null>(null);
    const [scrollHeight, setScrollHeight] = useState<number>(0); // 초기값 설정

    const [historySort, setHistorySort] = useState<string>('체결');
    const historySortOptions = [
        { id: 'radio-signed', value: '체결', label: '체결' },
        { id: 'radio-unSigned', value: '미체결', label: '미체결' },
    ];

    useEffect(() => {
        if (tableRef.current) {
            // MutationObserver를 통해 DOM이 변화할 때마다 높이 확인
            const observer = new MutationObserver(() => {
                if (tableRef.current) {
                    const tableHeight = tableRef.current.clientHeight;
                    setScrollHeight(tableHeight > 305 ? 305 : tableHeight);
                }
            });

            // tableRef.current 요소의 자식 목록과 하위 트리를 관찰
            observer.observe(tableRef.current, { childList: true, subtree: true });

            return () => {
                observer.disconnect();
            };
        }
    }, []);

    useEffect(() => {
        if (tableRef.current) {
            const tableHeight = tableRef.current.offsetHeight;
            setScrollHeight(tableHeight > 305 ? 305 : tableHeight);
        }
    }, [historySort]);

    const cancelSubmit = async () => {
        let ids: string[] = scheduledCancel.map(item => item.id);
        if (ids.length > 0) {
            dispatch(setWorkingSpinner(true));

            await cancelOrder(user.email, ids);
            dispatch(cancelUnSignedOrder(ids));

            dispatch(setWorkingSpinner(false));
            dispatch(showNoticeModal('주문 취소가 완료되었습니다.'));
        }
    }

    // 주문을 취소할 화폐를 서버로 전송
    const cancelOrder = async (email: string, ids: string[]) => {
        try {
            await axios.post(`${API_URL}/cancel_order/`, {
                ids: ids,
                email: email,
            });
            dispatch(setScheduledCancel([]));
        } catch (error) {
            dispatch(showNoticeModal('주문 취소에 실패했습니다. 잠시 후 다시 시도해주세요.'));
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
                <div style={{ borderBottom: '1px solid #E3E8EC' }}>
                    <CustomScrollbars
                        style={{ width: '100%', height: scrollHeight }}>
                        <table
                            className="table-trading-history"
                            id="historyBody"
                            ref={tableRef}>
                            <tbody>
                                {
                                    // 체결된 화폐들의 거래내역
                                    historySort === '체결' ?
                                        (
                                            userTradeHistory.length > 0 ?
                                                <SignedHistory /> :
                                                <div style={{ height: '302px' }}>
                                                    <PlaceholderDisplay content="체결 내역이 없습니다." />
                                                </div>

                                        ) :
                                        (
                                            userTradeHistory_unSigned.length > 0 ?
                                                <UnSignedHistory /> :
                                                <div style={{ height: '302px' }}>
                                                    <PlaceholderDisplay content="미체결 내역이 없습니다." />
                                                </div>
                                        )
                                }
                            </tbody>
                        </table>
                    </CustomScrollbars>
                </div>
            </div>
        </>
    )
}