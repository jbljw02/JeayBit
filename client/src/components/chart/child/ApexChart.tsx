import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import moment from 'moment-timezone';
import { useAppSelector } from '../../../redux/hooks';
import formatWithComas from '../../../utils/format/formatWithComas';
import { Market } from '../../../redux/features/chartSlice';
import { ApexOptions } from 'apexcharts';

type Axis = {
  min: number,
  max: number,
}

export default function ApexChart() {
  const candlePerDate = useAppSelector(state => state.candlePerDate);
  const candlePerMinute = useAppSelector(state => state.candlePerMinute);
  const chartSortTime = useAppSelector(state => state.chartSortTime);
  const chartSortDate = useAppSelector(state => state.chartSortDate);

  const [format, setFormat] = useState<string>(chartSortTime ? chartSortTime : chartSortDate);
  const [savedChartState, setSavedChartState] = useState<{ xaxis: Axis, yaxis: any } | null>(null);
  const [series, setSeries] = useState<{ data: { x: Date; y: number[] }[] }[]>([
    { data: [] },
  ]);

  const saveChartState = (state: { xaxis: Axis, yaxis?: any }) => {
    const newState = {
      xaxis: state.xaxis,
      yaxis: state.yaxis ? state.yaxis : savedChartState?.yaxis
    };
    setSavedChartState(newState);
  };

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      type: 'candlestick',
      height: 'auto',
      id: 'crypto-chart',
      zoom: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      events: {
        zoomed: (chartContext: ApexCharts, { xaxis, yaxis }: any) => {
          if (xaxis) {
            saveChartState({
              xaxis: {
                min: xaxis.min,
                max: xaxis.max,
              },
              yaxis: yaxis,
            });
          }
        },
        scrolled: (chartContext: ApexCharts, { xaxis, yaxis }: any) => {
          if (xaxis) {
            saveChartState({
              xaxis: {
                min: xaxis.min,
                max: xaxis.max,
              },
              yaxis: yaxis,
            });
          }
        },
        beforeResetZoom: () => {
          setSavedChartState(null);
          const chart = ApexCharts.getChartByID('crypto-chart');
          if (chart) {
            chart.updateOptions({
              xaxis: {
                min: undefined,
                max: undefined
              },
              yaxis: {
                min: undefined,
                max: undefined,
                labels: {
                  formatter: function (value: number) {
                    return formatWithComas(value);
                  },
                },
                tooltip: {
                  enabled: true,
                },
                crosshairs: {
                  show: true,
                  position: 'back',
                  stroke: {
                    color: '#b6b6b6',
                    width: 1,
                    dashArray: 4,
                  }
                },
              }
            }, false, true);
          }
        }
      }
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 6,
      labels: {
        formatter: function (value: string) {
          const label = xLabelFormat(Number(value), format);
          return label;
        },
      },
      tooltip: {
        enabled: true,
        offsetY: 5,
        formatter: function (value: string) {
          return moment(Number(value)).format('MM/DD HH:mm');
        },
      }
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
      crosshairs: {
        show: true,
        position: 'back',
        stroke: {
          color: '#b6b6b6',
          width: 1,
          dashArray: 4,
        }
      },
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
              <div>고가: <b style="color: #22ab94;">${formatWithComas(h)}</b></div>
              </div>
              <div class="high-low">
              <div>종가: <b>${formatWithComas(c)}</b></div>
              <div>저가: <b style="color: #f23645;">${formatWithComas(l)}</b></div>
            </div>
          </div>
        `;
      },
    },
  });

  // X 레이과 툴팁의 값을 포맷
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

  useEffect(() => {
    // 캔들 데이터의 값을 차트에 적용시키기 위해 포맷
    const formatCandleData = (candle: Market) => ({
      x: moment.tz(candle.candleDateTimeKst, 'Asia/Seoul').toDate(),
      y: [
        candle.openingPrice,
        candle.highPrice,
        candle.lowPrice,
        candle.tradePrice,
      ],
    });

    let data: { x: Date; y: number[] }[] = [];

    // 차트의 값을 구분 시간/일자에 따라서 할당 
    if (chartSortTime) {
      setFormat(chartSortTime);
      data = candlePerMinute.map(formatCandleData);
    }
    else if (chartSortDate) {
      setFormat(chartSortDate);
      data = candlePerDate.map(formatCandleData);
    }

    // 차트 객체 가오기
    const chart = ApexCharts.getChartByID('crypto-chart');
    if (chart) {
      // 새로운 데이터로 series 업데이트
      chart.updateSeries([{ data }], false);

      // 저장된 차트의 상태가 있다면 복원
      if (savedChartState) {
        chart.updateOptions({
          xaxis: {
            min: savedChartState.xaxis.min,
            max: savedChartState.xaxis.max,
          },
        }, false, false);
      }
    }
    else {
      setSeries([{ data }]);
    }
  }, [candlePerDate, candlePerMinute, chartSortTime, chartSortDate]);

  useEffect(() => {
    // 차트 높이 업데이트
    const updateChartHeight = () => {
      const chartElement = document.querySelector('#crypto-chart');
      if (chartElement) {
        // 차트의 부모 요소를 가져와 높이를 계산
        const containerHeight = chartElement.parentElement?.clientHeight;
        if (containerHeight) {
          // 차트 높이 업데이트 - 차트 하단 날짜 공간을 확보하기 위해 60px 빼기
          const chart = ApexCharts.getChartByID('crypto-chart');
          chart?.updateOptions({
            chart: {
              height: containerHeight - 60
            }
          });
        }
      }
    };

    // 화면의 크기가 변경될 때마다 확인
    window.addEventListener('resize', updateChartHeight);
    updateChartHeight();

    return () => window.removeEventListener('resize', updateChartHeight);
  }, [series]);

  return (
    <Chart
      id="crypto-chart"
      options={chartOptions}
      series={series}
      type="candlestick" />
  );
}