import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { contactApi } from '../api/api';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useTheme();
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    contactApi.get()
      .then(data => {
        setContactData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('İletişim bilgileri yüklenemedi.');
        setLoading(false);
      });
  }, []);

  const socialLinks = contactData ? [
    { 
      icon: FaGithub, 
      href: contactData.github, 
      label: 'GitHub',
      color: '#000000',
      hoverColor: '#333333'
    },
    { 
      icon: FaLinkedin, 
      href: contactData.linkedin, 
      label: 'LinkedIn',
      color: '#0077B5',
      hoverColor: '#005885'
    },
    { 
      icon: FaTwitter, 
      href: contactData.twitter, 
      label: 'Twitter',
      color: '#1DA1F2',
      hoverColor: '#0d8bd9'
    },
    { 
      icon: FaInstagram, 
      href: contactData.instagram, 
      label: 'Instagram',
      color: '#E4405F',
      hoverColor: '#c13584'
    }
  ] : [];

  const quickLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.contact'), href: '#contact' }
  ];

  const services = [
    'Web Development',
    'API Development',
    'Database Design',
    'System Architecture',
    'Performance Optimization'
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white`}>
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Sahil Rzayev</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + (index * 0.1), duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg transition-all duration-30 text-gray-300"
                  aria-label={social.label}
                  style={{
                    transition: 'all 0.03s ease-in-out'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = social.hoverColor;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '';
                  }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4 text-blue-400">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name + '-' + i18n.language}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className={`transition-colors duration-300 hover:text-blue-400 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-300'
                    }`}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4 text-blue-400">{t('footer.services')}</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <motion.li
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`transition-colors duration-300 hover:text-blue-400 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-300'
                  }`}
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4 text-blue-400">{t('footer.contact')}</h4>
            <div className="space-y-3">
              {loading ? (
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>Yükleniyor...</div>
              ) : error ? (
                <div className="text-red-400">{error}</div>
              ) : contactData ? (
                <>
                  <div className="flex items-center text-gray-300 text-base">{contactData.email}</div>
                  <div className="flex items-center text-gray-300 text-base">{contactData.location}</div>
                  <div className="flex items-center text-gray-300 text-base">
                    <a href={contactData.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition break-all">
                      {contactData.github.replace('https://', '')}
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                {t('footer.madeWith')}
              </span>
              <FaHeart className="text-red-500 animate-pulse" size={16} />
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 