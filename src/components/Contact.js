import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [proposalFormData, setProposalFormData] = useState({
    projectName: '',
    clientName: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProposalSubmitting, setIsProposalSubmitting] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showProposalModal) {
        closeProposalModal();
      }
    };

    if (showProposalModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore scrolling
    };
  }, [showProposalModal]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProposalChange = (e) => {
    setProposalFormData({
      ...proposalFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Mesajınız başarıyla gönderildi!');
    }, 2000);
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setIsProposalSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsProposalSubmitting(false);
      setProposalFormData({
        projectName: '',
        clientName: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        timeline: '',
        description: ''
      });
      setShowProposalModal(false);
      alert('Proje teklifiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
    }, 2000);
  };

  const openProposalModal = () => {
    setShowProposalModal(true);
  };

  const closeProposalModal = () => {
    setShowProposalModal(false);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: t('contact.info.email'),
      value: 'sahilrzayev200d@gmail.com',
      link: 'mailto:sahilrzayev200d@gmail.com'
    },
    {
      icon: FaMapMarkerAlt,
      title: t('contact.info.location'),
      value: 'Istanbul, Turkey',
      link: '#'
    },
    {
      icon: FaGithub,
      title: 'GitHub',
      value: 'github.com/rzayevsahil',
      link: 'https://github.com/rzayevsahil'
    }
  ];

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

  return (
    <section id="contact" className={`section ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-100'}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="section-subtitle">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('contact.info.title')}
            </h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4"
                >
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <info.icon className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{info.title}</h4>
                    <a
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {info.value}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('contact.social')}
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-lg transition-all duration-13 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50' 
                        : 'bg-white/80 text-gray-500 hover:bg-gray-100/80 shadow-md'
                    }`}
                    aria-label={social.label}
                    style={{
                      transition: 'all 0.013s ease-in-out'
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
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
              className={`mt-8 rounded-lg p-6 border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30' 
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50'
              }`}
            >
              <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('contact.workingHours.title')}
              </h4>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('contact.workingHours.weekdays')}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('contact.workingHours.weekend')}
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('contact.form.title')}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="name" className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                        : 'bg-white/80 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-md'
                    }`}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="email" className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                        : 'bg-white/80 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-md'
                    }`}
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <label htmlFor="subject" className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('contact.form.subject')} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                      : 'bg-white/80 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-md'
                  }`}
                  placeholder={t('contact.form.subjectPlaceholder')}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <label htmlFor="message" className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('contact.form.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 resize-none ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                      : 'bg-white/80 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-md'
                  }`}
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed contact-send-btn"
                style={{
                  transform: 'scale(1)',
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
                {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Map or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className={`rounded-lg p-8 border ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('contact.freelance.title')}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('contact.freelance.description')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={openProposalModal}
            >
              {t('contact.freelance.button')}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Proposal Modal */}
      <AnimatePresence>
        {showProposalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeProposalModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                isDarkMode 
                  ? 'bg-gray-900 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              } rounded-lg shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 flex justify-between items-center p-6 border-b ${
                isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
              }`}>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('contact.proposal.title')}
                </h3>
                <button
                  onClick={closeProposalModal}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <form onSubmit={handleProposalSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      <label htmlFor="projectName" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('contact.proposal.projectName')} *
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={proposalFormData.projectName}
                        onChange={handleProposalChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }`}
                        placeholder={t('contact.proposal.projectNamePlaceholder')}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <label htmlFor="clientName" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('contact.proposal.clientName')} *
                      </label>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        value={proposalFormData.clientName}
                        onChange={handleProposalChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }`}
                        placeholder={t('contact.proposal.clientNamePlaceholder')}
                      />
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <label htmlFor="email" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('contact.proposal.email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={proposalFormData.email}
                        onChange={handleProposalChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }`}
                        placeholder={t('contact.proposal.emailPlaceholder')}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <label htmlFor="phone" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('contact.proposal.phone')} *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={proposalFormData.phone}
                        onChange={handleProposalChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }`}
                        placeholder={t('contact.proposal.phonePlaceholder')}
                      />
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <label htmlFor="projectType" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('contact.proposal.projectType')} *
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={proposalFormData.projectType}
                        onChange={handleProposalChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500'
                        }`}
                      >
                        <option value="">{t('contact.proposal.selectProjectType')}</option>
                        <option value="web-development">{t('contact.proposal.webDevelopment')}</option>
                        <option value="mobile-development">{t('contact.proposal.mobileDevelopment')}</option>
                        <option value="desktop-application">{t('contact.proposal.desktopApplication')}</option>
                        <option value="database-design">{t('contact.proposal.databaseDesign')}</option>
                        <option value="api-development">{t('contact.proposal.apiDevelopment')}</option>
                        <option value="other">{t('contact.proposal.other')}</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <label htmlFor="budget" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('contact.proposal.budget')} *
                      </label>
                      <input
                        type="text"
                        id="budget"
                        name="budget"
                        value={proposalFormData.budget}
                        onChange={handleProposalChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }`}
                        placeholder={t('contact.proposal.budgetPlaceholder')}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <label htmlFor="timeline" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('contact.proposal.timeline')} *
                    </label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      value={proposalFormData.timeline}
                      onChange={handleProposalChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                      }`}
                      placeholder={t('contact.proposal.timelinePlaceholder')}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <label htmlFor="description" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('contact.proposal.description')} *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={proposalFormData.description}
                      onChange={handleProposalChange}
                      required
                      rows="6"
                      className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 resize-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                      }`}
                      placeholder={t('contact.proposal.descriptionPlaceholder')}
                    />
                  </motion.div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="submit"
                      disabled={isProposalSubmitting}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 btn btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed proposal-submit-btn"
                      style={{
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease-in-out'
                      }}
                    >
                      {isProposalSubmitting ? t('contact.proposal.sending') : t('contact.proposal.send')}
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={closeProposalModal}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-secondary px-6 py-3 proposal-cancel-btn"
                      style={{
                        transform: 'scale(1)',
                        transition: 'transform 0.2s ease-in-out'
                      }}
                    >
                      {t('contact.proposal.cancel')}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact; 