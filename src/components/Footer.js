import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const socialLinks = [
    { 
      icon: FaGithub, 
      href: 'https://github.com/rzayevsahil', 
      label: 'GitHub',
      color: '#000000',
      hoverColor: '#333333'
    },
    { 
      icon: FaLinkedin, 
      href: 'https://linkedin.com/in/sahil-rzayev', 
      label: 'LinkedIn',
      color: '#0077B5',
      hoverColor: '#005885'
    },
    { 
      icon: FaTwitter, 
      href: 'https://twitter.com/sahilrzayev', 
      label: 'Twitter',
      color: '#1DA1F2',
      hoverColor: '#0d8bd9'
    },
    { 
      icon: FaInstagram, 
      href: 'https://instagram.com/sahilrzayev', 
      label: 'Instagram',
      color: '#E4405F',
      hoverColor: '#c13584'
    }
  ];

  const quickLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.projects'), href: '#projects' },
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
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg transition-all duration-30 text-gray-300"
                  aria-label={social.label}
                  style={{
                    transition: 'all 0.03s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = social.hoverColor;
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
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
                  key={link.name}
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
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                sahilrzayev200d@gmail.com
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                Istanbul, Turkey
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                github.com/rzayevsahil
              </p>
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
              {t('footer.copyright')}
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