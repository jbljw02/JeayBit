import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { RootState } from "../../../redux/store";
import { setCandlePerDate, setCandlePerMinute, setChartSortDate, setChartSortTime } from "../../../redux/features/chartSlice";
import { setErrorModal } from "../../../redux/features/modalSlice";

export default function ChartHeader() {
    const dispatch = useDispatch();

    const delimitedTime = useSelector((state: RootState) => state.delimitedTime);
    const delimitedDate = useSelector((state: RootState) => state.delimitedDate);

    const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
    const chartSortDate = useSelector((state: RootState) => state.chartSortDate);

    const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLabelElement>(null);

    // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 분에 따라)
    const requestCandleMinute = useCallback(async (market: string, minute: string) => {
        if (minute && market) {
            try {
                const response = await axios.get(`https://jeaybit.onrender.com/candle_per_minute/?market=${market}&minute=${minute}`);
                dispatch(setCandlePerMinute(response.data));
            } catch (error) {
                dispatch(setErrorModal(true));
                throw error;
            }
        }
    }, [dispatch]);

    // 리스트에서 화폐를 선택하면 해당 화폐에 대한 캔들 호출(차트의 일/주/월에 따라)
    const requestCandleDate = useCallback(async (market: string) => {
        try {
            let response;
            let url = "https://jeaybit.onrender.com/";

            if (chartSortDate === "1일") {
                url += `candle_per_date/?market=${market}`;
                response = await axios.get(url);
                dispatch(setCandlePerDate(response.data));
            } else if (chartSortDate === "1주") {
                url += `candle_per_week/?market=${market}`;
                response = await axios.get(url);
                dispatch(setCandlePerDate(response.data));
            } else if (chartSortDate === "1개월") {
                url += `candle_per_month/?market=${market}`;
                response = await axios.get(url);
                dispatch(setCandlePerDate(response.data));
            }
        } catch (error) {
            dispatch(setErrorModal(true));
            throw error;
        }
    }, [chartSortDate, dispatch]);

    const clickChartSortTime = (value: string) => {
        dispatch(setChartSortTime(value));
    };

    const clickChartSortDate = (value: string) => {
        dispatch(setChartSortDate(value));
        dispatch(setChartSortTime(''));
        setIsDropdownOpen(false);
    };

    // 선택 화폐가 변경 되거나, 시간/날짜당 캔들의 정보가 변경될 때 요청
    useEffect(() => {
        if (chartSortTime && cryptoRealTime.market) {
            requestCandleMinute(cryptoRealTime.market, chartSortTime);
        } else if (chartSortDate && !chartSortTime && cryptoRealTime.market) {
            requestCandleDate(cryptoRealTime.market);
        }
    }, [cryptoRealTime, chartSortTime, chartSortDate, requestCandleDate, requestCandleMinute]);

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="trading-header no-drag">
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
                <label className="drop-down" ref={dropdownRef}>
                    <span
                        className={`chartSortDate ${chartSortTime ? '' : 'chartSortDate-selected'}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        {chartSortDate}
                    </span>
                    <span className="dd-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <svg className="img-dd" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 16 8">
                            <path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path>
                        </svg>
                    </span>
                    <input type="checkbox" className="dd-input" />
                    <ul className={`dd-menu ${isDropdownOpen ? 'show' : ''}`}>
                        {
                            delimitedDate.map((item, i) => (
                                <li
                                    key={i}
                                    onClick={() => clickChartSortDate(item)}
                                    className="dd-menu-li">
                                    {item}
                                </li>
                            ))
                        }
                    </ul>
                </label>
            </div>
        </div>
    );
}
