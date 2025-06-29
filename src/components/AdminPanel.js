import React, { useState } from 'react';
import AddArticle from './AddArticle';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

// Placeholder components
const EditProfile = () => <div className="p-6"><h2 className="text-xl font-semibold mb-4">Profil Bilgileri</h2><p>Profil bilgilerini buradan güncelleyebilirsiniz.</p></div>;
const EditContact = () => <div className="p-6"><h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2><p>İletişim bilgilerini buradan güncelleyebilirsiniz.</p></div>;

const AdminPanel = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [activeMenu, setActiveMenu] = useState('addArticle');
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('addArticle.title')}</h2>
      <AddArticle />
    </div>
  );
};

export default AdminPanel;