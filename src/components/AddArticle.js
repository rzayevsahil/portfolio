import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AddArticle.css';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api/makaleler';

// Otomatik başlık çevirisi için fonksiyon
const translateToEnglish = async (text) => {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|en`
  );
  const data = await res.json();
  console.log('Çeviri API yanıtı:', data);
  if (!data.responseData || !data.responseData.translatedText) throw new Error('Çeviri başarısız');
  return data.responseData.translatedText;
};

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'], // image butonu burada!
    ['clean']
  ]
};

const AddArticle = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useTheme();
  const [baslikTr, setBaslikTr] = useState('');
  const [baslikEn, setBaslikEn] = useState('');
  const [icerikTr, setIcerikTr] = useState('');
  const [icerikEn, setIcerikEn] = useState('');
  const [yazar, setYazar] = useState('');
  const [image, setImage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [translating, setTranslating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!baslikTr || !icerikTr || !yazar || !image) {
      setError(t('addArticle.errors.fillAll'));
      return;
    }

    setTranslating(true);
    let autoBaslikEn = '';
    let autoIcerikEn = '';
    try {
      autoBaslikEn = await translateToEnglish(baslikTr);
      autoIcerikEn = await translateToEnglish(icerikTr.replace(/<[^>]+>/g, ' ')); // HTML etiketlerini kaldırarak çevir
    } catch {
      setError('Başlık veya içerik çevirisi başarısız oldu.');
      setTranslating(false);
      return;
    }
    setTranslating(false);

    const makale = {
      baslikTr,
      baslikEn: autoBaslikEn,
      icerikTr,
      icerikEn: autoIcerikEn,
      yazar,
      image,
      tarih: new Date().toISOString()
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(makale)
      });

      if (response.ok) {
        setSuccess(t('addArticle.success'));
        setBaslikTr(''); setBaslikEn(''); setIcerikTr(''); setIcerikEn(''); setYazar(''); setImage('');
      } else {
        setError(t('addArticle.errors.general'));
      }
    } catch (err) {
      setError(t('addArticle.errors.server'));
    }
  };

  return (
    <div className={`max-w-xl mx-auto mt-12 p-8 rounded-xl shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('addArticle.title')}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder={t('addArticle.placeholders.title')}
          value={baslikTr}
          onChange={e => setBaslikTr(e.target.value)}
          className={`border rounded-lg px-4 py-2 ${isDarkMode ? 'text-white bg-gray-900/80 placeholder-gray-400' : 'text-gray-900 bg-white placeholder-gray-500'}`}
        />
        <ReactQuill
          key={i18n.language}
          value={icerikTr}
          onChange={setIcerikTr}
          placeholder={t('addArticle.placeholders.content')}
          className={`${isDarkMode ? 'bg-gray-900/80 text-white' : 'bg-white text-gray-900'} rounded-lg`}
          theme="snow"
          modules={quillModules}
        />
        <input
          type="text"
          placeholder={t('addArticle.placeholders.author')}
          value={yazar}
          onChange={e => setYazar(e.target.value)}
          className={`border rounded-lg px-4 py-2 ${isDarkMode ? 'text-white bg-gray-900/80 placeholder-gray-400' : 'text-gray-900 bg-white placeholder-gray-500'}`}
        />
        <input
          type="text"
          placeholder={t('addArticle.placeholders.image')}
          value={image}
          onChange={e => setImage(e.target.value)}
          className={`border rounded-lg px-4 py-2 ${isDarkMode ? 'text-white bg-gray-900/80 placeholder-gray-400' : 'text-gray-900 bg-white placeholder-gray-500'}`}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={translating}
        >
          {translating ? t('addArticle.translating') : t('addArticle.button')}
        </button>
        {success && <div className="text-green-600 text-center">{success}</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default AddArticle; 