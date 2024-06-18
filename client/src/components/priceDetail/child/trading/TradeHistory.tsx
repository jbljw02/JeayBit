import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, setBuyingPrice, setIsBuying } from '../../../../redux/store'
import useFunction from "../../../../utils/useFuction";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

export default function TradeHistory() {

    const { getTradeHistory } = useFunction();

    const user = useSelector((state: RootState) => state.user);
    const userTradeHistory = useSelector((state: RootState) => state.userTradeHistory)
    const userTradeHistory_unSigned = useSelector((state: RootState) => state.userTradeHistory_unSigned)

    const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

    const [historySort, setHistorySort] = useState<string>('체결');
    const [scheduledCancel, setScheduledCancel] = useState<
        {
            id: string,
            index: number,
        }[]>([]);

    const completeToggleModal = () => {
        setCompleteModalOpen(!completeModalOpen);
    }

    // 주문을 취소할 화폐를 서버로 전송
    const cancelOrder = (email: string, ids: string[]) => {
        (async (email, ids) => {
            try {
                await axios.post("http://127.0.0.1:8000/cancel_order/", {
                    ids: ids,
                    email: email,
                });
                // console.log("주문 취소 정보 전송 성공", response.data);
                getTradeHistory(user.email);
                setScheduledCancel([]);
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

            } catch (error) {
                // console.log("주문 취소 정보 전송 실패");
            }
        })(email, ids);
    }

    const clickUnSigned = (id: string, i: number) => {
        // 기존 state에 인덱스가 일치하는 속성이 있는지 확인
        if (scheduledCancel.some(item => item.index === i)) {
            // 있다면, 인덱스가 다른 부분만을 구분하여 새 배열 생성(인덱스를 제거한다는 의미)
            setScheduledCancel(scheduledCancel.filter(item => item.index !== i));
        }
        else {
            // 기존 state에 일치하는 인덱스가 없다면 할당
            setScheduledCancel([...scheduledCancel, { id: id, index: i }]);
        }
    }

    return (
        <div className="div-trading-table">
            <table className="trading-headTable">
                <tbody>
                    <tr className="trading-choice">
                        <td className="radio">
                            체결구분
                        </td>
                        <td className="radio">
                            <input type="radio" name="radio" id="radio1" className="radio-input" onChange={() => (setHistorySort('체결'))} checked={historySort === '체결'}></input>
                            <label className="radio-designate radio-label" htmlFor="radio1">
                                체결
                            </label>
                        </td>
                        <td className="radio">
                            <input type="radio" name="radio" id="radio2" className="radio-input" onChange={() => (setHistorySort('미체결'))} checked={historySort === '미체결'}></input>
                            <label className="radio-market radio-label" htmlFor="radio2">
                                미체결
                            </label>
                        </td>
                        <td id="trading-history-cancel" style={{ visibility: historySort === '미체결' ? 'visible' : 'hidden' }} onClick={() => {
                            let ids: string[] = scheduledCancel.map(item => item.id);
                            if (ids.length > 0) {
                                cancelOrder(user.email, ids);
                            }
                        }}>
                            주문 취소
                        </td>
                    </tr>
                </tbody>
            </table>

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
                                userTradeHistory.map((item, i) => {
                                    let isLastItem = i === userTradeHistory.length - 1;
                                    return (
                                        <tr
                                            id={`${isLastItem ? 'last-row' : ''}`}
                                            key={i}>
                                            <td>
                                                {(item.trade_time).slice(0, 10)} <br />
                                                {(item.trade_time).slice(10)}
                                            </td>
                                            <td>
                                                <span className="tradingHistory-market">
                                                    {item.crypto_market}
                                                </span>
                                                <br />
                                                <span className={`tradingHistory-category ${item.trade_category === 'BUY' ? 'asking-buy' : 'asking-sell'}`}>

                                                    {
                                                        item.trade_category === 'BUY' ?
                                                            '매수' :
                                                            '매도'
                                                    }
                                                </span>
                                            </td>
                                            <td>
                                                {(item.crypto_price).toLocaleString()} <br />
                                                {(Number(item.trade_price)).toLocaleString()}
                                            </td>
                                            <td>
                                                {
                                                    (item.trade_amount).length <= 10 ?
                                                        item.trade_amount :
                                                        (
                                                            item.trade_amount[9] === '.' ?
                                                                (item.trade_amount).substring(0, 9) :
                                                                (item.trade_amount).substring(0, 10)
                                                        )
                                                }
                                            </td>
                                        </tr>
                                    )
                                }) :
                                // 체결되지 않은 화폐들의 거래내역
                                userTradeHistory_unSigned !== undefined && Array.isArray(userTradeHistory_unSigned) ?
                                    (
                                        userTradeHistory_unSigned.map((item, i) => {
                                            let isLastItem = i === userTradeHistory_unSigned.length - 1;
                                            return (
                                                <tr
                                                    className={`tr-unSigned ${scheduledCancel.some(item => item.index === i) ?
                                                        'unSigned-clicked' : ''
                                                        }`}
                                                    id={`${isLastItem ? 'last-row' : ''}`}
                                                    key={i}
                                                    onClick={() => clickUnSigned(item.id, i)}>
                                                    <td>
                                                        {
                                                            item.trade_time !== undefined ?
                                                                (item.trade_time).slice(0, 10) :
                                                                null
                                                        }
                                                        <br />
                                                        {
                                                            item.trade_time !== undefined ?
                                                                (item.trade_time).slice(10) :
                                                                null
                                                        }
                                                    </td>
                                                    <td>
                                                        <span className="tradingHistory-market">
                                                            {
                                                                item.crypto_market !== undefined ?
                                                                    item.crypto_market :
                                                                    null
                                                            }
                                                        </span>
                                                        <br />
                                                        <span className={`tradingHistory-category ${item.trade_category === 'BUY' ? 'asking-buy' : 'asking-sell'}`}>

                                                            {
                                                                item.trade_category !== undefined ? (

                                                                    item.trade_category === 'BUY' ?
                                                                        '매수' :
                                                                        '매도'
                                                                ) :
                                                                    null
                                                            }
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {
                                                            item.crypto_price !== undefined ?
                                                                (item.crypto_price).toLocaleString() :
                                                                null
                                                        }
                                                        <br />
                                                        {
                                                            item.trade_price !== undefined ?
                                                                (Number(item.trade_price)).toLocaleString() :
                                                                null
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            item.trade_amount !== undefined ?
                                                                (
                                                                    (String(item.trade_amount)).length <= 10 ?
                                                                        item.trade_amount :
                                                                        (
                                                                            String(item.trade_amount)[9] === '.' ?
                                                                                (String(item.trade_amount)).substring(0, 9) :
                                                                                (String(item.trade_amount)).substring(0, 10)
                                                                        )
                                                                ) :
                                                                null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) :
                                    null
                        }
                    </tbody>
                </table>
            </PerfectScrollbar>
        </div>
    )
}