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
      opacity: isHovered ? 1 : 0,
      transition: 'opacity 0.3s ease',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  return (
    <Scrollbars
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: '100%' }}
      renderThumbVertical={renderThumb}
      {...props}>
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbars;
