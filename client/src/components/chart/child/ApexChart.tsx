import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { Market, RootState, ChartSortDate, ChartSortTime, setChartSort } from '../../../redux/store';

type SeriesData = {
  x: string | number;
  y: number[];
}

type Series = {
  name: string;
  data: SeriesData[];
}

export default function TradingChart() {
  const candlePerDate = useSelector((state: RootState) => state.candlePerDate);
  const candlePerMinute = useSelector((state: RootState) => state.candlePerMinute);
  const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);

  // console.log("chartSortTime: ", chartSortTime);
  // console.log("chartSortDate: ", chartSortDate);

  const [format, setFormat] = useState<string>(chartSortTime ? chartSortTime : chartSortDate); // 초기값을 null로 설정

  useEffect(() => {
    console.log("초기 chartSortTime: ", chartSortTime);
    console.log("초기 chartSortDate: ", chartSortDate);
    if (chartSortTime) {
      setFormat(chartSortTime);
    } else if (chartSortDate) {
      setFormat(chartSortDate);
    }
  }, []); // 빈 의존성 배열로 처음 마운트될 때만 실행

  useEffect(() => {
    if (chartSortTime) {
      setFormat(chartSortTime);
    }
  }, [chartSortTime]);

  useEffect(() => {
    if (!chartSortTime && chartSortDate) {
      setFormat(chartSortDate);
    }
  }, [chartSortDate, chartSortTime]);


  const getXValue = (timeStamp: string | number, format: string) => {
    const dateObj = new Date(timeStamp);

    const pad = (num: number) => num.toString().padStart(2, '0');

    const year = dateObj.getFullYear();
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());
    const hour = pad(dateObj.getHours());
    const minute = pad(dateObj.getMinutes());

    console.log("포맷: ", format);
    switch (format) {
      case '1일':
      case '1주':
      case '1개월':
        console.log(`년월일: ${year}-${month}-${day}`);
        return `${year}-${month}-${day}`;
      case '1분':
      case '5분':
      case '10분':
      case '30분':
      case '1시간':
      case '4시간':
        console.log(`월: ${month}-${day} ${hour}:${minute}`);
        return `${month}-${day} ${hour}:${minute}`;
      default:
        console.log(`기본: ${year}-${month}-${day} ${hour}:${minute}`);
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

  };

  // eslint-disable-next-line
  const [options, setOptions] = useState<any>({
    chart: {
      height: '100%',
      type: 'candlestick',
    },
    title: {
      // text: 'cr_names_selected',
      align: 'left'
    },
    annotations: {
      xaxis: [
        {
          x: 'Oct 06 14:00',
          borderColor: '#00E396',
          label: {
            borderColor: '#00E396',
            style: {
              fontSize: '12px',
              color: '#fff',
              background: '#00E396'
            },
            orientation: 'horizontal',
            offsetY: 7,
            // text: 'Annotation Test'
          }
        }
      ]
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: number, dataPointIndex: number, w: any }) {
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        const rawDate = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]).getTime();
        const x = getXValue(rawDate, format); // getXValue 함수 사용
        return `
          <div class="apexcharts-tooltip-candlestick">
            <div>날짜: <span>${x}</span></div>
            <div>시가: <span>${o}</span></div>
            <div>고가: <span>${h}</span></div>
            <div>저가: <span>${l}</span></div>
            <div>종가: <span>${c}</span></div>
          </div>
        `;
      }
    },
    xaxis: {
      type: 'datetime', // 추가된 부분
      tickAmount: 6,
      labels: {
        style: {
          colors: '#7f7f7f',
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#7f7f7f',
        }
      },
      tooltip: { enabled: false }
    }
  });

  const series: Series[] = [
    {
      name: 'candle',
      data: []
    }
  ];

  const isChartSortDate = (value: string): value is ChartSortDate => {
    return value === '1일' || value === '1주' || value === '1개월';
  };

  const isChartSortTime = (value: string): value is ChartSortTime => {
    return value === '1분' || value === '5분' || value === '10분' || value === '30분' || value === '1시간' || value === '4시간';
  };

  const updateSeriesData = (chartSortDate: string, series: Series[], candlePerSort: Market[]) => {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] && candlePerSort[candlePerSort.length - 1 - i]) {
        const candleData = candlePerSort[candlePerSort.length - 1 - i];
        const x = new Date(candleData.candle_date_time_kst).getTime();
        // console.log("dd: ", dd);
        series[0].data[i].x = x;
        // console.log("이거: ", series[0].data[i].x);
        series[0].data[i].y[0] = candleData.opening_price;
        series[0].data[i].y[1] = candleData.high_price;
        series[0].data[i].y[2] = candleData.low_price;
        series[0].data[i].y[3] = candleData.trade_price;
      }
    }
  }

  // X축(날짜)을 지정
  for (let i = candlePerDate.length - 1; i >= 0; i--) {
    const item = {
      x: candlePerDate[i] ? candlePerDate[i].candle_date_time_kst.slice(5, 10) : '',
      y: [] // 시가, 고가, 저가, 종가순
    };
    series[0].data.push(item);

  }

  // chartSortDate와 chartSortTime 타입 검사
  if (isChartSortDate(chartSortDate)) {
    if (!chartSortTime) {
      updateSeriesData(chartSortDate, series, candlePerDate);
    } else if (isChartSortTime(chartSortTime)) {
      updateSeriesData(chartSortTime, series, candlePerMinute);
    }
  } else {
    console.error('chartSortDate가 올바른 값이 아닙니다.');
  }

  return (
    <div className='trading-chart'>

      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={'100%'} />
    </div>
  );
};
