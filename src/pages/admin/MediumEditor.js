import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTimes, FaImage, FaRegSquare, FaVideo, FaCode, FaQuoteRight, FaEllipsisH, FaLink, FaHeading, FaRegCommentDots } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { articleApi } from '../../api/api';
import { uploadApi } from '../../api/api';
import { useNavigate } from 'react-router-dom';


function BlockMenu({ onClose, onAction, ...props }) {
  const { isDarkMode } = useTheme();
  return (
    <div
      className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-2 shadow-lg absolute left-[-60px] z-50"
      {...props}
    >
      <button
        onClick={onClose}
        className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-xl ${isDarkMode ? 'text-gray-900' : ''}`}
      >
        <FaTimes />
      </button>
      <button onClick={() => onAction('image')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaImage /></button>
      <button onClick={() => onAction('embed')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaRegSquare /></button>
      <button onClick={() => onAction('video')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaVideo /></button>
      <button onClick={() => onAction('code')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaCode /></button>
      <button onClick={() => onAction('quote')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaQuoteRight /></button>
      <button onClick={() => onAction('more')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaEllipsisH /></button>
    </div>
  );
}

function FloatingToolbar({ x, y, onBold, onItalic, onLink, onHeading, onQuote, onNote, visible, activeStyles }) {
  if (!visible) return null;
  const activeColor = '#8ddc97';
  return (
    <div
      style={{
        position: 'fixed',
        top: y - 48,
        left: x,
        zIndex: 1000,
        background: '#222',
        color: 'white',
        borderRadius: 8,
        padding: '8px 16px',
        display: 'flex',
        gap: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        alignItems: 'center'
      }}
    >
      <button onMouseDown={e => { e.preventDefault(); onBold(); }} title="Kalın" style={{ fontWeight: 'bold', color: activeStyles.bold ? activeColor : 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}><b>B</b></button>
      <button onMouseDown={e => { e.preventDefault(); onItalic(); }} title="İtalik" style={{ fontStyle: 'italic', color: activeStyles.italic ? activeColor : 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}><i>i</i></button>
      <button onMouseDown={e => { e.preventDefault(); onLink(); }} title="Bağlantı" style={{ color: activeStyles.link ? activeColor : 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}><FaLink /></button>
      <span style={{ color: '#444', margin: '0 6px' }}>|</span>
      <button onMouseDown={e => { e.preventDefault(); onHeading(); }} title="Başlık" style={{ color: activeStyles.heading ? activeColor : 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}><FaHeading /></button>
      <button onMouseDown={e => { e.preventDefault(); onQuote(); }} title="Alıntı" style={{ color: activeStyles.quote ? activeColor : 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}><FaQuoteRight /></button>
      <span style={{ color: '#444', margin: '0 6px' }}>|</span>
      <button onMouseDown={e => { e.preventDefault(); onNote(); }} title="Not" style={{ color: activeStyles.note ? activeColor : 'white', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}><FaRegCommentDots /></button>
    </div>
  );
}

// Tooltip component
function LinkTooltip({ x, y, href, visible }) {
  if (!visible) return null;
  const maxLen = 100;
  const displayHref = href && href.length > maxLen
    ? href.slice(0, maxLen) + '...'
    : href;
  return (
    <div
      style={{
        position: 'fixed',
        top: y + 30,
        left: x,
        transform: 'translateX(-50%)',
        zIndex: 2000,
        background: '#222',
        color: 'white',
        borderRadius: 8,
        padding: '12px 18px',
        fontSize: 13,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        maxWidth: 350,
        textAlign: 'center',
        pointerEvents: 'none',
        whiteSpace: 'pre-line',
      }}
      title={href}
    >
      {displayHref}
    </div>
  );
}

// Blokları HTML'e dönüştüren fonksiyon
function blocksToHtml(blocks) {
  return blocks.map(block => {
    if (block.type === 'text') return `<div>${block.value}</div>`;
    if (block.type === 'image') return `<img src="${block.src}" alt="" />`;
    if (block.type === 'video') return `<video src="${block.src}" controls />`;
    if (block.type === 'embed') return `<iframe src="${block.src}" frameborder="0" allowfullscreen style="aspect-ratio:16/9;width:100%;max-width:800px;min-height:350px;display:block;margin:0 auto;border-radius:12px;"></iframe>`;
    if (block.type === 'code') return `<pre><code>${block.value}</code></pre>`;
    if (block.type === 'quote') return `<blockquote>${block.value}</blockquote>`;
    return '';
  }).join('');
}

// Benzersiz id üretici
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now();
}

// Otomatik çeviri fonksiyonu
const translateToEnglish = async (text) => {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|en`);
  const data = await res.json();
  if (!data.responseData || !data.responseData.translatedText) throw new Error('Çeviri başarısız');
  return data.responseData.translatedText;
};

