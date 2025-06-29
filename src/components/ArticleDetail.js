import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendar, FaUser, FaTags, FaClock, FaShare } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import i18n from '../i18n';
import emptyBlogImg from '../assets/empty-blog.png';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const articles = [
    {
      id: 1,
      title: t('blog.articles.article1.title'),
      excerpt: t('blog.articles.article1.excerpt'),
      content: t('blog.articles.article1.content'),
      author: 'Sahil Rzayev',
      date: '2024-01-15',
      category: 'development',
      tags: ['ASP.NET Core', 'Web API', 'C#'],
      readTime: '8 dk',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: t('blog.articles.article2.title'),
      excerpt: t('blog.articles.article2.excerpt'),
      content: t('blog.articles.article2.content'),
      author: 'Sahil Rzayev',
      date: '2024-01-10',
      category: 'development',
      tags: ['Clean Architecture', 'SOLID', 'Design Patterns'],
      readTime: '12 dk',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'
    },
    {
      id: 3,
      title: t('blog.articles.article3.title'),
      excerpt: t('blog.articles.article3.excerpt'),
      content: t('blog.articles.article3.content'),
      author: 'Sahil Rzayev',
      date: '2024-01-05',
      category: 'technology',
      tags: ['Docker', 'Microservices', 'DevOps'],
      readTime: '10 dk',
      image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop'
    },
    {
      id: 4,
      title: t('blog.articles.article4.title'),
      excerpt: t('blog.articles.article4.excerpt'),
      content: t('blog.articles.article4.content'),
      author: 'Sahil Rzayev',
      date: '2024-02-01',
      category: 'tips',
      tags: ['Productivity', 'Tips', 'Motivation'],
      readTime: '6 dk',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
      featured: false
    }
  ];

  const article = articles.find(a => a.id === parseInt(id));

  // Yorumlar için local state
  const [comments, setComments] = useState([
    {
      name: 'Ahmet Yılmaz',
      text: 'Çok faydalı bir makale, ellerinize sağlık!',
      date: '2024-06-01T10:30:00',
    },
    {
      name: 'Zeynep Kaya',
      text: 'Kod örnekleri çok açıklayıcı olmuş, teşekkürler.',
      date: '2024-06-02T14:12:00',
    },
  ]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setCommentError('');
    setCommentSuccess('');
    if (!commentName.trim() || !commentText.trim()) {
      setCommentError('Lütfen adınızı ve yorumunuzu girin.');
      return;
    }
    const newComment = {
      name: commentName.trim(),
      text: commentText.trim(),
      date: new Date().toISOString(),
    };
    setComments([newComment, ...comments]);
    setCommentName('');
    setCommentText('');
    setCommentSuccess('Yorumunuz başarıyla eklendi!');
    setTimeout(() => setCommentSuccess(''), 2000);
  };

  const handleBack = () => {
    if (location.state && location.state.fromBlogList) {
      navigate('/blog');
    } else {
      navigate('/', { replace: false });
      setTimeout(() => {
        window.location.hash = '#blog';
      }, 100);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // API'den makale çekme (örnek makaleler yerine)
  const [apiArticle, setApiArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Eğer id varsa API'den makale çek
    if (id) {
      fetch(`http://localhost:5000/api/makaleler/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Makale bulunamadı');
          return res.json();
        })
        .then(data => {
          setApiArticle(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Makale bulunamadı.');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  // Eğer API'den makale geldiyse onu göster, yoksa örnek makaleyi göster
  const currentArticle = apiArticle || article;
  const lang = i18n.language;
  const baslik = lang === 'en' ? currentArticle.baslikEn || currentArticle.title : currentArticle.baslikTr || currentArticle.title;
  const icerik = lang === 'en' ? currentArticle.icerikEn || currentArticle.content : currentArticle.icerikTr || currentArticle.content;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = t('articleDetail.locale', { defaultValue: i18n.language });
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: currentArticle.title,
        text: currentArticle.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  // readTime'ı çeviriyle göstermek için yardımcı fonksiyon
  const getLocalizedReadTime = (readTime) => {
    // Örn: '8 dk' veya '12 dk' gibi
    const match = /^(\d+)\s*dk$/.exec(readTime);
    if (match) {
      const minutes = parseInt(match[1], 10);
      return t('articleDetail.readTime', { count: minutes });
    }
    return readTime;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-4">
        <motion.article
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto pt-24 md:pt-28"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-base ${
                isDarkMode 
                  ? 'bg-gray-800/70 text-gray-200 hover:bg-gray-700/80 hover:text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <FaArrowLeft size={16} />
              <span>{t('articleDetail.back')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareArticle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-base
                bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white`}
            >
              <FaShare size={16} />
              <span>{t('articleDetail.share')}</span>
            </motion.button>
          </div>

          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {baslik}
              </h1>
              
              <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentArticle.excerpt}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`flex flex-wrap items-center gap-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              <div className="flex items-center space-x-2">
                <FaUser size={14} />
                <span>{currentArticle.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendar size={14} />
                <span>{formatDate(currentArticle.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock size={14} />
                <span>{getLocalizedReadTime(currentArticle.readTime)}</span>
              </div>
              {currentArticle.featured && (
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {t('blog.featured')}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {Array.isArray(currentArticle.tags) && currentArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-8 rounded-lg overflow-hidden"
          >
            <img
              src={currentArticle.image && currentArticle.image.trim() !== '' ? currentArticle.image : emptyBlogImg}
              alt={currentArticle.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert prose-gray' : 'prose-gray'}`}
            dangerouslySetInnerHTML={{ __html: icerik }}
          />
        </motion.article>

        {/* Yorumlar Bölümü */}
        <section className="mt-20 mb-20 max-w-4xl mx-auto px-4 font-['Montserrat',sans-serif]">
          {/* Yorumlar Başlığı ve Negatif Boşluk */}
          <div className="flex items-center gap-2 mb-2">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight -mr-2 dark:text-white"
              style={{ color: isDarkMode ? undefined : '#1a2233', letterSpacing: '-0.04em' }}
            >
              {t('articleDetail.comments.title')}
            </h2>
            <span
              className="text-4xl md:text-5xl font-extrabold select-none"
              style={{ color: isDarkMode ? '#fff' : '#1e293b', marginLeft: '-0.2em' }}
            >
              .
            </span>
          </div>
          <div className="h-1 w-14 bg-gradient-to-r from-[#1e293b] to-[#3b82f6] rounded mb-10"></div>
          {/* Yorum Ekleme Formu */}
          <form onSubmit={handleCommentSubmit} className="mb-14 p-8 rounded-3xl shadow-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 max-w-2xl flex flex-col gap-8 mx-auto">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder={t('articleDetail.form.namePlaceholder')}
                value={commentName}
                onChange={e => setCommentName(e.target.value)}
                className="px-5 py-3 min-h-[48px] rounded-xl border border-gray-300 bg-gray-100 text-[#1e293b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] text-base shadow-sm font-medium transition"
                maxLength={32}
                style={{fontFamily: 'Montserrat, sans-serif'}}
              />
              <textarea
                placeholder={t('articleDetail.form.commentPlaceholder')}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="px-5 py-3 min-h-[48px] rounded-xl border border-gray-300 bg-gray-100 text-[#1e293b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] text-base shadow-sm font-medium transition"
                maxLength={300}
                style={{fontFamily: 'Montserrat, sans-serif'}}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#1e293b] to-[#3b82f6] text-white font-semibold hover:from-[#0f172a] hover:to-[#2563eb] transition-colors text-base shadow-md font-['Montserrat',sans-serif]"
                style={{boxShadow: '0 4px 24px 0 rgba(30,41,59,0.08)'}}
              >
                {t('articleDetail.form.submit')}
              </button>
            </div>
            {commentError && <div className="text-red-500 text-sm mt-1 font-medium">{t(commentError)}</div>}
            {commentSuccess && <div className="text-green-600 text-sm mt-1 font-medium">{t(commentSuccess)}</div>}
          </form>
          {/* Kahve Destek Alanı */}
          <div className="relative max-w-2xl mx-auto mb-10">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3b82f6] via-[#6366f1] to-[#f472b6] blur-[18px] opacity-60"></div>
            <div className="relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-white border border-gray-200 shadow-xl">
              <div className="flex items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
                  <ellipse cx="12" cy="19" rx="7" ry="2" fill="#cbd5e1"/>
                  <rect x="4" y="5" width="16" height="10" rx="5" fill="#fff" stroke="#3b82f6" strokeWidth="1.5"/>
                  <path d="M17 19a5 5 0 0 1-10 0" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M19 10c1.657 0 3 1.343 3 3s-1.343 3-3 3" stroke="#f59e42" strokeWidth="1.5"/>
                  <ellipse cx="12" cy="9" rx="2.5" ry="1.2" fill="#f59e42" opacity=".7"/>
                </svg>
                <span className="text-lg md:text-xl font-semibold text-[#1e293b] font-['Montserrat',sans-serif]">{t('articleDetail.coffee.text')}</span>
              </div>
              <a
                href="https://www.buymeacoffee.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#3b82f6] to-[#f59e42] text-white font-semibold font-['Montserrat',sans-serif] shadow-lg hover:from-[#6366f1] hover:to-[#f59e42] transition-colors text-base"
                style={{boxShadow: '0 4px 24px 0 rgba(99,102,241,0.12)'}}
              >
                {t('articleDetail.coffee.button')}
              </a>
            </div>
          </div>
          {/* Yorum Listesi */}
          <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            {comments.length === 0 && (
              <div className="text-gray-400 text-base font-medium">{t('articleDetail.comments.noComments')}</div>
            )}
            {comments.map((c, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-2xl shadow-md bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#1e293b] to-[#3b82f6] flex items-center justify-center font-bold text-white text-lg shadow font-['Montserrat',sans-serif]">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-[#1e293b] text-base font-['Montserrat',sans-serif]">{c.name}</span>
                    <span className="text-xs text-gray-400 font-medium">{new Date(c.date).toLocaleString(t('articleDetail.locale'), { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <div className="text-[#1e293b] whitespace-pre-line text-base leading-relaxed font-medium font-['Montserrat',sans-serif]">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sticky Kahve Butonu */}
        <a
          href="https://www.buymeacoffee.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-40 bottom-6 right-6 md:bottom-10 md:right-10 px-5 py-3 rounded-full bg-gradient-to-r from-[#1e293b] to-[#3b82f6] text-white font-semibold font-['Montserrat',sans-serif] shadow-lg hover:from-[#0f172a] hover:to-[#2563eb] transition-colors text-base flex items-center gap-2 md:text-lg md:px-7 md:py-4"
          style={{boxShadow: '0 4px 24px 0 rgba(30,41,59,0.12)'}}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#3b82f6] mr-1"><path d="M17 19a5 5 0 0 1-10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="3" y="5" width="18" height="10" rx="5" stroke="currentColor" strokeWidth="1.5"/><path d="M19 10c1.657 0 3 1.343 3 3s-1.343 3-3 3" stroke="currentColor" strokeWidth="1.5"/></svg>
          <span className="hidden sm:inline">{t('articleDetail.coffee.button')}</span>
          <span className="sm:hidden">☕</span>
        </a>
      </div>
    </div>
  );
};

export default ArticleDetail;