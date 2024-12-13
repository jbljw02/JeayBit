import { useState, useEffect } from "react";
import AskingTable from "./AskingTable";
import '../../../../styles/price-detail/orderbook/orderbook.css'
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";
import { AskingData } from "../../../../redux/features/askingSlice";
import { useAppSelector } from "../../../../redux/hooks";
import SkeletonUI from "../../../placeholder/SkeletonUI";
import LoadingSpinner from "../../../placeholder/LoadingSpinner";

// bid = 매수, ask = 매도
export default function AskingPrice() {
    const askingSpinner = useAppSelector(state => state.askingSpinner);
    const askingData = useAppSelector(state => state.askingData);
    const totalAskSize = useAppSelector(state => state.totalAskSize);
    const totalBidSize = useAppSelector(state => state.totalBidSize);
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);

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
        setPrevData(askingData);

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
                if (value.ask_size !== askingData[index].ask_size) {
                    newDifferences_ask.push({ new_ask_price: askingData[index].ask_price, new_ask_size: askingData[index].ask_size });
                }
                if (value.bid_size !== askingData[index].bid_size) {
                    newDifferences_bid.push({ new_bid_price: askingData[index].bid_price, new_bid_size: askingData[index].bid_size });
                }
            })
        }

        setDifferences_ask(newDifferences_ask);
        setDifferences_bid(newDifferences_bid);
    }, [askingData, prevData]);

    return (
        <div className="orderbook-section">
            <table className="orderbook-table thead">
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
            {
                askingSpinner ?
                    <LoadingSpinner
                        containerHeight={'100%'}
                        size={40} /> :
                    (
                        askingData.length ?
                            <CustomScrollbars>
                                <table className="orderbook-table tbody">
                                    <tbody>
                                        <AskingTable
                                            differences={differences_bid}
                                            size={Number(totalBidSize)}
                                            category={'bid'} />
                                        <AskingTable
                                            differences={differences_ask}
                                            size={Number(totalAskSize)}
                                            category={'ask'} />
                                    </tbody>
                                </table>
                            </CustomScrollbars> :
                            <SkeletonUI
                                containerHeight="335px"
                                elementsHeight={20} />
                    )
            }
        </div>
    )
}