// HTML içeriğini tag yapısını bozmadan çeviren fonksiyon
async function translateHtmlContent(html) {
  // DOMParser ile parse et
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html');
  // Tüm text node'ları bul
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim()) textNodes.push(node);
  }
  // Her bir text node'u çevir
  for (const n of textNodes) {
    try {
      const translated = await translateToEnglish(n.nodeValue);
      n.nodeValue = translated;
    } catch {
      // hata olursa orijinal kalsın
    }
  }
  return doc.body.innerHTML;
}

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

export default function MediumEditor() {
  const { t, i18n } = useTranslation();
  const [blocks, setBlocks] = useState([{ type: 'text', value: '', id: generateId() }]);
  const inputRefs = useRef([]);
  const [menuIdx, setMenuIdx] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [isMenuMouseDown, setIsMenuMouseDown] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [toolbar, setToolbar] = useState({ visible: false, x: 0, y: 0, blockIdx: null });
  const [linkTooltip, setLinkTooltip] = useState({ visible: false, x: 0, y: 0, href: '' });
  const [activeStyles, setActiveStyles] = useState({ bold: false, italic: false, link: false, heading: false, quote: false, note: false });
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notif, setNotif] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const [titleError, setTitleError] = useState(false);
  const [authorError, setAuthorError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [baslikTr, setBaslikTr] = useState('');
  const navigate = useNavigate();
  const [selectedFileName, setSelectedFileName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const handleDeleteOrEnter = (e) => {
      if (selectedIdx !== null) {
        const block = blocks[selectedIdx];
        // Silme (görsel, video, embed, kod, alıntı blokları)
        if ((e.key === "Delete" || e.key === "Backspace") && (block.type === "image" || block.type === "video" || block.type === "embed" || block.type === "code" || block.type === "quote")) {
          e.preventDefault();
          let newBlocks = blocks.filter((_, idx) => idx !== selectedIdx);
          if (newBlocks.length === 0) {
            newBlocks.push({ type: 'text', value: '', id: generateId() });
          }
          setBlocks(newBlocks);
          setSelectedIdx(null);
        }
        // Enter ile altına yeni blok ekleme
        if (e.key === "Enter" && (block.type === "image" || block.type === "video" || block.type === "embed")) {
          e.preventDefault();
          const newBlocks = [...blocks];
          newBlocks.splice(selectedIdx + 1, 0, { type: 'text', value: '', id: generateId() });
          setBlocks(newBlocks);
          setSelectedIdx(selectedIdx + 1);
          setTimeout(() => {
            inputRefs.current[selectedIdx + 1]?.focus();
          }, 0);
        }
      }
    };
    window.addEventListener("keydown", handleDeleteOrEnter);
    return () => window.removeEventListener("keydown", handleDeleteOrEnter);
  }, [selectedIdx, blocks]);

  useEffect(() => {
    // Sadece bu component'e özel stil ekle
    const style = document.createElement('style');
    style.innerHTML = `
      .richtext-block a {
        text-decoration: underline !important;
        color: #222 !important;
      }
      .dark .richtext-block a {
        color: #3b82f6  !important;
      }
      .richtext-block blockquote {
        border-left: 8px solid #8ddc97;
        background: #f8fafc;
        color: #444;
        font-style: italic;
        padding: 16px 24px;
        margin: 24px 0;
        border-radius: 8px;
        font-size: 1.1em;
      }
      .richtext-block h1, .richtext-block h2, .richtext-block h3 {
        font-weight: bold;
        font-size: 2rem;
        margin: 24px 0 12px 0;
        line-height: 1.2;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleChange = (i, value, e) => {
    const newBlocks = [...blocks];
    newBlocks[i] = { ...newBlocks[i], value };
    setBlocks(newBlocks);
    if (e && e.target) {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
  };

  const handleKeyDown = (e, i) => {
    const isBlockEmpty = !blocks[i].value || blocks[i].value === '<br>' || blocks[i].value.trim() === '';
    if (selectedIdx === i && e.key === 'Enter') {
      e.preventDefault();
      const newBlocks = [...blocks];
      newBlocks.splice(i + 1, 0, { type: 'text', value: '', id: generateId() });
      setBlocks(newBlocks);
      setSelectedIdx(null);
      setTimeout(() => {
        inputRefs.current[i + 1]?.focus();
      }, 0);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const newBlocks = [...blocks];
      newBlocks.splice(i + 1, 0, { type: 'text', value: '', id: generateId() });
      setBlocks(newBlocks);
      setTimeout(() => {
        inputRefs.current[i + 1]?.focus();
      }, 0);
    }
    if (
      e.key === 'Backspace' &&
      blocks[i].type === 'text' &&
      isBlockEmpty &&
      blocks.length > 1
    ) {
      e.preventDefault();
      const newBlocks = blocks.filter((_, idx) => idx !== i);
      setBlocks(newBlocks);
      setFocusedIdx(i > 0 ? i - 1 : 0);
      setTimeout(() => {
        const el = inputRefs.current[i > 0 ? i - 1 : 0];
        if (el) {
          el.focus();
          // Caret'i sona taşı
          const range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false); // false = sona
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 0);
      return;
    }
  };

  const handleMenuAction = (action) => {
    if (menuIdx === null) return;
    const newBlocks = [...blocks];
    if (action === 'image') {
      const url = prompt('Resim URL girin:');
      if (url) newBlocks[menuIdx] = { type: 'image', src: url };
    } else if (action === 'video') {
      const url = prompt('Video URL girin:');
      if (url) {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          let videoId = '';
          if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
          } else {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
          }
          if (videoId) {
            newBlocks[menuIdx] = { type: 'embed', src: `https://www.youtube.com/embed/${videoId}` };
          }
        } else {
          newBlocks[menuIdx] = { type: 'video', src: url };
        }
      }
    } else if (action === 'code') {
      newBlocks[menuIdx] = { type: 'code', value: '' };
    } else if (action === 'quote') {
      newBlocks[menuIdx] = { type: 'quote', value: '' };
    } else if (action === 'embed') {
      const url = prompt('Embed (iframe) URL girin:');
      if (url) newBlocks[menuIdx] = { type: 'embed', src: url };
    } else if (action === 'more') {
      alert('Diğer blok türleri yakında!');
    }
    setBlocks(newBlocks);
    setMenuIdx(null);
  };

  // contentEditable seçim algılama
  const handleSelection = (i) => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setToolbar(t => ({ ...t, visible: false }));
      setActiveStyles({ bold: false, italic: false, link: false, heading: false, quote: false, note: false });
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setToolbar({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      blockIdx: i
    });
    // Ortak stilleri bul
    const stylesList = [];
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          const nodeRange = document.createRange();
          nodeRange.selectNodeContents(node);
          return (range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0 &&
                  range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );
    let node;
    while ((node = walker.nextNode())) {
      let cur = node.parentNode;
      let styles = { bold: false, italic: false, link: false, heading: false, quote: false, note: false };
      while (cur && cur !== document.body) {
        const tag = cur.tagName ? cur.tagName.toLowerCase() : '';
        if (tag === 'b' || tag === 'strong') styles.bold = true;
        if (tag === 'i' || tag === 'em') styles.italic = true;
        if (tag === 'a') styles.link = true;
        if (tag === 'h1' || tag === 'h2' || tag === 'h3') styles.heading = true;
        if (tag === 'blockquote') styles.quote = true;
        if (cur.style && cur.style.backgroundColor === 'rgb(255, 249, 196)') styles.note = true;
        cur = cur.parentNode;
      }
      stylesList.push(styles);
    }
    // Eğer hiç text node yoksa, anchorNode'un parent'ına bak
    if (stylesList.length === 0) {
      let cur = sel.anchorNode;
      if (cur && cur.nodeType === 3) cur = cur.parentNode;
      let styles = { bold: false, italic: false, link: false, heading: false, quote: false, note: false };
      while (cur && cur !== document.body) {
        const tag = cur.tagName ? cur.tagName.toLowerCase() : '';
        if (tag === 'b' || tag === 'strong') styles.bold = true;
        if (tag === 'i' || tag === 'em') styles.italic = true;
        if (tag === 'a') styles.link = true;
        if (tag === 'h1' || tag === 'h2' || tag === 'h3') styles.heading = true;
        if (tag === 'blockquote') styles.quote = true;
        if (cur.style && cur.style.backgroundColor === 'rgb(255, 249, 196)') styles.note = true;
        cur = cur.parentNode;
      }
      stylesList.push(styles);
    }
    function allTrue(key) {
      return stylesList.length > 0 && stylesList.every(s => s[key]);
    }
    setActiveStyles({
      bold: allTrue('bold'),
      italic: allTrue('italic'),
      link: allTrue('link'),
      heading: allTrue('heading'),
      quote: allTrue('quote'),
      note: allTrue('note')
    });
  };

  // Toolbar işlemleri
  const handleToolbarAction = (type) => {
    if (toolbar.blockIdx == null) return;
    const i = toolbar.blockIdx;
    const el = inputRefs.current[i];
    el.focus();
    if (type === 'bold') {
      document.execCommand('bold');
    } else if (type === 'italic') {
      document.execCommand('italic');
    } else if (type === 'link') {
      let url = prompt('Bağlantı (URL) girin:');
      if (url) document.execCommand('createLink', false, url);
    } else if (type === 'heading') {
      // Toggle heading: Eğer zaten heading ise, paragraf yap
      const sel = window.getSelection();
      let isHeading = false;
      if (sel && sel.anchorNode) {
        let node = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentNode : sel.anchorNode;
        while (node && node !== el) {
          if (['H1', 'H2', 'H3'].includes(node.nodeName)) {
            isHeading = true;
            break;
          }
          node = node.parentNode;
        }
      }
      if (isHeading) {
        document.execCommand('formatBlock', false, 'div');
      } else {
        document.execCommand('formatBlock', false, 'h2');
      }
    } else if (type === 'quote') {
      // Toggle quote: Eğer zaten blockquote ise, paragraf yap
      const sel = window.getSelection();
      let isQuote = false;
      if (sel && sel.anchorNode) {
        let node = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentNode : sel.anchorNode;
        while (node && node !== el) {
          if (node.nodeName === 'BLOCKQUOTE') {
            isQuote = true;
            break;
          }
          node = node.parentNode;
        }
      }
      if (isQuote) {
        document.execCommand('formatBlock', false, 'div');
      } else {
        document.execCommand('formatBlock', false, 'blockquote');
      }
    } else if (type === 'note') {
      document.execCommand('backColor', false, '#fff9c4');
    }
    // Güncel html'i kaydet
    handleChange(i, el.innerHTML);
    // Eğer selection collapsed ise ve caret bir stil node'unun içindeyse, caret'i dışına taşı
    const sel = window.getSelection();
    if (sel && sel.isCollapsed) {
      let node = sel.anchorNode;
      let parent = node && node.parentNode;
      if (parent && ['B', 'STRONG', 'I', 'EM', 'H1', 'H2', 'H3', 'BLOCKQUOTE'].includes(parent.nodeName)) {
        const range = document.createRange();
        range.setStartAfter(parent);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    setTimeout(() => {
      handleSelection(toolbar.blockIdx);
    }, 0);
  };

  const showNotif = (message, type = 'error') => {
    setNotif({ message, type });
    setTimeout(() => setNotif({ message: '', type: '' }), 2500);
  };

  const handleSave = async () => {
    const baslikTr = document.querySelector('input[placeholder="' + t('addArticle.placeholders.title') + '"]')?.value || '';
    const yazar = author || '';
    let image = imageUrl || '';
    const icerikTr = blocksToHtml(blocks);
    const tarih = getLocalIsoString();
    console.log(icerikTr);
    // İçeriğin gerçekten boş olup olmadığını kontrol et
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = icerikTr;
    const plainContent = tempDiv.textContent || tempDiv.innerText || '';
    // Zorunlu alan kontrolü
    if (!baslikTr.trim()) {
      setTitleError(true);
      showNotif(t('addArticle.errors.title'), 'error');
      return;
    }
    if (!yazar.trim()) {
      setAuthorError(true);
      showNotif(t('addArticle.errors.author'), 'error');
      return;
    }
    if (!plainContent.trim()) {
      setContentError(true);
      showNotif(t('addArticle.errors.content'), 'error');
      return;
    }
    const hasContent = blocks.some(block => {
      if (block.type === 'text' || block.type === 'quote' || block.type === 'code') {
        return block.value && block.value.replace(/<br\s*\/?>(\s*)?/g, '').trim() !== '';
      }
      if (block.type === 'image' || block.type === 'video' || block.type === 'embed') {
        return !!block.src;
      }
      return false;
    });
    if (!hasContent) {
      showNotif(t('addArticle.errors.fillAll'), 'error');
      return;
    }
    setLoading(true);
    let baslikEn = baslikTr;
    let icerikEn = icerikTr;
    try {
      // Sadece Türkçe ise çeviri yap
      //if (i18n.language === 'tr') {
        baslikEn = await translateToEnglish(baslikTr);
        icerikEn = await translateHtmlContent(icerikTr);
      //}
    } catch (err) {
      setLoading(false);
      showNotif(t('addArticle.errors.general'), 'error');
      return;
    }
    setLoading(false);
    // Eğer dosya seçildiyse şimdi upload et
    if (imageFile) {
      setLoading(true);
      try {
        const res = await uploadApi.uploadImage(imageFile);
        image = res.url;
      } catch {
        setLoading(false);
        showNotif('Resim yüklenemedi', 'error');
        return;
      }
      setLoading(false);
    }
    // API'ye gönderilecek makale nesnesi
    const makale = {
      baslikTr,
      baslikEn,
      icerikTr,
      icerikEn,
      yazar,
      image,
      tarih
    };
    try {
      await articleApi.add(makale);
      showNotif(t('addArticle.success'), 'success');
      // Alanları sıfırla
      setBaslikTr('');
      setAuthor('');
      setImageUrl('');
      setImageFile(null);
      setImagePreview('');
      setSelectedFileName('');
      setBlocks([{ type: 'text', value: '', id: generateId() }]);
    } catch (err) {
      showNotif(t('addArticle.errors.server'), 'error');
    }
  };

  return (
    <div className={`w-full p-6 mt-10 relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <button
        onClick={() => navigate('/admin/blog-management', { replace: true })}
        className="absolute left-6 z-20 btn btn-primary hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        ← Geri Dön
      </button>
      {/* Bildirim kutusu */}
      {notif.message && (
        <div className={`fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300
          ${notif.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          style={{ minWidth: 220, textAlign: 'center', opacity: notif.message ? 1 : 0 }}
        >
          {notif.message}
        </div>
      )}
      {loading && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg bg-blue-500 text-white font-semibold text-base transition-all duration-300" style={{ minWidth: 220, textAlign: 'center' }}>
          {t('addArticle.errors.translating')}
        </div>
      )}
      {/* Üst bar: Yazar ve Kaydet */}
      <div className="flex items-center justify-end gap-3 absolute top-6 right-8 left-8 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder={t('addArticle.placeholders.author')}
            value={author}
            onChange={e => { setAuthor(e.target.value); setAuthorError(false); }}
            required
            className={`h-10 px-4 rounded-full border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all mr-2 shadow-sm pr-8 ${isDarkMode ? 'bg-gray-800/80 text-white placeholder-gray-400' : 'bg-white text-gray-700 placeholder-gray-500'} ${authorError ? 'border-2 border-red-500' : ''}`}
            style={{ fontFamily: 'inherit' }}
          />
          {author && (
            <button
              type="button"
              onClick={() => {
                setAuthor('');
                setTimeout(() => {
                  const input = document.querySelector('input[placeholder=\"' + t('addArticle.placeholders.author') + '\"]');
                  if (input) input.focus();
                }, 0);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none text-lg p-0 m-0 bg-transparent border-0"
              tabIndex={-1}
              aria-label={t('addArticle.placeholders.author') + ' temizle'}
              style={{ lineHeight: 1 }}
            >
              &#10005;
            </button>
          )}
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-all"
          onClick={handleSave}
        >{t('addArticle.button')}</button>
      </div>
      <input
        type="text"
        placeholder={t('addArticle.placeholders.title')}
        value={baslikTr}
        required
        className={`w-full text-4xl font-bold border-0 outline-none focus:ring-0 focus:border-green-300 focus:shadow-[0_0_0_2px_#bbf7d0] px-8 pt-16 pb-4 bg-transparent placeholder-gray-400 transition-all duration-150 rounded-lg ${isDarkMode ? 'text-white' : ''} ${titleError ? 'border-2 border-red-500' : ''}`}
        style={{ fontFamily: 'Georgia, serif' }}
        onChange={e => { setTitleError(false); setContentError(false); setBaslikTr(e.target.value); }}
      />
      {/* Makale resmi alanı */}
      <div className="px-8 pb-2 mt-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={t('addArticle.placeholders.image')}
            value={imageUrl}
            onChange={e => {
              setImageUrl(e.target.value);
              setImageError(false);
              setImageFile(null);
              setImagePreview('');
              setSelectedFileName('');
            }}
            required
            className={`flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base shadow-sm ${isDarkMode ? 'bg-gray-800/80 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-700 placeholder-gray-500'} ${imageError ? 'border-2 border-red-500' : ''}`}
            style={{ fontFamily: 'inherit' }}
          />
          {/* Modern dosya yükleme butonu */}
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              setImageError(false);
              setImageFile(file);
              setSelectedFileName(file.name);
              const previewUrl = URL.createObjectURL(file);
              setImagePreview(previewUrl);
              setImageUrl('');
            }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => document.getElementById('image-upload-input').click()}
            className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-all border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            disabled={loading}
          >
            {loading ? t('addArticle.loading') : t('addArticle.upload')}
          </button>
        </div>
        {imageUrl && (
          <div className="flex items-center mt-2 w-full gap-2">
            <img src={imageUrl} alt="Önizleme" className="max-h-32 rounded shadow border" style={{ maxWidth: 200, objectFit: 'contain' }} />
            {selectedFileName && (
              <span className={`text-xs truncate max-w-[120px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedFileName}</span>
            )}
            <button onClick={() => { setImageUrl(''); setSelectedFileName(''); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ml-2
                ${isDarkMode
                  ? 'bg-red-700/20 text-red-300 hover:bg-red-700 hover:text-white'
                  : 'bg-red-100 text-red-600 hover:bg-red-500 hover:text-white'}
              `}
            >{t('addArticle.remove')}</button>
          </div>
        )}
        {imagePreview && !imageUrl && (
          <div className="flex items-center mt-2 w-full gap-2">
            <img src={imagePreview} alt="Önizleme" className="max-h-32 rounded shadow border" style={{ maxWidth: 200, objectFit: 'contain' }} />
            {selectedFileName && (
              <span className={`text-xs truncate max-w-[120px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedFileName}</span>
            )}
            <button onClick={() => { setImageFile(null); setImagePreview(''); setSelectedFileName(''); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ml-2
                ${isDarkMode
                  ? 'bg-red-700/20 text-red-300 hover:bg-red-700 hover:text-white'
                  : 'bg-red-100 text-red-600 hover:bg-red-500 hover:text-white'}
              `}
            >{t('addArticle.remove')}</button>
          </div>
        )}
      </div>
      <div className="p-8">
        {blocks.map((block, i) => {
          const isBlockEmpty = !block.value || block.value === '<br>' || block.value.trim() === '';
          return (
            <div key={block.id} className="relative flex items-center group mb-6" style={{ pointerEvents: 'auto' }}>
              {/* Overlay sadece video/embed ve seçili değilken */}
              {(block.type === 'video' || block.type === 'embed') && selectedIdx !== i && (
                <div
                  className="absolute inset-0 z-10"
                  style={{ cursor: 'pointer', background: 'transparent' }}
                  onClick={() => setSelectedIdx(i)}
                />
              )}
              {block.type === 'text' && isBlockEmpty && focusedIdx === i && (
                <>
                  <button
                    className="absolute -left-10 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition-colors"
                    tabIndex={-1}
                    onMouseDown={() => setIsMenuMouseDown(true)}
                    onMouseUp={() => setIsMenuMouseDown(false)}
                    onClick={() => setMenuIdx(i)}
                  >
                    <FaPlus className={isDarkMode ? "text-gray-900" : ""} />
                  </button>
                  {menuIdx === i && (
                    <BlockMenu
                      onClose={() => setMenuIdx(null)}
                      onAction={action => handleMenuAction(action, i)}
                      onMouseDown={() => setIsMenuMouseDown(true)}
                      onMouseUp={() => setIsMenuMouseDown(false)}
                      onMouseLeave={() => setIsMenuMouseDown(false)}
                    />
                  )}
                </>
              )}
              {block.type === 'text' && (
                <div className="relative w-full">
                  <div
                    ref={el => {
                      inputRefs.current[i] = el;
                      if (el && !el.innerHTML && block.value) {
                        el.innerHTML = block.value;
                      }
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={true}
                    onInput={e => { handleChange(i, e.currentTarget.innerHTML); setContentError(false); }}
                    onKeyDown={e => handleKeyDown(e, i)}
                    onFocus={() => setFocusedIdx(i)}
                    onBlur={() => {
                      if (menuIdx === i || isMenuMouseDown) return;
                      setFocusedIdx(null);
                      setToolbar(t => ({ ...t, visible: false }));
                    }}
                    onMouseUp={() => handleSelection(i)}
                    onKeyUp={() => handleSelection(i)}
                    onSelect={() => handleSelection(i)}
                    className={`w-full text-lg bg-transparent resize-none overflow-hidden min-h-[32px] richtext-block transition-all duration-150 ${isDarkMode ? 'text-white' : ''} ${focusedIdx === i ? `border border-gray-300 shadow-[0_0_0_2px_#b5e0c7] rounded-md ${isDarkMode ? 'bg-gray-800/80' : 'bg-[#fafbfc]'}` : 'border border-transparent'}${contentError && isBlockEmpty ? ' border-2 border-red-500' : ''}`}
                    style={{ minHeight: 32, whiteSpace: 'pre-wrap' }}
                    onMouseOver={e => {
                      const target = e.target;
                      if (target.tagName === 'A') {
                        const rect = target.getBoundingClientRect();
                        setLinkTooltip({
                          visible: true,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          href: target.getAttribute('href')
                        });
                      }
                    }}
                    onMouseOut={e => {
                      if (e.target.tagName === 'A') {
                        setLinkTooltip(t => ({ ...t, visible: false }));
                      }
                    }}
                  />
                  {(!block.value || block.value === '<br>') && (
                    <span className="absolute left-0 top-0 text-gray-400 pointer-events-none select-none pl-1" style={{ lineHeight: '32px' }}>
                      {t('addArticle.placeholders.contentWrite')}
                    </span>
                  )}
                  {/* Link Tooltip */}
                  <LinkTooltip x={linkTooltip.x} y={linkTooltip.y} href={linkTooltip.href} visible={linkTooltip.visible} />
                </div>
              )}
              {(block.type === 'image' || block.type === 'video' || block.type === 'embed') && selectedIdx === i && (
                <button
                  onClick={() => {
                    let newBlocks = blocks.filter((_, idx) => idx !== i);
                    if (newBlocks.length === 0) {
                      newBlocks.push({ type: 'text', value: '', id: generateId() });
                    }
                    setBlocks(newBlocks);
                    setSelectedIdx(null);
                  }}
                  className="absolute top-4 right-4 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-red-100 z-20"
                  title="Sil"
                  style={{ transition: 'all 0.2s', pointerEvents: 'auto' }}
                >
                  <FaTimes className="text-red-500 text-lg" />
                </button>
              )}
              {block.type === 'image' && (
                <img
                  src={block.src}
                  alt=""
                  className={`max-w-full rounded my-2 cursor-pointer ${selectedIdx === i ? 'ring-2 ring-green-400' : ''}`}
                  tabIndex={0}
                  onClick={() => setSelectedIdx(i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                />
              )}
              {block.type === 'video' && (
                <video
                  src={block.src}
                  controls
                  className={`w-full rounded my-2 cursor-pointer ${selectedIdx === i ? 'ring-2 ring-green-400' : ''}`}
                  style={{
                    aspectRatio: '16/9',
                    width: '100%',
                    maxWidth: 800,
                    minHeight: 350,
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  tabIndex={0}
                  onClick={() => setSelectedIdx(i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                />
              )}
              {block.type === 'embed' && (
                <iframe
                  src={block.src}
                  title="embed"
                  className={`w-full rounded my-2 cursor-pointer ${selectedIdx === i ? 'ring-2 ring-green-400' : ''}`}
                  style={{
                    aspectRatio: '16/9',
                    width: '100%',
                    maxWidth: 800,
                    minHeight: 350,
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  tabIndex={0}
                  onClick={() => setSelectedIdx(i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                />
              )}
              {block.type === 'code' && (
                <textarea
                  value={block.value}
                  onChange={e => handleChange(i, e.target.value, e)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const newBlocks = [...blocks];
                      newBlocks.splice(i + 1, 0, { type: 'text', value: '', id: generateId() });
                      setBlocks(newBlocks);
                      setTimeout(() => {
                        inputRefs.current[i + 1]?.focus();
                      }, 0);
                    }
                  }}
                  onFocus={() => setSelectedIdx(i)}
                  className={`w-full border border-gray-200 bg-gray-100 font-mono text-sm rounded p-2 my-2 ${isDarkMode ? 'text-white bg-gray-800/80' : ''}`}
                  placeholder="Kod..."
                  rows={2}
                  style={{ minHeight: 32 }}
                />
              )}
              {block.type === 'quote' && (
                <textarea
                  value={block.value}
                  onChange={e => handleChange(i, e.target.value, e)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const newBlocks = [...blocks];
                      newBlocks.splice(i + 1, 0, { type: 'text', value: '', id: generateId() });
                      setBlocks(newBlocks);
                      setTimeout(() => {
                        inputRefs.current[i + 1]?.focus();
                      }, 0);
                    }
                  }}
                  onFocus={() => setSelectedIdx(i)}
                  className={`w-full border-l-4 border-green-400 italic rounded p-2 my-2 ${isDarkMode ? 'text-white bg-gray-800/80' : 'text-gray-600 bg-gray-50'}`}
                  placeholder="Alıntı..."
                  rows={1}
                  style={{ minHeight: 32 }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Floating Toolbar */}
      <FloatingToolbar
        x={toolbar.x}
        y={toolbar.y}
        visible={toolbar.visible}
        onBold={() => handleToolbarAction('bold')}
        onItalic={() => handleToolbarAction('italic')}
        onLink={() => handleToolbarAction('link')}
        onHeading={() => handleToolbarAction('heading')}
        onQuote={() => handleToolbarAction('quote')}
        onNote={() => handleToolbarAction('note')}
        activeStyles={activeStyles}
      />
    </div>
  );
}

// CSS for underline links in contentEditable
<style>{`
.richtext-block a {
  text-decoration: underline !important;
  color: #222 !important;
}
.dark .richtext-block a {
  color: #8ddc97 !important;
}
.richtext-block blockquote {
  border-left: 8px solid #8ddc97;
  background: #f8fafc;
  color: #444;
  font-style: italic;
  padding: 16px 24px;
  margin: 24px 0;
  border-radius: 8px;
  font-size: 1.1em;
}
.richtext-block h1, .richtext-block h2, .richtext-block h3 {
  font-weight: bold;
  font-size: 2rem;
  margin: 24px 0 12px 0;
  line-height: 1.2;
}
`}</style> 