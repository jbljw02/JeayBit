import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { RootState, setCandlePerMinute, setCandlePerDate, setCandlePerWeek, setCandlePerMonth, setSelectedChartSort, setChartSortTime, setChartSortDate, setChartSort } from "../../../redux/store";

export default function ChartHeader() {
    const dispatch = useDispatch();

    const delimitedTime = useSelector((state: RootState) => state.delimitedTime);
    const delimitedDate = useSelector((state: RootState) => state.delimitedDate);

    const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
    const chartSortDate = useSelector((state: RootState) => state.chartSortDate);

    const candlePerMinute = useSelector((state: RootState) => state.candlePerMinute)
    const candlePerDate = useSelector((state: RootState) => state.candlePerDate);

    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

    // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 분에 따라)
    const requestCandleMinute = async (market: string, minute: string) => {
        if (minute && market) {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/candle_per_minute/?market=${market}&minute=${minute}`);

                dispatch(setCandlePerMinute(response.data));
            } catch (error) {
                console.error("분 캔들 에러: ", error);
            }
        }
    };

    // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 일/주/월에 따라)
    const requestCandleDate = async (market: string) => {
        try {
            let response;
            let url = "http://127.0.0.1:8000/";

            if (chartSortDate === "1일") {
                url += `candle_per_date/?market=${market}`;
                response = await axios.get(url);
                dispatch(setCandlePerDate(response.data));
            }
            else if (chartSortDate === "1주") {
                url += `candle_per_week/?market=${market}`;
                response = await axios.get(url);
                dispatch(setCandlePerDate(response.data));
            }
            else if (chartSortDate === "1개월") {
                url += `candle_per_month/?market=${market}`;
                response = await axios.get(url);
                dispatch(setCandlePerDate(response.data));
            }
        } catch (error) {
            console.error("캔들에러: ", error);
        }
    };

    const clickChartSortTime = (value: string) => {
        dispatch(setChartSortTime(value));
        dispatch(setChartSort(value))
    }

    const clickChartSortDate = (value: string) => {
        dispatch(setChartSortDate(value));
        dispatch(setChartSortTime(''));
        dispatch(setChartSort(value))
    }

    // 선택 화폐가 변경 되거나, 시간/날짜당 캔들의 정보가 변경될 때 요청
    useEffect(() => {
        if (chartSortTime && selectedCrypto.market) {
            requestCandleMinute(selectedCrypto.market, chartSortTime);
        }
        else if (chartSortDate && !chartSortTime && selectedCrypto.market) {
            requestCandleDate(selectedCrypto.market);
        }
    }, [selectedCrypto, chartSortTime, chartSortDate]);

    return (
        <div className="trading-header lightMode">
            <div className="div-delimited">
                {
                    delimitedTime.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => clickChartSortTime(item)}
                            className={`td-delimited ${chartSortTime === item ? 'td-delimited-selected' : ''}`}>
                            {item}
                        </div>
                    ))
                }
                <label className="dropDown">
                    <span
                        onClick={() => chartSortTime ? clickChartSortDate(chartSortDate) : null}
                        className={`chartSortDate ${chartSortTime ? '' : 'chartSortDate-selected'}`}>
                        {chartSortDate}
                    </span>
                    <span className="dd-button">
                        <svg className="img-dd" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 16 8">
                            <path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path>
                        </svg>
                    </span>
                    <input type="checkbox" className="dd-input" />
                    <ul className="dd-menu lightMode">
                        {
                            delimitedDate.map((item, i) => (
                                <li
                                    key={i}
                                    onClick={() => {
                                        clickChartSortDate(item);
                                    }}
                                    className="dd-menu-li">
                                    {item}
                                </li>
                            ))
                        }
                    </ul>
                </label>
            </div>
        </div>
    )
}