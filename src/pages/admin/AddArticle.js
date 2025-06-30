import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AddArticle.css';
import Quill from 'quill';
import axios from 'axios';
import * as cheerio from 'cheerio';

const API_URL = 'http://localhost:5000/api/makaleler';

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
  const quillRef = useRef();

  useEffect(() => {
    if (window.Quill) {
      const icons = window.Quill.import('ui/icons');
      icons['removeImage'] = '<span style="font-size:18px;">&times;</span>';
    }
  }, []);

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
      autoIcerikEn = await translateHtmlContent(icerikTr);
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
        if (quillRef.current) {
          quillRef.current.getEditor().setContents([]);
        }
      } else {
        setError(t('addArticle.errors.general'));
      }
    } catch (err) {
      setError(t('addArticle.errors.server'));
    }
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
  }, [icerikTr]);

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
          ref={quillRef}
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
          className={`btn btn-primary mt-4 ${translating ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={translating}
        >
          {t('addArticle.button')}
        </button>
        {translating && (
          <div className="text-blue-500 text-center mt-2">
            {t('addArticle.translating')}
          </div>
        )}
        {success && <div className="text-green-500 text-center mt-2">{success}</div>}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default AddArticle; 