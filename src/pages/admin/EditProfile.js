import React, { useState, useEffect } from 'react';
import { profileApi } from '../../api/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logoDark from '../../assets/logo-dark.svg';
import emptyProfilePhoto from '../../assets/empty-profile-photo.png';
import { useLoading } from '../../context/LoadingContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import i18n from 'i18next';
import { getTranslatedErrorMessage } from '../../utils/errorHelpers';

const EditProfile = () => {
  const [profile, setProfile] = useState({});
  const [photoPreview, setPhotoPreview] = useState();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const { setGlobalLoading } = useLoading();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const apiUrl = process.env.REACT_APP_API_URL;
  const getPhotoUrl = (url) => {
    if (!url) return '/default-profile.png';
    if (url.startsWith('/profile_photos')) {
      return apiUrl.replace(/\/api$/, '') + url;
    }
    if (
      url.startsWith('http') ||
      url.startsWith('data:image') ||
      url.startsWith('/static/') ||
      url.startsWith('/assets/') ||
      url.match(/\.(png|svg|jpg|jpeg|gif)$/i)
    ) return url;
    if (url.startsWith('/')) return url;
    return apiUrl + url;
  };

  useEffect(() => {
    setLoading(true);
    setGlobalLoading(true);
    setError('');
    profileApi.get()
      .then(data => {
        if (!data) {
          setError(t('profile.notAdded'));
          setProfile({});
        } else {
          setProfile({
            name: data.name || '',
            email: data.email || '',
            photoUrl: data.photoUrl || '',
            currentPassword: data.password || '',
            password: ''
          });
          setPhotoPreview(data.photoUrl || '');
        }
        setLoading(false);
        setGlobalLoading(false);
      })
      .catch((error) => {
        setError(getTranslatedErrorMessage(error.message, t, i18n, 'profile.noData'));
        setLoading(false);
        setGlobalLoading(false);
      });
  }, [setGlobalLoading, t]);

  useEffect(() => {
    if (error) {
      setError(getTranslatedErrorMessage(error, t, i18n, 'profile.noData'));
      const timer = setTimeout(() => setError(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [error, t, i18n.language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    let photoUrlToUpdate = profile.photoUrl || '';
    try {
      if (newPhotoFile) {
        const result = await profileApi.uploadPhoto(newPhotoFile);
        photoUrlToUpdate = result.url;
      }
      await profileApi.update({
        name: profile.name,
        email: profile.email,
        photoUrl: photoUrlToUpdate,
        password: profile.password
      });
      const data = await profileApi.get();
      setProfile({
        name: data.name || '',
        email: data.email || '',
        photoUrl: data.photoUrl || '',
        currentPassword: data.password || '',
        password: ''
      });
      setPhotoPreview(data.photoUrl || '');
      setNewPhotoFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError(t('profile.updateError'));
    }
  };

  if (loading) return null;

  // Fotoğraf url'sini konsola yazdır
  console.log('Profil fotoğrafı src:', getPhotoUrl(photoPreview || profile.photoUrl || emptyProfilePhoto));

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Alert Messages */}
      {error && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-red-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-green-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {t('profile.updateSuccess')}
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6">{t('profile.title')}</h2>
      <form onSubmit={handleSubmit} className={`space-y-6 rounded-lg p-6 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24">
            <img
              src={getPhotoUrl(photoPreview || profile.photoUrl || emptyProfilePhoto)}
              alt={t('profile.photoAlt')}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-600 shadow"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title={t('profile.uploadPhoto')}
            />
          </div>
          <span className="text-gray-400 text-sm">{t('profile.uploadHint')}</span>
        </div>
        <div>
          <label className={`block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('profile.name')}</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            required
          />
        </div>
        <div>
          <label className={`block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('profile.email')}</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            required
          />
        </div>
        <div>
          <label className={`block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('profile.currentPassword')}</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={profile.currentPassword || ''}
              readOnly
              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 transition-colors duration-300
                ${isDarkMode
                  ? 'bg-gray-900 text-gray-200 placeholder-gray-400 border-gray-700 opacity-80'
                  : 'bg-gray-200 text-gray-700 placeholder-gray-500 border-gray-300 opacity-100'
                } cursor-not-allowed`}
              placeholder={t('profile.currentPassword')}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowCurrentPassword(v => !v)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div>
          <label className={`block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('profile.newPassword')}</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            placeholder={t('profile.newPasswordPlaceholder')}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded font-semibold transition ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          {t('profile.save')}
        </button>
      </form>
    </div>
  );
};

export default EditProfile; 