import React, { useState } from 'react';
import { profileApi } from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Logo from '../../components/Logo';
import { getTranslatedErrorMessage } from '../../utils/errorHelpers';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await profileApi.login({ email, password });
      localStorage.setItem('token', result.token); // Token'ı kaydet
      // Loading mesajını 2 saniye göster
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1500);
    } catch (err) {
      // Backend'den gelen Türkçe mesajı çeviri sistemi ile çevir
      console.log("erorrrr");
      console.log(err.message);
      
      setError(getTranslatedErrorMessage(err.message, t, i18n, 'admin.invalidCredentials'));
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{
          background: 'linear-gradient(270deg, #3b82f6, #a21caf, #ec4899, #3b82f6)',
          backgroundSize: '600% 600%',
          animation: 'gradientMove 10s ease-in-out infinite',
          opacity: 0.7
        }}
      />
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {/* Logo */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 flex justify-center">
        <Logo className="h-16 w-auto" style={{ maxHeight: 64, maxWidth: 200 }} />
      </div>
      {/* Loading Alert */}
      {loading && (
        <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-blue-500 text-white" style={{ minWidth: 220, textAlign: 'center' }}>
          {t('admin.loggingIn')}
        </div>
      )}
      <form onSubmit={handleSubmit} className={`p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('admin.loginTitle')}</h2>
        {error && <div className="text-red-400 text-center mb-2">{error}</div>}
        <div>
          <label className={`block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('admin.email')}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            required
          />
        </div>
        <div>
          <label className={`block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('admin.password')}</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 pr-10 ${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded font-semibold transition ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          disabled={loading}
        >
          {t('admin.loginButton')}
        </button>
      </form>
    </div>
  );
};

export default Login; 