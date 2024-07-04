import React, { useEffect, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
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

  const xLabelFormat = (dateTime: number, format: string) => {
    const dateObj = moment.tz(dateTime, 'Asia/Seoul');

    switch (format) {
      case '1일':
        return dateObj.format('MM/DD');
      case '1주':
        return dateObj.format('MM/DD');
      case '1개월':
        return dateObj.format('YYYY. MM');
      case '1분':
      case '5분':
      case '10분':
      case '30분':
      case '1시간':
      case '4시간':
        return dateObj.format('MM/DD hh:mm')
      default:
        return dateObj.format('YYYY. MM/DD hh:mm');
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
      tickAmount: 6,
      labels: {
        formatter: function (value: number) {
          const label = xLabelFormat(value, formatRef.current);
          return label;
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

        return `
          <div class="apexchart-tooltip">
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
    let data: { x: any; y: number[] }[] = [];
    if (chartSortTime) {
      setFormat(chartSortTime);
      data = candlePerMinute.map((candle: Market) => ({
        x: moment.tz(candle.candle_date_time_kst, 'Asia/Seoul').toDate(),
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
        x: moment.tz(candle.candle_date_time_kst, 'Asia/Seoul').toDate(),
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