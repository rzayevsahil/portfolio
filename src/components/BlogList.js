import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaUser, FaArrowRight, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import emptyBlogImg from '../assets/empty-blog.png';
import { articleApi } from '../api/api';

const BlogList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const blogsPerPage = 9;

  useEffect(() => {
    setLoading(true);
    setError('');
    articleApi.getAll()
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Makaleler yüklenemedi.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedScroll = localStorage.getItem('blogScroll');
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'auto' });
        localStorage.removeItem('blogScroll');
      }, 100);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const locale = i18n.language === 'en' ? 'en-US' : 'tr-TR';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Kategorileri makalelerden dinamik olarak türet
  const categories = [
    { id: 'all', name: t('blog.categories.all') },
    ...Array.from(new Set(articles.map(a => a.kategori))).filter(Boolean).map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  // Filtrelenmiş makaleler
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.kategori === activeCategory;
    const lang = i18n.language;
    const baslik = lang === 'en' ? article.baslikEn : article.baslikTr;
    const matchesSearch = baslik.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sayfalama için slice
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredArticles.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredArticles.length / blogsPerPage);

  // Sayfa değişince yukarı kaydır
  useEffect(() => {
    if (filteredArticles.length > 0) {
      const blogListSection = document.getElementById('blog-list');
      if (blogListSection) {
        blogListSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  function getExcerpt(html, maxLength = 100) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <section id="blog-list" className={`section min-h-screen ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-50'}`}> 
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('blog.title')}</h2>
          <p className="section-subtitle">{t('blog.subtitle')}</p>
        </motion.div>

        {/* Arama ve Kategori Filtreleri */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder') || 'Ara...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'}`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                  aria-label="Temizle"
                >
                  &#10005;
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'}`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
          >
            {currentBlogs.map((article, index) => {
              const lang = i18n.language;
              const baslik = lang === 'en' ? article.baslikEn : article.baslikTr;
              const icerik = lang === 'en' ? article.icerikEn : article.icerikTr;
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className={`h-[420px] flex flex-col rounded-lg overflow-hidden border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50' : 'bg-white backdrop-blur-sm border-gray-200/50 hover:border-blue-500/50 shadow-lg'}`}
                >
                  <div className="relative h-48 overflow-hidden mb-4 rounded-t-lg">
                    <img
                      src={article.image && article.image.trim() !== '' ? article.image : emptyBlogImg}
                      alt={baslik}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col px-4">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3 h-6">
                      <div className="flex items-center space-x-1">
                        <FaUser size={12} />
                        <span>{article.yazar}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaCalendar size={12} />
                        <span>{formatDate(article.tarih)}</span>
                      </div>
                    </div>
                    <h3 className={`text-xl font-bold mb-3 line-clamp-2 min-h-[56px] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{baslik}</h3>
                    <div className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} overflow-hidden`}>
                      {getExcerpt(icerik)}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-300 mt-2 mb-4 px-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    onClick={() => {
                      localStorage.setItem('blogScroll', window.scrollY);
                      navigate(`/article/${article.id}`, { state: { fromBlogList: true } });
                    }}
                  >
                    <span>{t('blog.readMore')}</span>
                    <FaArrowRight size={12} />
                  </motion.button>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Sayfalama butonları */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2 items-center">
            <div className="flex gap-2 items-center">
              {/* Önceki butonu */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg font-semibold border transition-colors duration-200 flex items-center justify-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                aria-label="Previous"
              >
                &#8249;
              </button>
              {/* Akıllı sayfa numaraları */}
              {(() => {
                const pages = [];
                const pageWindow = 1; // aktif sayfanın sağında/solunda kaç sayfa gösterilsin
                let start = Math.max(2, currentPage - pageWindow);
                let end = Math.min(totalPages - 1, currentPage + pageWindow);
                // İlk sayfa
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 ${currentPage === 1 ? 'bg-blue-600 text-white border-blue-600' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                  >1</button>
                );
                // ... (ilk ile start arasında)
                if (start > 2) {
                  pages.push(<span key="start-ellipsis" className="px-2 text-gray-400 select-none">...</span>);
                }
                // Ortadaki sayfalar
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 ${currentPage === i ? 'bg-blue-600 text-white border-blue-600' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >{i}</button>
                  );
                }
                // ... (end ile son arasında)
                if (end < totalPages - 1) {
                  pages.push(<span key="end-ellipsis" className="px-2 text-gray-400 select-none">...</span>);
                }
                // Son sayfa
                if (totalPages > 1) {
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 ${currentPage === totalPages ? 'bg-blue-600 text-white border-blue-600' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >{totalPages}</button>
                  );
                }
                return pages;
              })()}
              {/* Sonraki butonu */}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg font-semibold border transition-colors duration-200 flex items-center justify-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                aria-label="Next"
              >
                &#8250;
              </button>
            </div>
            {/* Sayfa numarası inputu */}
            <input
              type="number"
              min={1}
              max={totalPages}
              placeholder={t('blog.gotoPage') || 'Sayfa numarası...'}
              value={pageInput}
              onChange={e => setPageInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) {
                    setPageInput(currentPage);
                    return;
                  }
                  val = Math.max(1, Math.min(totalPages, val));
                  setCurrentPage(val);
                  setPageInput(val);
                }
              }}
              onBlur={e => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) {
                  setPageInput(currentPage);
                  return;
                }
                val = Math.max(1, Math.min(totalPages, val));
                setCurrentPage(val);
                setPageInput(val);
              }}
              className={`w-48 ml-4 px-3 py-2 rounded-lg border font-semibold text-center outline-none focus:ring-2 focus:ring-blue-400 transition-all ${isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-500' : 'bg-white text-gray-700 border-gray-300 placeholder-gray-400'}`}
              style={{ minWidth: 80 }}
              aria-label="Sayfa numarası"
            />
          </div>
        )}

        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('blog.noResults')}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogList; 