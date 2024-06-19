import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setBuyingPrice, setIsBuying, setScheduledCancel } from '../../../../../redux/store'
import useFunction from "../../../../../utils/useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import RadioInput from "../../../../input/RadioInput";
import SignedHistory from "./SignedHistory";
import UnSignedHistory from "./UnSignedHistory";

export default function TradeHistory() {
    const dispatch = useDispatch();

    const { getTradeHistory } = useFunction();

    const user = useSelector((state: RootState) => state.user);
    const scheduledCancel = useSelector((state: RootState) => state.scheduledCancel);

    const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

    const [historySort, setHistorySort] = useState<string>('체결');

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

            let localStorageKeys: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (key !== null) {
                    localStorageKeys.push(key);
                }
            }

            // ids와 로컬 스토리지에 있는 값 사이 id가 겹치는 것
            let intersection = ids.filter(item => localStorageKeys.includes(item));

            // 교집합 배열의 특정 요소와 같은 로컬 스토리지의 키를 삭제(주문 취소 요청된 로컬 스토리지 삭제)
            intersection.forEach((item) => {
                localStorage.removeItem(item);
            })
            console.log("주문 취소 정보 전송 성공", response.data);
        } catch (error) {
            console.error("주문 취소 정보 전송 실패");
        }
    }

    useEffect(() => {
        if (user && user.email) {
            getTradeHistory(user.email);
        }
    }, []);

    return (
        <>
            <div>
                <div className="radio">체결구분</div>
                <RadioInput
                    id="radio-signed"
                    checked={historySort === '체결'}
                    onChange={() => setHistorySort('체결')}
                    label="체결" />
                <RadioInput
                    id="radio-unSigned"
                    checked={historySort === '미체결'}
                    onChange={() => setHistorySort('미체결')}
                    label="미체결" />
                <div
                    id="trading-history-cancel"
                    style={{ visibility: historySort === '미체결' ? 'visible' : 'hidden' }}
                    onClick={cancelSubmit}>
                    주문 취소
                </div>
            </div>
            <div className="div-trading-table">
                <table className="table-tradingHistory" id={`${user.email !== '' ? 'historyHead' : ''}`}>
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
                <PerfectScrollbar id="scrollBar-tradingHistoryTable">
                    <table className="table-tradingHistory" id="historyBody">
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