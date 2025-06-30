import React, { useState, useRef } from 'react';
import { FaPlus, FaTimes, FaImage, FaRegSquare, FaVideo, FaCode, FaQuoteRight, FaEllipsisH } from 'react-icons/fa';

function BlockMenu({ onClose, onAction, ...props }) {
  return (
    <div
      className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-2 shadow-lg absolute left-[-60px] z-50"
      {...props}
    >
      <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-xl"><FaTimes /></button>
      <button onClick={() => onAction('image')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaImage /></button>
      <button onClick={() => onAction('embed')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaRegSquare /></button>
      <button onClick={() => onAction('video')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaVideo /></button>
      <button onClick={() => onAction('code')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaCode /></button>
      <button onClick={() => onAction('quote')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaQuoteRight /></button>
      <button onClick={() => onAction('more')} className="w-8 h-8 flex items-center justify-center rounded-full border border-green-600 text-green-600 text-xl"><FaEllipsisH /></button>
    </div>
  );
}

export default function MediumEditor() {
  const [blocks, setBlocks] = useState([{ type: 'text', value: '' }]);
  const inputRefs = useRef([]);
  const [menuIdx, setMenuIdx] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [isMenuMouseDown, setIsMenuMouseDown] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

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
    if (selectedIdx === i && e.key === 'Enter') {
      e.preventDefault();
      const newBlocks = [...blocks];
      newBlocks.splice(i + 1, 0, { type: 'text', value: '' });
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
      newBlocks.splice(i + 1, 0, { type: 'text', value: '' });
      setBlocks(newBlocks);
      setTimeout(() => {
        inputRefs.current[i + 1]?.focus();
      }, 0);
    }
    if (e.key === 'Backspace' && blocks[i].type === 'text' && blocks[i].value === '' && blocks.length > 1) {
      if (i === 0) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const newBlocks = blocks.filter((_, idx) => idx !== i);
      setBlocks(newBlocks);
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
      if (url) newBlocks[menuIdx] = { type: 'video', src: url };
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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-10 p-0 relative">
      <button className="absolute top-6 right-8 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-all">Kaydet</button>
      <input
        type="text"
        placeholder="Title"
        className="w-full text-4xl font-bold border-0 outline-none focus:ring-0 px-8 pt-10 pb-4 bg-transparent placeholder-gray-400"
        style={{ fontFamily: 'Georgia, serif' }}
      />
      <div className="p-8">
        {blocks.map((block, i) => (
          <div key={i} className="relative flex items-center group mb-2">
            {block.type === 'text' && block.value === '' && (focusedIdx === i || menuIdx === i) && (
              <>
                <button
                  className="absolute -left-10 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100"
                  tabIndex={-1}
                  onMouseDown={() => setIsMenuMouseDown(true)}
                  onMouseUp={() => setIsMenuMouseDown(false)}
                  onClick={() => setMenuIdx(i)}
                >
                  <FaPlus />
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
              <textarea
                ref={el => (inputRefs.current[i] = el)}
                value={block.value}
                onChange={e => handleChange(i, e.target.value, e)}
                onKeyDown={e => handleKeyDown(e, i)}
                onFocus={() => setFocusedIdx(i)}
                onBlur={() => {
                  if (menuIdx === i || isMenuMouseDown) return;
                  setFocusedIdx(null);
                }}
                className="w-full border-0 outline-none text-lg bg-transparent resize-none overflow-hidden"
                placeholder="Yazmaya başla..."
                rows={1}
                style={{ minHeight: 32 }}
              />
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
                className={`max-w-full rounded my-2 cursor-pointer ${selectedIdx === i ? 'ring-2 ring-green-400' : ''}`}
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
                style={{ minHeight: 200 }}
                tabIndex={0}
                onClick={() => setSelectedIdx(i)}
                onKeyDown={e => handleKeyDown(e, i)}
              />
            )}
            {block.type === 'code' && (
              <textarea
                value={block.value}
                onChange={e => handleChange(i, e.target.value, e)}
                className="w-full border border-gray-200 bg-gray-100 font-mono text-sm rounded p-2 my-2"
                placeholder="Kod..."
                rows={2}
                style={{ minHeight: 32 }}
              />
            )}
            {block.type === 'quote' && (
              <textarea
                value={block.value}
                onChange={e => handleChange(i, e.target.value, e)}
                className="w-full border-l-4 border-green-400 italic text-gray-600 bg-gray-50 rounded p-2 my-2"
                placeholder="Alıntı..."
                rows={1}
                style={{ minHeight: 32 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 