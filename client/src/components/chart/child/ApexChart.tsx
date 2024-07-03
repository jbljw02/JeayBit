import React, { useEffect, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { Market, RootState } from '../../../redux/store';
import formatWithComas from '../../../utils/format/formatWithComas';

export default function ApexChart() {
  const candlePerDate = useSelector((state: RootState) => state.candlePerDate);
  const candlePerMinute = useSelector((state: RootState) => state.candlePerMinute);
  const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
  const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);

  const [format, setFormat] = useState<string>(chartSortTime ? chartSortTime : chartSortDate);

  const formatRef = useRef(format);

  const getDecimalPlaces = (num: number): number => {
    if (num === undefined || num === null) return 0;
    const match = num.toString().match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
  };

  const getXValue = (timeStamp: string | number, format: string) => {
    const dateObj = new Date(timeStamp);
    const pad = (num: number) => num.toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());
    const hour = pad(dateObj.getHours());
    const minute = pad(dateObj.getMinutes());

    switch (format) {
      case '1일':
      case '1주':
      case '1개월':
        return `${year}-${month}-${day}`;
      case '1분':
      case '5분':
      case '10분':
      case '30분':
      case '1시간':
      case '4시간':
        return `${month}-${day} ${hour}:${minute}`;
      default:
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }
  };

  useEffect(() => {
    formatRef.current = format;
  }, [format]);

  const [series, setSeries] = useState<{ data: { x: Date; y: number[] }[] }[]>([
    { data: [] },
  ]);

  const [chartOptions, setChartOptions] = useState<any>({
    chart: {
      type: 'candlestick' as const,
      height: '100%',
      id: 'crypto-chart',
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        formatter: function (value: number) {
          const rawDate = new Date(value).getTime();
          const x = getXValue(rawDate, formatRef.current);
          return x;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return formatWithComas(value);
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      followCursor: true,
      intersect: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: number, dataPointIndex: number, w: any }) {
        if (seriesIndex === -1 || dataPointIndex === -1) return;

        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        const rawDate = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]).getTime();
        const x = getXValue(rawDate, formatRef.current);

        return `
          <div class="apexchart-tooltip">
            <div>날짜: <span>${x}</span></div>
            <div>시가: <span>${formatWithComas(o)}</span></div>
            <div>고가: <span>${formatWithComas(h)}</span></div>
            <div>저가: <span>${formatWithComas(l)}</span></div>
            <div>종가: <span>${formatWithComas(c)}</span></div>
          </div>
        `;
      },
    },
  });

  useEffect(() => {
    let data: { x: Date; y: number[] }[] = [];
    if (chartSortTime) {
      setFormat(chartSortTime);
      data = candlePerMinute.map((candle: Market) => ({
        x: new Date(candle.candle_date_time_kst),
        y: [
          candle.opening_price,
          candle.high_price,
          candle.low_price,
          candle.trade_price,
        ],
      }));
    } else if (chartSortDate) {
      setFormat(chartSortDate);
      data = candlePerDate.map((candle: Market) => ({
        x: new Date(candle.candle_date_time_kst),
        y: [
          candle.opening_price,
          candle.high_price,
          candle.low_price,
          candle.trade_price,
        ],
      }));
    }
    setSeries([{ data }]);
  }, [candlePerDate, candlePerMinute, chartSortTime, chartSortDate]);

  return (
    <div id="chart">
      <Chart
        options={chartOptions}
        series={series}
        type="candlestick"
        height='62%'
      />
    </div>
  );
}