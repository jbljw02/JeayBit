import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { RootState } from "../../../redux/store";
import { setChartSortDate, setChartSortTime } from "../../../redux/features/chartSlice";
import useFunction from "../../useFuction";
import { setChartSpinner } from "../../../redux/features/placeholderSlice";

export default function ChartHeader() {
    const dispatch = useDispatch();

    const { requestCandleMinute, requestCandleDate } = useFunction();

    const delimitedTime = useSelector((state: RootState) => state.delimitedTime);
    const delimitedDate = useSelector((state: RootState) => state.delimitedDate);
    const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
    const chartSortDate = useSelector((state: RootState) => state.chartSortDate);
    const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLabelElement>(null);

    const clickChartSortTime = (value: string) => {
        dispatch(setChartSortTime(value));
    };

    const clickChartSortDate = (value: string) => {
        dispatch(setChartSortDate(value));
        dispatch(setChartSortTime(''));
        setIsDropdownOpen(false);
    };

    const changeCandle = useCallback(async () => {
        dispatch(setChartSpinner(true));
        try {
            if (chartSortTime && cryptoRealTime.market) {
                await requestCandleMinute(cryptoRealTime.market, chartSortTime);
            } else if (chartSortDate && !chartSortTime && cryptoRealTime.market) {
                await requestCandleDate(cryptoRealTime.market);
            }
        } finally {
            dispatch(setChartSpinner(false));
        }
    }, [chartSortTime, chartSortDate, cryptoRealTime.market, dispatch]);

    useEffect(() => {
        changeCandle();
    }, [changeCandle]);

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
