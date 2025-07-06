import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaUser, FaArrowRight, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import emptyBlogImg from '../assets/empty-blog.png';
import { articleApi, BASE_URL } from '../api/api';
import { getImageUrl } from '../utils/imageHelpers';

function getExcerpt(html, maxLength = 100) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || tempDiv.innerText || '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    articleApi.getPublished()
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Makaleler yüklenemedi.');
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const locale = i18n.language === 'en' ? 'en-US' : 'tr-TR';
    const datePart = date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timePart = date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',      
      hour12: false
    });
    return `${datePart} ${timePart}`;
  };

  // En son eklenen 3 makaleyi tarihe göre azalan sırala
  const sortedArticles = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <section id="blog" className={`section ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-50'}`}> 
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('blog.title')}</h2>
          <p className="section-subtitle">{t('blog.subtitle')}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
          >
            {sortedArticles.slice(0, 3).map((article, index) => {
              const lang = i18n.language;
              const title = lang === 'en' ? article.titleEn : article.titleTr;
              const content = lang === 'en' ? article.contentEn : article.contentTr;
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`h-[420px] flex flex-col rounded-lg overflow-hidden border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50' 
                      : 'bg-white backdrop-blur-sm border-gray-200/50 hover:border-blue-500/50 shadow-lg'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden mb-4 rounded-t-lg">
                    <img
                      src={getImageUrl(article.Image || article.image, BASE_URL, emptyBlogImg)}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col px-4">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3 h-6">
                      <div className="flex items-center space-x-1">
                        <FaUser size={12} />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaCalendar size={12} />
                        <span>{formatDate(article.date)}</span>
                      </div>
                    </div>
                    <h3 className={`text-xl font-bold mb-3 line-clamp-2 min-h-[56px] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                    <div className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} overflow-hidden`}>
                      {getExcerpt(content)}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-300 mt-2 mb-4 px-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    onClick={() => navigate(`/article/${article.id}`, { state: { fromBlogList: false } })}
                  >
                    <span>{t('blog.readMore')}</span>
                    <FaArrowRight size={12} />
                  </motion.button>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {articles.length > 0 && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/blog')}
              className={`px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {t('blog.showMore')}
            </motion.button>
          </div>
        )}

        {articles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('blog.noPublished')}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog; 