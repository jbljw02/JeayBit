import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AskingData, setAsking_dateTime, setAskHide } from "../../../../redux/store";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AskingTable from "./AskingTable";
import '../../../../styles/priceDetail/asking/asking.css'
import { Scrollbars } from 'react-custom-scrollbars-2';
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";

// bid = 매수, ask = 매도
export default function AskingPrice() {
    const dispatch = useDispatch();

    const asking_data = useSelector((state: RootState) => state.asking_data);
    const asking_totalAskSize = useSelector((state: RootState) => state.asking_totalAskSize);
    const asking_totalBidSize = useSelector((state: RootState) => state.asking_totalBidSize);
    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const askHide = useSelector((state: RootState) => state.askHide);

    const [prevData, setPrevData] = useState<AskingData[]>();

    const [differences_ask, setDifferences_ask] = useState<{
        new_ask_price: number,
        new_ask_size: number
    }[]>([]);

    const [differences_bid, setDifferences_bid] = useState<{
        new_bid_price: number,
        new_bid_size: number,
    }[]>([]);

    // 호가 수량의 변화를 감지하고 이전 값과 비교하여 변화가 생긴 값을 상태에 업데이트
    useEffect(() => {
        // state의 업데이트는 비동기적이기 때문에 값이 즉시 바뀌지 않음. 
        // 그러므로 이 useEffect() 안에서 prevData는 아직 이전의 값을 가지고 있음.
        setPrevData(asking_data);

        let newDifferences_ask: {
            new_ask_price: number,
            new_ask_size: number,
        }[] = [];
        let newDifferences_bid: {
            new_bid_price: number,
            new_bid_size: number,
        }[] = [];

        if (prevData) {
            prevData.forEach((value, index) => {
                if (value.ask_size !== asking_data[index].ask_size) {
                    newDifferences_ask.push({ new_ask_price: asking_data[index].ask_price, new_ask_size: asking_data[index].ask_size });
                }
                if (value.bid_size !== asking_data[index].bid_size) {
                    newDifferences_bid.push({ new_bid_price: asking_data[index].bid_price, new_bid_size: asking_data[index].bid_size });
                }
            })
        }

        setDifferences_ask(newDifferences_ask);
        setDifferences_bid(newDifferences_bid);
    }, [asking_data, prevData]);

    return (
        <>
            <div className="asking-section">
                <div className="priceDetail-title">
                    호가내역
                    <svg className="arrow-hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 5"
                        onClick={() => dispatch(setAskHide(!askHide))}
                        style={{
                            pointerEvents: 'all',
                            transformOrigin: askHide ? '50% 50%' : undefined,
                            transform: askHide ? 'rotate(270deg)' : undefined
                        }}>
                        <path d="M5.016 0 0 .003 2.506 2.5 5.016 5l2.509-2.5L10.033.003 5.016 0z" />
                    </svg>
                </div>
                {
                    !askHide ?
                        <>
                            <table className="asking-table">
                                <thead>
                                    <tr>
                                        <th>등록시간</th>
                                        <th>호가</th>
                                        <th>
                                            수량
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
                            <CustomScrollbars style={{ width: '100%', height: '335px' }}>
                                <table className="asking-table">
                                    <tbody>
                                        <>
                                            <AskingTable
                                                differences={differences_bid}
                                                size={asking_totalBidSize}
                                                category={'bid'} />
                                            <AskingTable
                                                differences={differences_ask}
                                                size={asking_totalAskSize}
                                                category={'ask'} />
                                        </>
                                    </tbody>
                                </table>
                            </CustomScrollbars>
                        </> :
                        <div className="hide-element">...</div>
                }
            </div >

        </>
    )
}