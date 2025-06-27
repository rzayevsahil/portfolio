import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'tr'; // Default to Turkish
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
  };

  const value = {
    currentLanguage,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 