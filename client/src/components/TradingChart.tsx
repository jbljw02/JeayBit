import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function TradingChart() {
  const candlePerDate_BTC = useSelector((state: RootState) => state.candlePerDate_BTC);
  const candlePerDate = useSelector((state: RootState) => state.candlePerDate);
  const candlePerWeek = useSelector((state: RootState) => state.candlePerWeek);
  const candlePerMonth = useSelector((state: RootState) => state.candlePerMonth);
  const candlePerMinute = useSelector((state: RootState) => state.candlePerMinute);
  const chartSortTime = useSelector((state: RootState) => state.chartSortTime);
  const chartSortDate = useSelector((state: RootState) => state.chartSortDate);

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
    },
    xaxis: {
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
      tooltip: { enabled: true }
    }
  });

  const series: any = [
    {
      name: 'candle',
      data: []
    }
  ];

  // X축(날짜)을 지정
  for (let i = candlePerDate_BTC.length - 1; i >= 0; i--) {
    const item = {
      x: candlePerDate_BTC[i] !== undefined ? candlePerDate_BTC[i].candle_date_time_kst.slice(5, 10) : '',
      y: []  // 시가, 고가, 저가, 종가순
    };
    series[0].data.push(item);

  }

  /* 캔들의 값을 지정 - 날짜별 */
  if (chartSortDate === '1일') {
    if (candlePerDate.length === 0) {
      for (let i = series[0].data.length - 1; i >= 0; i--) {
        if (series[0].data[i] !== undefined && candlePerDate_BTC[candlePerDate_BTC.length - 1 - i] !== undefined) {
          series[0].data[i].y[0] = candlePerDate_BTC[candlePerDate_BTC.length - 1 - i].opening_price;
          series[0].data[i].y[1] = candlePerDate_BTC[candlePerDate_BTC.length - 1 - i].high_price;
          series[0].data[i].y[2] = candlePerDate_BTC[candlePerDate_BTC.length - 1 - i].low_price;
          series[0].data[i].y[3] = candlePerDate_BTC[candlePerDate_BTC.length - 1 - i].trade_price;
        }
      }
    }
    else {
      for (let i = series[0].data.length - 1; i >= 0; i--) {
        if (series[0].data[i] !== undefined && candlePerDate[candlePerDate.length - 1 - i] !== undefined) {
          series[0].data[i].y[0] = candlePerDate[candlePerDate.length - 1 - i].opening_price;
          series[0].data[i].y[1] = candlePerDate[candlePerDate.length - 1 - i].high_price;
          series[0].data[i].y[2] = candlePerDate[candlePerDate.length - 1 - i].low_price;
          series[0].data[i].y[3] = candlePerDate[candlePerDate.length - 1 - i].trade_price;
        }
      }
    }
  }
  else if (chartSortDate === '1주') {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] !== undefined && candlePerWeek[candlePerWeek.length - 1 - i] !== undefined) {
        // X축
        series[0].data[i].x = candlePerWeek[candlePerWeek.length - 1 - i].candle_date_time_kst.slice(5, 10);

        // Y축
        series[0].data[i].y[0] = candlePerWeek[candlePerWeek.length - 1 - i].opening_price;
        series[0].data[i].y[1] = candlePerWeek[candlePerWeek.length - 1 - i].high_price;
        series[0].data[i].y[2] = candlePerWeek[candlePerWeek.length - 1 - i].low_price;
        series[0].data[i].y[3] = candlePerWeek[candlePerWeek.length - 1 - i].trade_price;

      }
    }
  }
  else if (chartSortDate === '1개월') {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] !== undefined && candlePerMonth[candlePerMonth.length - 1 - i] !== undefined) {
        // X축
        series[0].data[i].x = candlePerMonth[candlePerMonth.length - 1 - i].candle_date_time_kst.slice(2, 10);

        // Y축
        series[0].data[i].y[0] = candlePerMonth[candlePerMonth.length - 1 - i].opening_price;
        series[0].data[i].y[1] = candlePerMonth[candlePerMonth.length - 1 - i].high_price;
        series[0].data[i].y[2] = candlePerMonth[candlePerMonth.length - 1 - i].low_price;
        series[0].data[i].y[3] = candlePerMonth[candlePerMonth.length - 1 - i].trade_price;
      }
    }
  }

  /* 캔들의 값을 지정 - 시간별 */
  if (chartSortTime === '1분') {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] !== undefined && candlePerMinute[candlePerMinute.length - 1 - i] !== undefined) {
        // X축
        series[0].data[i].x = candlePerMinute[candlePerMinute.length - 1 - i].candle_date_time_kst.slice(11, 16);

        // Y축
        series[0].data[i].y[0] = candlePerMinute[candlePerMinute.length - 1 - i].opening_price;
        series[0].data[i].y[1] = candlePerMinute[candlePerMinute.length - 1 - i].high_price;
        series[0].data[i].y[2] = candlePerMinute[candlePerMinute.length - 1 - i].low_price;
        series[0].data[i].y[3] = candlePerMinute[candlePerMinute.length - 1 - i].trade_price;
      }
    }
  }
  else if (chartSortTime === '5분') {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] !== undefined && candlePerMinute[candlePerMinute.length - 1 - i] !== undefined) {
        // X축
        series[0].data[i].x = candlePerMinute[candlePerMinute.length - 1 - i].candle_date_time_kst.slice(11, 16);

        // Y축
        series[0].data[i].y[0] = candlePerMinute[candlePerMinute.length - 1 - i].opening_price;
        series[0].data[i].y[1] = candlePerMinute[candlePerMinute.length - 1 - i].high_price;
        series[0].data[i].y[2] = candlePerMinute[candlePerMinute.length - 1 - i].low_price;
        series[0].data[i].y[3] = candlePerMinute[candlePerMinute.length - 1 - i].trade_price;
      }
    }
  }
  else if (chartSortTime === '10분') {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] !== undefined && candlePerMinute[candlePerMinute.length - 1 - i] !== undefined) {
        // X축
        series[0].data[i].x = candlePerMinute[candlePerMinute.length - 1 - i].candle_date_time_kst.slice(11, 16);

        // Y축
        series[0].data[i].y[0] = candlePerMinute[candlePerMinute.length - 1 - i].opening_price;
        series[0].data[i].y[1] = candlePerMinute[candlePerMinute.length - 1 - i].high_price;
        series[0].data[i].y[2] = candlePerMinute[candlePerMinute.length - 1 - i].low_price;
        series[0].data[i].y[3] = candlePerMinute[candlePerMinute.length - 1 - i].trade_price;
      }
    }
  }
  else if (chartSortTime === '30분') {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] !== undefined && candlePerMinute[candlePerMinute.length - 1 - i] !== undefined) {
        // X축
        series[0].data[i].x = candlePerMinute[candlePerMinute.length - 1 - i].candle_date_time_kst.slice(5, 16);

        // Y축
        series[0].data[i].y[0] = candlePerMinute[candlePerMinute.length - 1 - i].opening_price;
        series[0].data[i].y[1] = candlePerMinute[candlePerMinute.length - 1 - i].high_price;
        series[0].data[i].y[2] = candlePerMinute[candlePerMinute.length - 1 - i].low_price;
        series[0].data[i].y[3] = candlePerMinute[candlePerMinute.length - 1 - i].trade_price;
      }
    }
  }
  else if (chartSortTime === '1시간') {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] !== undefined && candlePerMinute[candlePerMinute.length - 1 - i] !== undefined) {
        // X축
        series[0].data[i].x = candlePerMinute[candlePerMinute.length - 1 - i].candle_date_time_kst.slice(5, 16);

        // Y축
        series[0].data[i].y[0] = candlePerMinute[candlePerMinute.length - 1 - i].opening_price;
        series[0].data[i].y[1] = candlePerMinute[candlePerMinute.length - 1 - i].high_price;
        series[0].data[i].y[2] = candlePerMinute[candlePerMinute.length - 1 - i].low_price;
        series[0].data[i].y[3] = candlePerMinute[candlePerMinute.length - 1 - i].trade_price;
      }
    }
  }
  else if (chartSortTime === '4시간') {
    for (let i = series[0].data.length - 1; i >= 0; i--) {
      if (series[0].data[i] !== undefined && candlePerMinute[candlePerMinute.length - 1 - i] !== undefined) {
        // X축
        series[0].data[i].x = candlePerMinute[candlePerMinute.length - 1 - i].candle_date_time_kst.slice(5, 16);

        // Y축
        series[0].data[i].y[0] = candlePerMinute[candlePerMinute.length - 1 - i].opening_price;
        series[0].data[i].y[1] = candlePerMinute[candlePerMinute.length - 1 - i].high_price;
        series[0].data[i].y[2] = candlePerMinute[candlePerMinute.length - 1 - i].low_price;
        series[0].data[i].y[3] = candlePerMinute[candlePerMinute.length - 1 - i].trade_price;
      }
    }
  }

  return (
    <ReactApexChart options={options} series={series} type="candlestick" height={'100%'} />
  );
};
