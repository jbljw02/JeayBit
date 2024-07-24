import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ApexChart from "./child/ApexChart";
import ChartHeader from "./child/ChartHeader";
import LoadingSpinner from "../placeholder/LoadingSpinner";
import '../../styles/chart/chart.css'

export default function Chart() {
    const candlePerDate = useSelector((state: RootState) => state.candlePerDate);
    const candlePerMinute = useSelector((state: RootState) => state.candlePerMinute);

    return (
        <div className="chart-container">
            <ChartHeader />
            {
                candlePerDate.length || candlePerMinute.length ?
                    <ApexChart /> :
                    <LoadingSpinner />
            }
        </div>
    )
}