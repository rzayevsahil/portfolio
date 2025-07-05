import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { contactApi } from '../../api/api';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import GlobalLoader from '../../components/GlobalLoader';
import i18n from 'i18next';
import { getTranslatedErrorMessage } from '../../utils/errorHelpers';

const EditContact = () => {
  const [contact, setContact] = useState({
    email: '',
    location: '',
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setLoading(true);
    setError('');
    contactApi.get()
      .then(data => {
        setContact(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(getTranslatedErrorMessage(error.message, t, i18n, 'contactEdit.noData'));
        setLoading(false);
      });
  }, [t]);

  useEffect(() => {
    if (error) {
      setError(getTranslatedErrorMessage(error, t, i18n, 'contactEdit.noData'));
      const timer = setTimeout(() => setError(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [error, t, i18n.language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') setEmailError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setEmailError(false);
    if (!contact.email.trim()) {
      setError(t('contactEdit.emailRequired') || 'E-posta zorunludur.');
      setEmailError(true);
      return;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(contact.email)) {
      setError(t('contactEdit.emailInvalid') || 'Geçerli bir e-posta giriniz.');
      setEmailError(true);
      return;
    }
    if (contact.id) {
      // Güncelleme
      contactApi.update(contact.id, contact)
        .then(data => {
          setContact(data);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        })
        .catch(() => {
          setError(t('contactEdit.updateError'));
        });
    } else {
      // Ekleme
      contactApi.create(contact)
        .then(data => {
          setContact(data);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        })
        .catch(() => {
          setError(getTranslatedErrorMessage('Ekleme sırasında hata oluştu.', t, i18n, 'contactEdit.createError'));
        });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Alert Messages */}
      {loading && <GlobalLoader show={true} />}
      {error && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-red-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-green-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {t('contactEdit.success')}
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6">{t('contactEdit.title')}</h2>
      <form onSubmit={handleSubmit} className={`space-y-6 rounded-lg p-6 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div>
          <label className={`block mb-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}><FaEnvelope /> {t('contactEdit.email')}</label>
          <input
            type="text"
            name="email"
            value={contact.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} ${emailError ? 'border-red-500' : (isDarkMode ? 'border-gray-700' : 'border-gray-300')}`}
          />
        </div>
        <div>
          <label className={`block mb-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}><FaMapMarkerAlt /> {t('contactEdit.location')}</label>
          <input
            type="text"
            name="location"
            value={contact.location}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
          />
        </div>
        <div>
          <label className={`block mb-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}><FaGithub /> GitHub</label>
          <input
            type="url"
            name="github"
            value={contact.github}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block mb-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}><FaLinkedin /> LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={contact.linkedin}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            />
          </div>
          <div>
            <label className={`block mb-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}><FaTwitter /> Twitter</label>
            <input
              type="url"
              name="twitter"
              value={contact.twitter}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            />
          </div>
          <div>
            <label className={`block mb-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}><FaInstagram /> Instagram</label>
            <input
              type="url"
              name="instagram"
              value={contact.instagram}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            />
          </div>
        </div>
        <button type="submit" className="w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-300">
          {t('contactEdit.save')}
        </button>
      </form>
    </div>
  );
};

export default EditContact;