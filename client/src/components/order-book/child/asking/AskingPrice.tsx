import { useState, useEffect } from "react";
import AskingTable from "./AskingTable";
import '../../../../styles/price-detail/orderbook/orderbook.css'
import CustomScrollbars from "../../../scrollbar/CustomScorllbars";
import { AskingData } from "../../../../redux/features/askingSlice";
import { useAppSelector } from "../../../../redux/hooks";
import SkeletonUI from "../../../placeholder/SkeletonUI";
import LoadingSpinner from "../../../placeholder/LoadingSpinner";

type askDiffProps = {
    newAskPrice: number,
    newAskSize: number,
}

type bidDiffProps = {
    newBidPrice: number,
    newBidSize: number,
}

// bid = 매수, ask = 매도
export default function AskingPrice() {
    const askingSpinner = useAppSelector(state => state.askingSpinner);
    const askingData = useAppSelector(state => state.askingData);
    const totalAskSize = useAppSelector(state => state.totalAskSize);
    const totalBidSize = useAppSelector(state => state.totalBidSize);
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);

    const [prevData, setPrevData] = useState<AskingData[]>();
    const [differences_ask, setDifferences_ask] = useState<askDiffProps[]>([]);
    const [differences_bid, setDifferences_bid] = useState<bidDiffProps[]>([]);

    // 호가 수량의 변화를 감지하고 이전 값과 비교하여 변화가 생긴 값을 상태에 업데이트
    useEffect(() => {
        // state의 업데이트는 비동기적이기 때문에 값이 즉시 바뀌지 않음. 
        // 그러므로 이 useEffect() 안에서 prevData는 아직 이전의 값을 가지고 있음.
        setPrevData(askingData);

        let askingNewDifferences: askDiffProps[] = [];
        let bidNewDifferences: bidDiffProps[] = [];

        if (prevData) {
            prevData.forEach((value, index) => {
                if (value.askSize !== askingData[index].askSize) {
                    askingNewDifferences.push({ newAskPrice: askingData[index].askPrice, newAskSize: askingData[index].askSize });
                }
                if (value.bidSize !== askingData[index].bidSize) {
                    bidNewDifferences.push({ newBidPrice: askingData[index].bidPrice, newBidSize: askingData[index].bidSize });
                }
            })
        }

        setDifferences_ask(askingNewDifferences);
        setDifferences_bid(bidNewDifferences);
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
                            <CustomScrollbars id="scrollbar-orderbook">
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