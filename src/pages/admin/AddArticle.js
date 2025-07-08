import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AddArticle.css';
import Quill from 'quill';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { articleApi, uploadApi, BASE_URL, FILE_BASE_URL } from '../../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLink, FaUpload, FaImage } from 'react-icons/fa';


const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
      ['removeImage']
    ],
    handlers: {
      removeImage: function() {
        const quill = this.quill;
        const range = quill.getSelection();
        if (range) {
          const [blot] = quill.getLeaf(range.index);
          if (blot && blot.domNode && blot.domNode.tagName === 'IMG') {
            blot.domNode.remove();
          }
        }
      }
    }
  }
};


const AddArticle = () => {
  const location = useLocation();
  const editingArticle = location.state?.article;
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useTheme();
  const [titleTr, setTitleTr] = useState(editingArticle?.titleTr || '');
  const [titleEn, setTitleEn] = useState(editingArticle?.titleEn || '');
  const [contentTr, setContentTr] = useState(editingArticle?.contentTr || '');
  const [contentEn, setContentEn] = useState(editingArticle?.contentEn || '');
  const [author, setAuthor] = useState(editingArticle?.author || '');
  const [image, setImage] = useState(editingArticle?.image || '');
  const [type, setType] = useState(editingArticle?.type || editingArticle?.Type || 'classic');
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [translating, setTranslating] = useState(false);
  const quillRef = useRef();
  const fileInputRef = useRef();
  const [form, setForm] = useState({
    title: editingArticle?.titleTr || '',
    content: editingArticle?.contentTr || ''
  });
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [authorError, setAuthorError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Quill) {
      const icons = window.Quill.import('ui/icons');
      icons['removeImage'] = '<span style="font-size:18px;">&times;</span>';
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTranslating(true);
    setError('');
    setSuccess(false);
    setTitleError(false);
    setContentError(false);
    setAuthorError(false);
    let imageUrl = image;
    if (imageMode === 'file' && selectedFile) {
      try {
        const data = await uploadApi.uploadImage(selectedFile);
        imageUrl = data.url;
      } catch (err) {
        setError('Resim yüklenemedi.');
        setLoading(false);
        setTranslating(false);
        return;
      }
    }
    if (!form.title.trim()) {
      setError(t('addArticle.errors.title'));
      setTitleError(true);
      setLoading(false);
      setTranslating(false);
      return;
    }
    if (!form.content || form.content === '<p><br></p>' || !form.content.trim()) {
      setError(t('addArticle.errors.content'));
      setContentError(true);
      setLoading(false);
      setTranslating(false);
      return;
    }
    if (!author.trim()) {
      setError(t('addArticle.errors.author'));
      setAuthorError(true);
      setLoading(false);
      setTranslating(false);
      return;
    }
    let titleEn = form.title;
    let contentEn = form.content;
    try {
      titleEn = await translateToEnglish(form.title);
      contentEn = await translateHtmlContent(form.content);
    } catch (err) {
      // Çeviri başarısızsa Türkçesini kullan
      titleEn = form.title;
      contentEn = form.content;
    }
    setTranslating(false);
    const articleData = {
      Id: editingArticle?.id || editingArticle?.Id,
      TitleTr: form.title,
      TitleEn: titleEn,
      ContentTr: form.content,
      ContentEn: contentEn,
      Author: author,
      Date: editingArticle ? editingArticle.date : getLocalIsoString(),
      Image: imageUrl,
      Status: true,
      IsPublished: editingArticle ? editingArticle.isPublished : false,
      Type: editingArticle ? (editingArticle.type || editingArticle.Type || 'classic') : 'classic',
      Slug: ''
    };
    try {
      if (editingArticle) {
        await articleApi.update(editingArticle.id, articleData);
        setSuccess('Makale başarıyla güncellendi!');
      } else {
        await articleApi.add(articleData);
        setSuccess(t('addArticle.success'));
        setForm({ title: '', content: '' });
        setAuthor('');
        setImage('');
        setSelectedFile(null);
      }
      setTimeout(() => navigate('/admin/blog-management', { replace: true }), 1000);
    } catch {
      setError('Makale kaydedilemedi.');
      setTranslating(false);
    }
    setLoading(false);
  };

  const translateToEnglish = async (text) => {
    console.log(text);
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|en`
    );
    const data = await res.json();
    console.log('Çeviri API yanıtı:', data);
    if (!data.responseData || !data.responseData.translatedText) throw new Error('Çeviri başarısız');
    return data.responseData.translatedText;
  };

  async function translateHtmlContent(html) {
    const $ = cheerio.load(html);
    const textNodes = [];
    $('*').contents().each(function () {
      if (this.type === 'text' && this.data.trim()) {
        textNodes.push(this);
      }
    });

    for (const node of textNodes) {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(node.data)}&langpair=tr|en`;
      const res = await axios.get(url);
      node.data = res.data.responseData.translatedText;
    }

    return $('body').html();
  }

  useEffect(() => {
    const quill = quillRef.current && quillRef.current.getEditor && quillRef.current.getEditor();
    if (!quill) return;

    // Tüm img'leri bul ve overlay ekle
    const editor = quill.root;
    editor.querySelectorAll('img').forEach(img => {
      // Zaten eklenmişse tekrar ekleme
      if (img.parentElement.classList.contains('quill-image-wrapper')) return;

      // Wrapper oluştur
      const wrapper = document.createElement('span');
      wrapper.className = 'quill-image-wrapper';
      img.parentElement.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      // Çarpı butonu ekle
      const delBtn = document.createElement('button');
      delBtn.className = 'quill-image-delete';
      delBtn.innerHTML = '&times;';
      delBtn.onclick = (e) => {
        e.preventDefault();
        wrapper.remove();
      };
      wrapper.appendChild(delBtn);
      // Wrapper'ı relative yap
      wrapper.style.position = 'relative';
    });
  }, [contentTr]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Component unmount olduğunda URL'leri temizle
  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
    };
  }, [selectedFile]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }
      setError('');
      // Önceki dosya URL'sini temizle
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
      setSelectedFile(file);
      // Artık burada upload yok, sadece dosya state'e alınıyor
    }
  };

  const handleImageModeChange = (mode) => {
    setImageMode(mode);
    setImage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // URL.createObjectURL ile oluşturulan URL'leri temizle
    if (selectedFile) {
      URL.revokeObjectURL(URL.createObjectURL(selectedFile));
    }
  };

  // Local saatle ISO 8601 formatında string üretir
  function getLocalIsoString() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' +
      pad(d.getMonth() + 1) + '-' +
      pad(d.getDate()) + 'T' +
      pad(d.getHours()) + ':' +
      pad(d.getMinutes()) + ':' +
      pad(d.getSeconds());
  }

  return (
    <div className={`w-full mt-12 p-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <button
        onClick={() => navigate('/admin/blog-management')}
        className="mb-6 btn btn-primary"
      >
        ← Geri Dön
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('addArticle.title')}</h2>
      {/* Alert Messages */}
      {error && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-red-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-green-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {success}
        </div>
      )}
      {translating && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-blue-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {t('addArticle.translating')}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder={t('addArticle.placeholders.title')}
          value={form.title}
          onChange={e => {
            handleChange(e);
            if (error && titleError) {
              setError('');
              setTitleError(false);
            }
          }}
          name="title"
          className={`border rounded-lg px-4 py-2 transition-colors duration-200 ${titleError ? 'border-red-500 ring-2 ring-red-300' : ''} ${isDarkMode ? 'text-white bg-gray-900/80 placeholder-gray-400' : 'text-gray-900 bg-white placeholder-gray-500'}`}
        />
        <ReactQuill
          ref={quillRef}
          key={i18n.language}
          value={form.content}
          onChange={val => {
            setContentTr(val);
            setForm(f => ({ ...f, content: val }));
            if (error && contentError) {
              setError('');
              setContentError(false);
            }
          }}
          placeholder={t('addArticle.placeholders.content')}
          className={`${isDarkMode ? 'bg-gray-900/80 text-white' : 'bg-white text-gray-900'} rounded-lg transition-colors duration-200 ${contentError ? 'border-2 border-red-500 ring-2 ring-red-300' : ''}`}
          theme="snow"
          modules={quillModules}
        />
        <input
          type="text"
          placeholder={t('addArticle.placeholders.author')}
          value={author}
          onChange={e => {
            setAuthor(e.target.value);
            if (error && authorError) {
              setError('');
              setAuthorError(false);
            }
          }}
          className={`border rounded-lg px-4 py-2 transition-colors duration-200 ${authorError ? 'border-red-500 ring-2 ring-red-300' : ''} ${isDarkMode ? 'text-white bg-gray-900/80 placeholder-gray-400' : 'text-gray-900 bg-white placeholder-gray-500'}`}
        />
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => handleImageModeChange('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              imageMode === 'url' 
                ? 'bg-blue-500 text-white border-blue-500' 
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`
            }`}
          >
            <FaLink size={14} />
            {t('addArticle.imageMode.url') || 'URL'}
          </button>
          <button
            type="button"
            onClick={() => handleImageModeChange('file')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              imageMode === 'file' 
                ? 'bg-blue-500 text-white border-blue-500' 
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`
            }`}
          >
            <FaUpload size={14} />
            {t('addArticle.imageMode.file') || 'Dosya Yükle'}
          </button>
        </div>
        
        {imageMode === 'url' && (
          <input
            type="text"
            placeholder={t('addArticle.placeholders.image')}
            value={image}
            onChange={e => setImage(e.target.value)}
            className={`border rounded-lg px-4 py-2 transition-colors duration-200 ${isDarkMode ? 'text-white bg-gray-900/80 placeholder-gray-400' : 'text-gray-900 bg-white placeholder-gray-500'}`}
          />
        )}
        
        {imageMode === 'file' && (
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className={`border rounded-lg px-4 py-2 w-full transition-colors duration-200 ${isDarkMode ? 'text-white bg-gray-900/80 placeholder-gray-400' : 'text-gray-900 bg-white placeholder-gray-500'}`}
            />
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FaImage className="text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  {selectedFile.name} seçildi
                </span>
              </div>
            )}
          </div>
        )}
        {/* Resim önizleme */}
        {(image || selectedFile) && (
          <div className="flex items-center mt-2 gap-2">
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : image.startsWith('http')
                    ? image
                    : `${FILE_BASE_URL}${image.startsWith('/') ? image : '/' + image}`
              }
              alt="Önizleme"
              className="max-h-32 rounded shadow border"
              style={{ maxWidth: 200, objectFit: 'contain' }}
            />
            {selectedFile && (
              <button
                type="button"
                onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ml-2
                  ${isDarkMode
                    ? 'bg-red-700/20 text-red-300 hover:bg-red-700 hover:text-white'
                    : 'bg-red-100 text-red-600 hover:bg-red-500 hover:text-white'}
                `}
              >Kaldır</button>
            )}
            {imageMode === 'url' && image && (
              <button
                type="button"
                onClick={() => setImage('')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ml-2
                  ${isDarkMode
                    ? 'bg-red-700/20 text-red-300 hover:bg-red-700 hover:text-white'
                    : 'bg-red-100 text-red-600 hover:bg-red-500 hover:text-white'}
                `}
              >Kaldır</button>
            )}
          </div>
        )}
        <button
          type="submit"
          className={`btn btn-primary mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {t('addArticle.button')}
        </button>
      </form>
    </div>
  );
};

export default AddArticle;