import React from 'react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

const GlobalLoader = ({ show }) => {
  const { isDarkMode } = useTheme();
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 flex items-center justify-center">
        <Logo className="w-12 h-12 mx-auto my-auto" />
      </div>
      <span className="mt-4 text-gray-200 text-lg font-semibold">Yükleniyor...</span>
    </div>
  );
};

export default GlobalLoader; 