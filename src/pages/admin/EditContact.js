import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { contactApi } from '../../api/api';

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

  useEffect(() => {
    setLoading(true);
    setError('');
    contactApi.get()
      .then(data => {
        setContact(data);
        setLoading(false);
      })
      .catch(() => {
        setError('İletişim bilgileri yüklenemedi.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    contactApi.update(contact)
      .then(data => {
        setContact(data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      })
      .catch(() => {
        setError('Güncelleme sırasında hata oluştu.');
      });
  };

  if (loading) return <div className="p-6 text-gray-300">Yükleniyor...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg p-6 shadow-lg">
        <div>
          <label className="block text-gray-300 mb-1 flex items-center gap-2"><FaEnvelope /> E-posta</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1 flex items-center gap-2"><FaMapMarkerAlt /> Konum</label>
          <input
            type="text"
            name="location"
            value={contact.location}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1 flex items-center gap-2"><FaGithub /> GitHub</label>
          <input
            type="url"
            name="github"
            value={contact.github}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1 flex items-center gap-2"><FaLinkedin /> LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={contact.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1 flex items-center gap-2"><FaTwitter /> Twitter</label>
            <input
              type="url"
              name="twitter"
              value={contact.twitter}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1 flex items-center gap-2"><FaInstagram /> Instagram</label>
            <input
              type="url"
              name="instagram"
              value={contact.instagram}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Kaydet
        </button>
        {success && (
          <div className="text-green-400 text-center font-medium mt-2">İletişim bilgileri başarıyla güncellendi!</div>
        )}
      </form>
    </div>
  );
};

export default EditContact; 