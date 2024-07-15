import React, { useEffect, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { Market, RootState } from '../../../redux/store';
import formatWithComas from '../../../utils/format/formatWithComas';
import '../../../styles/chart/chart.css'

type Axis = {
  min: number,
  max: number,
}

export default function ApexChart() {
  const candlePerDate = useSelector((state: RootState) => state.candlePerDate);
  const candlePerMinute = useSelector((state: RootState) => state.candlePerMinute);
  const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);

  const [format, setFormat] = useState<string>(chartSortTime ? chartSortTime : chartSortDate);
  const formatRef = useRef(format);

  const [savedChartState, setSavedChartState] = useState<{ xaxis: any, yaxis: any } | null>(null);

  const [series, setSeries] = useState<{ data: { x: Date; y: number[] }[] }[]>([
    { data: [] },
  ]);

  useEffect(() => {
    formatRef.current = format;
  }, [format]);

  const saveChartState = (state: { xaxis: Axis, yaxis: Axis }) => {
    setSavedChartState(state);
  };

  useEffect(() => {
    let data: { x: Date; y: number[] }[] = [];
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
    }
    else if (chartSortDate) {
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

  // 차트가 리렌더링 되더라도 확대 및 축소 상태를 보존
  useEffect(() => {
    if (savedChartState) {
      const chart = ApexCharts.getChartByID('crypto-chart');
      if (chart) {
        chart.zoomX(savedChartState.xaxis.min, savedChartState.xaxis.max);
        chart.updateOptions({
          yaxis: {
            min: savedChartState.yaxis.min,
            max: savedChartState.yaxis.max
          }
        });
      }
    }
  }, [series]);

  // X 레이블과 툴팁의 값을 포맷
  const xLabelFormat = (dateTime: number, format: string) => {
    const dateObj = moment.tz(dateTime, 'Asia/Seoul');

    switch (format) {
      case '1일':
      case '1주':
        return dateObj.format('MM/DD');
      case '1개월':
        return dateObj.format('YYYY. MM');
      case '1시간':
      case '4시간':
        return dateObj.format('MM/DD HH:mm')
      case '1분':
      case '5분':
      case '10분':
      case '30분':
        return dateObj.format('HH:mm')
      default:
        return dateObj.format('YYYY. MM/DD HH:mm');
    }
  };

  const [chartOptions, setChartOptions] = useState<any>({
    chart: {
      type: 'candlestick' as const,
      height: '100%',
      id: 'crypto-chart',
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
      events: {
        zoomed: (chartContext: any, { xaxis, yaxis }: any) => {
          saveChartState({
            xaxis: {
              min: xaxis.min,
              max: xaxis.max,
            },
            yaxis: {
              min: yaxis.min,
              max: yaxis.max,
            }
          });
        },
        scrolled: (chartContext: any, { xaxis, yaxis }: any) => {
          saveChartState({
            xaxis: {
              min: xaxis.min,
              max: xaxis.max,
            },
            yaxis: {
              min: yaxis.min,
              max: yaxis.max,
            }
          });
        }
      }
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
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      followCursor: true,
      intersect: false,
      fixed: {
        enabled: true,
        position: 'topRight',
        offsetX: -12,
        offsetY: 44,
      },
      custom: function ({ seriesIndex, dataPointIndex, w }: { seriesIndex: number, dataPointIndex: number, w: any }) {
        if (seriesIndex === -1 || dataPointIndex === -1) return;
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];

        return `
          <div class="apexchart-tooltip">
            <div class="open-close">
              <div>시가: <b>${formatWithComas(o)}</b></div>
              <div>종가: <b>${formatWithComas(c)}</b></div>
            </div>
            <div class="high-low">
              <div>고가: <b>${formatWithComas(h)}</b></div>
              <div>저가: <b>${formatWithComas(l)}</b></div>
            </div>
          </div>
        `;
      },
    },
  });

  return (
    <Chart
      id="#chart"
      options={chartOptions}
      series={series}
      type="candlestick"
      height='62%'
    />
  );
}