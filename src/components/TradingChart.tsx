import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCandle_per_date_BTC } from '../store';
import axios from 'axios';


const Chart = () => {
  const cr_names_selected = useSelector((state: RootState) => state.cr_names_selected);
  const candle_per_date = useSelector((state: RootState) => state.candle_per_date);
  const candle_per_date_BTC = useSelector((state: RootState) => state.candle_per_date_BTC);

  // console.log("이거임 : ", candle_per_date_BTC)

  // const dispatch = useDispatch();

  // const initialData = async () => {
  //   try {
  //     const response = await axios.get('http://127.0.0.1:8000/get_data/')

  //     console.log("BTC Chart: ", response.data.candle_btc_date)
  //     dispatch(setCandle_per_date_BTC(response.data.candle_btc_date))
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // console.log("값: ", candle_per_date_BTC);
  // console.log("값: ", candle_per_date[0].candle_date_time_kst.slice(0,10))


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
            text: 'Annotation Test'
          }
        }
      ]
    },
    tooltip: {
      enabled: true,
    },
    // xaxis: {
    //   type: 'category',
    //   labels: {
    //     formatter: function (val: any) {
    //       return dayjs(val).format('MMM DD HH:mm')
    //     }
    //   }
    // },
    yaxis: {
      tooltip: { enabled: true }
    }
  });

  const series : any = [
    {
      name: 'candle',
      data: []
    }
  ];

  // console.log("시리즈 : ", series[0].data) 

  // X축(날짜)를 지정
  for (let i = candle_per_date_BTC.length - 1; i >= 0; i--) {
    const item = {
      x: candle_per_date_BTC[i] !== undefined ? candle_per_date_BTC[i].candle_date_time_kst.slice(5, 10) : '',
      y: []  // 시가, 고가, 저가, 종가순
    };
  
    series[0].data.push(item);
  } 

  // 캔들의 실제 값을 지정
  for (let i = series[0].data.length -1; i>=0; i--) {
    if(series[0].data[i] !== undefined && candle_per_date_BTC[candle_per_date_BTC.length-1-i] !== undefined) {
      series[0].data[i].y[0] = candle_per_date_BTC[candle_per_date_BTC.length-1-i].opening_price;
      series[0].data[i].y[1] = candle_per_date_BTC[candle_per_date_BTC.length-1-i].high_price;
      series[0].data[i].y[2] = candle_per_date_BTC[candle_per_date_BTC.length-1-i].low_price;
      series[0].data[i].y[3] = candle_per_date_BTC[candle_per_date_BTC.length-1-i].trade_price;
    }
  }

  return (
    <ReactApexChart options={options} series={series} type="candlestick" height={1050} />
  );
};

export { Chart };
