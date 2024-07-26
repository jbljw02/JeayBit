import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ApexChart from "./child/ApexChart";
import ChartHeader from "./child/ChartHeader";
import LoadingSpinner from "../placeholder/LoadingSpinner";
import '../../styles/chart/chart.css'

export default function Chart() {
    const candlePerDate = useSelector((state: RootState) => state.candlePerDate);
    const candlePerMinute = useSelector((state: RootState) => state.candlePerMinute);
    const chartSpinner = useSelector((state: RootState) => state.chartSpinner);

    return (
        <div className="chart-container">
            <ChartHeader />
            {
                // 캔들의 값이 존재하지 않거나, fetch중일 때는 스피너 출력
                (candlePerDate.length || candlePerMinute.length) && !chartSpinner ?
                    <ApexChart /> :
                    <LoadingSpinner
                        containerHeight={'60%'}
                        size={60} />
            }
        </div>
    )
}