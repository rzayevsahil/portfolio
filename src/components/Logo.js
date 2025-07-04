import React from 'react';
import logoImgWhite from '../assets/default-monochrome-white.svg';
import logoImgDark from '../assets/default-monochrome-black.svg';
import { useTheme } from '../context/ThemeContext';

const Logo = ({ className = '', style = {}, ...props }) => {
  const { isDarkMode } = useTheme();
  return (
    <img
      src={isDarkMode ? logoImgWhite : logoImgDark}
      alt="Logo"
      className={className}
      style={style}
      {...props}
    />
  );
};

export default Logo; 