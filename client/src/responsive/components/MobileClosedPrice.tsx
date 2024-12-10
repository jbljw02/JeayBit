import LoadingSpinner from "../../components/placeholder/LoadingSpinner";
import SkeletonUI from "../../components/placeholder/SkeletonUI";
import CustomScrollbars from "../../components/scrollbar/CustomScorllbars";
import { useAppSelector } from "../../redux/hooks";
import convertToDate from "../../utils/date/covertToDate";
import adjustSize from "../../utils/format/adjustSize";
import '../../styles/price-detail/orderbook/orderbook.css'

export default function MobileClosedPrice() {
    const askingSpinner = useAppSelector(state => state.askingSpinner);
    const askingData = useAppSelector(state => state.askingData);
    const closedData = useAppSelector(state => state.closedData);
    const selectedCrypto = useAppSelector(state => state.selectedCrypto);

    return (
        <div
            className="orderbook-section">
            <table className="orderbook-table head">
                <thead>
                    <tr>
                        <th>체결시간</th>
                        <th>체결가격</th>
                        <th>
                            체결량
                            <span>({selectedCrypto.market?.slice(4)})</span>
                        </th>
                    </tr>
                </thead>
            </table>
            <div className="orderbook-content">
                {
                    askingSpinner ? (
                        <LoadingSpinner containerHeight="100%" size={40} />
                    ) :
                        (
                            askingData.length ? (
                                <CustomScrollbars style={{ width: '100%', height: '100%' }}>
                                    <table className="orderbook-table">
                                        <tbody>
                                            {closedData.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{convertToDate(item.timestamp)}</td>
                                                    <td>{item.trade_price.toLocaleString()}</td>
                                                    <td className={item.ask_bid === 'BID' ? 'rise' : 'fall'}>
                                                        {adjustSize(item.trade_volume)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CustomScrollbars>
                            ) :
                                (
                                    <SkeletonUI containerHeight="100%" elementsHeight={20} />
                                )
                        )
                }
            </div>
        </div >
    );
}