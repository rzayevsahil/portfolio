import React, { useState, useEffect } from 'react';
import { profileApi } from '../../api/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logoDark from '../../assets/logo-dark.svg';
import emptyProfilePhoto from '../../assets/empty-profile-photo.png';
import { useLoading } from '../../context/LoadingContext';

const EditProfile = () => {
  const [profile, setProfile] = useState({});
  const [photoPreview, setPhotoPreview] = useState();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const { setGlobalLoading } = useLoading();

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
          setError('Profil bilgileri eklenmedi.');
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
      .catch(() => {
        setError('Profil bilgileri yüklenemedi.');
        setLoading(false);
        setGlobalLoading(false);
      });
  }, [setGlobalLoading]);

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
        // Sadece kaydet butonuna basınca upload et
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
      setError('Profil güncellenemedi.');
    }
  };

  if (loading) return null;

  // Fotoğraf url'sini konsola yazdır
  console.log('Profil fotoğrafı src:', getPhotoUrl(photoPreview || profile.photoUrl || emptyProfilePhoto));

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Profil Bilgileri</h2>
      {error && <div className="text-red-400 text-center mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24">
            <img
              src={getPhotoUrl(photoPreview || profile.photoUrl || emptyProfilePhoto)}
              alt="Profil Fotoğrafı"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-600 shadow"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Profil fotoğrafı yükle"
            />
          </div>
          <span className="text-gray-400 text-sm">Profil fotoğrafı yüklemek için tıklayın</span>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Ad Soyad</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">E-posta</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Mevcut Şifre</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={profile.currentPassword || ''}
              readOnly
              className="w-full px-4 py-2 rounded bg-gray-900 text-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-60 cursor-not-allowed pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              onClick={() => setShowCurrentPassword(v => !v)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Yeni Şifre</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Şifreyi güncellemek için doldurun"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Kaydet
        </button>
        {success && (
          <div className="text-green-400 text-center font-medium mt-2">Profil başarıyla güncellendi!</div>
        )}
      </form>
  </div>
);
};

export default EditProfile; 