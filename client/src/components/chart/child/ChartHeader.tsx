import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect, useState, useRef } from "react";
import { setChartSortDate, setChartSortTime } from "../../../redux/features/chart/chartSlice";
import { setChartSpinner } from "../../../redux/features/ui/placeholderSlice";
import useRequestCandle from "../../../hooks/chart/useRequestCandle";

export default function ChartHeader() {
    const dispatch = useAppDispatch();

    const { requestCandleMinute, requestCandleDate } = useRequestCandle();

    const delimitedTime = useAppSelector(state => state.delimitedTime);
    const delimitedDate = useAppSelector(state => state.delimitedDate);
    const chartSortTime = useAppSelector(state => state.chartSortTime);
    const chartSortDate = useAppSelector(state => state.chartSortDate);
    const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);

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

    const changeCandle = async () => {
        dispatch(setChartSpinner(true));
        try {
            if (chartSortTime && cryptoRealTime.market) {
                await requestCandleMinute(cryptoRealTime.market, chartSortTime);
            } else if (chartSortDate && !chartSortTime && cryptoRealTime.market) {
                await requestCandleDate(cryptoRealTime.market, chartSortDate);
            }
        } finally {
            dispatch(setChartSpinner(false));
        }
    };

    useEffect(() => {
        changeCandle();
    }, [chartSortTime, chartSortDate, cryptoRealTime.market]);

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
