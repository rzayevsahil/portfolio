import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaPlus, FaSearch, FaCalendar, FaUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';
import { articleApi, BASE_URL } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import emptyBlogImg from '../../assets/empty-blog.png';
import { getImageUrl } from '../../utils/imageHelpers';

const BlogManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useTheme();
  const { setGlobalLoading } = useLoading();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'published', 'hidden'

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setGlobalLoading(true);
      setError('');
      const data = await articleApi.getAll();
      setArticles(data);
    } catch (err) {
      setError(t('blogManagement.loadError'));
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  // Tarih ve saat formatlama fonksiyonu
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' ' + date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getExcerpt = (html, maxLength = 100) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const handleDelete = async (article) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      setGlobalLoading(true);
      const articleId = articleToDelete.id ?? articleToDelete.Id;
      await articleApi.delete(articleId);
      await loadArticles();
      setAlert({ message: t('blogManagement.deleteSuccess'), type: 'success' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    } catch (err) {
      setAlert({ message: t('blogManagement.deleteError'), type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    } finally {
      setGlobalLoading(false);
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const handleStatusToggle = async (article) => {
    try {
      setGlobalLoading(true);
      const articleId = article.id ?? article.Id;
      const updatedArticle = {
        Id: articleId,
        TitleTr: article.titleTr,
        TitleEn: article.titleEn,
        ContentTr: article.contentTr,
        ContentEn: article.contentEn,
        Author: article.author,
        Date: article.date,
        Image: article.image,
        Status: article.status,
        IsPublished: !article.isPublished,
        Type: article.type || article.Type || 'classic'
      };
      await articleApi.update(articleId, updatedArticle);
      if (!article.isPublished) {
        setAlert({ message: t('blogManagement.publishSuccess'), type: 'success' });
      } else {
        setAlert({ message: t('blogManagement.hideSuccess'), type: 'success' });
      }
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      loadArticles();
    } catch (err) {
      setAlert({ message: t('blogManagement.statusUpdateError'), type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleEdit = (article) => {
    const type = article.type || article.Type || 'classic';
    if (type === 'medium') {
      navigate('/admin/medium', { state: { article } });
    } else {
      navigate('/admin/add-article', { state: { article } });
    }
  };

  // Sayaçlar
  const totalCount = articles.length;
  const publishedCount = articles.filter(a => a.isPublished).length;
  const hiddenCount = articles.filter(a => !a.isPublished).length;

  const filteredArticles = articles.filter(article => {
    // Filtreye göre yayında/gizli seçimi
    if (statusFilter === 'published' && !article.isPublished) return false;
    if (statusFilter === 'hidden' && article.isPublished) return false;
    const title = i18n.language === 'en' ? article.titleEn : article.titleTr;
    const searchLower = (searchTerm || '').toLowerCase();
    return title.toLowerCase().includes(searchLower) || (article.author || '').toLowerCase().includes(searchLower);
  });

  // Sayfalama hesaplamaları
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('blogManagement.title')}
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('blogManagement.subtitle')}
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto justify-start md:justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/add-article')}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FaPlus size={16} />
            {t('blogManagement.newArticle')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/medium')}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus size={16} />
            Yeni Medium
          </motion.button>
        </div>
      </div>

      {/* Alert Message */}
      {alert.message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300
            ${alert.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          style={{ minWidth: 220, textAlign: 'center' }}
        >
          {alert.message}
        </motion.div>
      )}

      {/* Filtreler ve sayaçlar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${statusFilter === 'all' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'}`}
            onClick={() => setStatusFilter('all')}
          >Tümü ({totalCount})</button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${statusFilter === 'published' ? 'bg-green-600 text-white' : isDarkMode ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'}`}
            onClick={() => setStatusFilter('published')}
          >Yayınlananlar ({publishedCount})</button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${statusFilter === 'hidden' ? 'bg-red-500 text-white' : isDarkMode ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'}`}
            onClick={() => setStatusFilter('hidden')}
          >Gizli ({hiddenCount})</button>
        </div>
        <div className="relative max-w-md w-full md:w-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={t('blogManagement.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-10 py-3 rounded-lg border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none`}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
              aria-label="Temizle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.415L11.414 10l4.95 4.95a1 1 0 01-1.414 1.415L10 11.414l-4.95 4.95a1 1 0 01-1.415-1.415L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Silme Onay Modali */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center`}>
            <h3 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-white">{t('blogManagement.deleteConfirm') || 'Bu makaleyi silmek istediğinize emin misiniz?'}</h3>
            <div className="flex gap-4 mt-2">
              <button
                onClick={confirmDelete}
                className="btn btn-danger px-6 py-2 font-semibold rounded shadow hover:bg-red-700 transition"
              >
                {t('blogManagement.delete') || 'Evet'}
              </button>
              <button
                onClick={cancelDelete}
                className="btn btn-secondary px-6 py-2 font-semibold rounded shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                {t('blogManagement.cancel') || 'Hayır'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-400">Yükleniyor...</div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
              onClick={loadArticles}
              className="btn btn-primary"
            >
              {t('blogManagement.retry')}
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {currentArticles.map((article, index) => {
              const title = i18n.language === 'en' ? article.titleEn : article.titleTr;
              const content = i18n.language === 'en' ? article.contentEn : article.contentTr;
              
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`p-6 rounded-lg border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50' 
                      : 'bg-white border-gray-200 hover:border-blue-500/50 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Article Image */}
                    <div className="w-full lg:w-48 h-32 lg:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(article.Image || article.image, BASE_URL, emptyBlogImg)}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Article Content */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-3">
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {article.isPublished ? t('blogManagement.published') : t('blogManagement.hidden')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <FaUser size={12} />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendar size={12} />
                          <span>{formatDate(article.date)}</span>
                        </div>
                      </div>

                      <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getExcerpt(content, 150)}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(article)}
                          className="btn btn-secondary btn-sm flex items-center gap-2"
                        >
                          <FaEdit size={14} />
                          {t('blogManagement.edit')}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusToggle(article)}
                          className={`btn btn-sm flex items-center gap-2 ${
                            article.isPublished ? 'btn-warning' : 'btn-success'
                          }`}
                        >
                          {article.isPublished ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                          {article.isPublished ? t('blogManagement.hide') : t('blogManagement.publish')}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(article)}
                          className="btn btn-danger btn-sm flex items-center gap-2"
                        >
                          <FaTrash size={14} />
                          {t('blogManagement.delete')}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {searchTerm ? t('blogManagement.noSearchResults') : t('blogManagement.noArticles')}
            </div>
          </motion.div>
        )}

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
            {/* Sayfa butonları */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-500 hover:text-white'
                } ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-gray-300' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                ←
              </motion.button>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <motion.button
                      key={pageNumber}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                        isCurrentPage
                          ? 'bg-blue-500 text-white border-blue-500'
                          : `hover:bg-blue-500 hover:text-white ${
                              isDarkMode 
                                ? 'bg-gray-800 border-gray-600 text-gray-300' 
                                : 'bg-white border-gray-300 text-gray-700'
                            }`
                      }`}
                    >
                      {pageNumber}
                    </motion.button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className={`px-3 py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-500 hover:text-white'
                } ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-gray-300' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                →
              </motion.button>
            </div>

            {/* Sayfa inputu ve toplam sayfa bilgisi */}
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sayfa:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= totalPages) {
                    handlePageChange(value);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= totalPages) {
                      handlePageChange(value);
                    }
                  }
                }}
                className={`w-16 px-2 py-1 text-center rounded border text-sm transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none`}
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>/ {totalPages}</span>
            </div>
          </div>
        )}

        {/* Sayfa aralığı bilgisi altta */}
        {filteredArticles.length > 0 && (
          <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ marginTop: 8 }}>
            {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredArticles.length)} / {filteredArticles.length} makale
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement; 