import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: 'https://flagcdn.com/w20/tr.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/gb.png' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="flex items-center space-x-2">
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`theme-toggle-btn p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none active:ring-0 shadow-none border-none ${
          isDarkMode 
            ? 'bg-gray-800/50 text-yellow-400 hover:bg-gray-700/50' 
            : 'bg-gray-200/50 text-gray-700 hover:bg-gray-300/50'
        }`}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
      </motion.button>

      {/* Language Selector */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          className={`lang-toggle-btn flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none active:ring-0 shadow-none border-none ${
            isDarkMode 
              ? 'bg-gray-800/50 text-white hover:bg-gray-700/50' 
              : 'bg-gray-200/50 text-gray-700 hover:bg-gray-300/50'
          }`}
          aria-label="Change language"
        >
          <FaGlobe size={16} />
          <img src={currentLang?.flag} alt="flag" className="w-5 h-3 rounded-sm" />
          <FaChevronDown 
            size={12} 
            className={`transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>

        <AnimatePresence>
          {isLanguageOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute right-0 top-full mt-2 py-2 rounded-lg shadow-lg z-50 min-w-[120px] ${
                isDarkMode 
                  ? 'bg-gray-800/90 backdrop-blur-md border border-gray-700/50' 
                  : 'bg-white/90 backdrop-blur-md border border-gray-200/50'
              }`}
            >
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  whileHover={{ backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)' }}
                  onClick={() => {
                    changeLanguage(language.code);
                    setIsLanguageOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${
                    currentLanguage === language.code
                      ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                      : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                  }`}
                >
                  <img src={language.flag} alt="flag" className="w-6 h-4 rounded-sm" />
                  <span className="font-medium">{language.name}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThemeToggle; 