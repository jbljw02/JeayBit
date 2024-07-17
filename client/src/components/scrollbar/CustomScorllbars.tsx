import React, { ReactNode, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

type CustomScrollbarsProps = {
  children: ReactNode;
  style?: React.CSSProperties;
  hideScrollBar?: boolean;
  [key: string]: any;
};

const CustomScrollbars: React.FC<CustomScrollbarsProps> = ({ children, hideScrollBar = false, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderThumb = ({ style, ...props }: { style: React.CSSProperties }) => {
    const thumbStyle = {
      backgroundColor: '#727272',
      borderRadius: '4px',
      width: '5px', // 스크롤바의 너비 설정
      height: '30px', // 스크롤바의 높이 설정
      marginLeft: '1px',
      opacity: hideScrollBar || !isHovered ? 0 : 1, // 파라미터와 호버 상태에 따라 스크롤바 숨기기
      transition: 'opacity 0.3s ease', // 애니메이션 효과 추가
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const handleScroll = () => {
    setIsHovered(true);
    setTimeout(() => {
      setIsHovered(false);
    }, 1000); // 스크롤 후 1초 동안 스크롤바 보이기
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onScroll={handleScroll}
      style={{ height: '100%' }}>
      <Scrollbars
        renderThumbVertical={renderThumb}
        {...props}>
        {children}
      </Scrollbars>
    </div>
  );
};

export default CustomScrollbars;
