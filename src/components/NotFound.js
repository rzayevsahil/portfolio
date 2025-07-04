import React from 'react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  // If in /admin, go to /admin/profile, else go to /
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#181b20] text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Logo className="h-16 w-auto mb-8" />
      <div className="text-7xl font-extrabold mb-4">404</div>
      <div className="text-2xl font-semibold mb-2">{t('notFound.title')}</div>
      <div className="mb-8 text-center max-w-md text-lg opacity-80">{t('notFound.description')}</div>
      <button
        onClick={() => navigate(isAdmin ? '/admin/profile' : '/')}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow transition"
      >
        {isAdmin ? t('notFound.adminButton') : t('notFound.homeButton')}
      </button>
    </div>
  );
};

export default NotFound; 