import React, { ReactNode } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

type CustomScrollbarsProps = {
  children: ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
};

const CustomScrollbars: React.FC<CustomScrollbarsProps> = ({ children, ...props }) => {
  const renderThumb = ({ style, ...props }: { style: React.CSSProperties }) => {
    const thumbStyle = {
      backgroundColor: 'red',
      borderRadius: '4px',
      width: '10px', // 스크롤바의 너비 설정
      height: '30px', // 스크롤바의 높이 설정
      opacity: 0,
      transition: 'opacity 0.3s ease'
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderTrackVertical = ({ style, ...props }: { style: React.CSSProperties }) => {
    const trackStyle = {
      width: '10px', // 트랙의 너비 설정
      right: '2px', // 트랙의 위치 조정 (optional)
      bottom: '2px', // 트랙의 위치 조정 (optional)
      top: '2px', // 트랙의 위치 조정 (optional)
      borderRadius: '4px',
      backgroundColor: '#f1f1f1',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    };
    return <div style={{ ...style, ...trackStyle }} {...props} />;
  };

  return (
    <div
      className="scrollbar-container"
      onMouseEnter={() => {
        document.querySelectorAll('.thumb-vertical, .track-vertical').forEach(el => {
          (el as HTMLElement).style.opacity = '1';
        });
      }}
      onMouseLeave={() => {
        document.querySelectorAll('.thumb-vertical, .track-vertical').forEach(el => {
          (el as HTMLElement).style.opacity = '0';
        });
      }}
    >
      <Scrollbars renderThumbVertical={renderThumb} renderTrackVertical={renderTrackVertical} {...props}>
        {children}
      </Scrollbars>
    </div>
  );
};

export default CustomScrollbars;
