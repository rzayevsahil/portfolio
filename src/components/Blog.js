import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaUser, FaTags, FaArrowRight, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: t('blog.categories.all') },
    { id: 'technology', name: t('blog.categories.technology') },
    { id: 'development', name: t('blog.categories.development') },
    { id: 'tutorial', name: t('blog.categories.tutorial') },
    { id: 'tips', name: t('blog.categories.tips') }
  ];

  const articles = [
    {
      id: 1,
      title: t('blog.articles.article1.title'),
      excerpt: t('blog.articles.article1.excerpt'),
      author: 'Sahil Rzayev',
      date: '2024-01-15',
      category: 'development',
      tags: ['ASP.NET Core', 'Web API', 'C#'],
      readTime: '8 dk',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: t('blog.articles.article2.title'),
      excerpt: t('blog.articles.article2.excerpt'),
      author: 'Sahil Rzayev',
      date: '2024-01-10',
      category: 'development',
      tags: ['Clean Architecture', 'SOLID', 'Design Patterns'],
      readTime: '12 dk',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: t('blog.articles.article3.title'),
      excerpt: t('blog.articles.article3.excerpt'),
      author: 'Sahil Rzayev',
      date: '2024-01-05',
      category: 'technology',
      tags: ['Docker', 'Microservices', 'DevOps'],
      readTime: '10 dk',
      image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: t('blog.articles.article4.title'),
      excerpt: t('blog.articles.article4.excerpt'),
      author: 'Sahil Rzayev',
      date: '2024-02-01',
      category: 'tips',
      tags: ['Productivity', 'Tips', 'Motivation'],
      readTime: '6 dk',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop',
      featured: false
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <p className="section-subtitle">
            {t('blog.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${searchTerm}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredArticles.slice(0, visibleCount).map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className={`rounded-lg overflow-hidden border transition-all duration-300 ${
                  article.featured ? 'ring-2 ring-blue-500/30' : ''
                } ${
                  isDarkMode 
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50' 
                    : 'bg-white backdrop-blur-sm border-gray-200/50 hover:border-blue-500/50 shadow-lg'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {article.featured && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {t('blog.featured')}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-gray-800/80 text-white px-2 py-1 rounded text-xs">
                    {article.readTime}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <FaUser size={12} />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaCalendar size={12} />
                      <span>{formatDate(article.date)}</span>
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {article.title}
                  </h3>

                  <p className={`text-sm mb-4 line-clamp-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded-full text-xs ${
                          isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                    onClick={() => navigate(`/article/${article.id}`, { state: { fromBlogList: false } })}
                  >
                    <span>{t('blog.readMore')}</span>
                    <FaArrowRight size={12} />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredArticles.length > visibleCount && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate('/blog')}
              className={`px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-300 ${
                isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {t('blog.showMore')}
            </button>
          </div>
        )}

        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('blog.noResults')}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog; 