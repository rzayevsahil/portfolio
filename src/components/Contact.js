import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { contactApi, workingHoursApi } from '../api/api';
import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/js/utils.js';
import CurrencyInput from 'react-currency-input-field';
import i18n from 'i18next';
import { getTranslatedErrorMessage } from '../utils/errorHelpers';

const dayTranslations = {
  'Pazartesi': { en: 'Monday', tr: 'Pazartesi' },
  'Salı': { en: 'Tuesday', tr: 'Salı' },
  'Çarşamba': { en: 'Wednesday', tr: 'Çarşamba' },
  'Perşembe': { en: 'Thursday', tr: 'Perşembe' },
  'Cuma': { en: 'Friday', tr: 'Cuma' },
  'Cumartesi': { en: 'Saturday', tr: 'Cumartesi' },
  'Pazar': { en: 'Sunday', tr: 'Pazar' }
};

const WEEKDAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
const WEEKEND = ['Cumartesi', 'Pazar'];

function translateDays(daysString, lang = 'tr', allDays = []) {
  if (!daysString) return '';
  const daysArr = daysString.split(',');
  const sorted = allDays.length > 0 ? allDays.filter(day => daysArr.includes(day)) : daysArr;
  return sorted.map(day => dayTranslations[day]?.[lang] || day).join(', ');
}

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
    countryCode: '+90',
    phone: '',
    projectType: '',
    currency: 'TRY',
    budget: '',
    timeline: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProposalSubmitting, setIsProposalSubmitting] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useTheme();
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingHours, setWorkingHours] = useState(null);
  const [whLoading, setWhLoading] = useState(true);
  const [whError, setWhError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [proposalFormErrors, setProposalFormErrors] = useState({});
  const [proposalAlert, setProposalAlert] = useState({ message: '', type: '' });
  const [proposalAlertProgress, setProposalAlertProgress] = useState(0);
  const phoneInputRef = React.useRef(null);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef(null);
  const currencyOptions = [
    { value: 'TRY', label: '₺ TRY' },
    { value: 'USD', label: '$ USD' },
    { value: 'EUR', label: '€ EUR' },
  ];

  const justClosedDropdownRef = useRef(false);

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

  useEffect(() => {
    setLoading(true);
    setError('');
    contactApi.get()
      .then(data => {
        setContactData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(getTranslatedErrorMessage(error.message, t, i18n, 'contactEdit.noData'));
        setLoading(false);
      });
  }, [t]);

  useEffect(() => {
    setWhLoading(true);
    setWhError('');
    workingHoursApi.get()
      .then(data => {
        setWorkingHours(data);
        setWhLoading(false);
      })
      .catch((error) => {
        setWhError(getTranslatedErrorMessage(error.message, t, i18n, 'workingHours.noData'));
        setWhLoading(false);
      });
  }, [t]);

  useEffect(() => {
    if (isProposalSubmitting) {
      setProposalAlertProgress(0);
      const duration = 2000;
      const interval = 20;
      let elapsed = 0;
      const timer = setInterval(() => {
        elapsed += interval;
        setProposalAlertProgress(Math.min((elapsed / duration) * 100, 100));
        if (elapsed >= duration) {
          clearInterval(timer);
        }
      }, interval);
      return () => clearInterval(timer);
    } else {
      setProposalAlertProgress(0);
    }
  }, [isProposalSubmitting]);

  useEffect(() => {
    let iti;
    if (showProposalModal && phoneInputRef.current) {
      iti = intlTelInput(phoneInputRef.current, {
        initialCountry: 'tr',
        separateDialCode: true,
        nationalMode: false,
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@21.1.5/build/js/utils.js',
      });

      // .iti__selected-country butonuna tıklayınca: açıkken kapat, kapalıysa dokunma
      const flagButton = phoneInputRef.current.parentNode.querySelector('.iti__selected-country');
      if (flagButton) {
        const handleFlagClick = (e) => {
          const dropdown = document.getElementById('iti-0__dropdown-content') || document.querySelector('.iti__dropdown-content, .iti__country-list');
          if (!dropdown) return;
          const isOpen = dropdown.style.display === 'block' || !dropdown.classList.contains('iti__hide');
          if (isOpen) {
            dropdown.classList.add('iti__hide');
            dropdown.style.display = 'none';
            flagButton.setAttribute('aria-expanded', 'false');
            justClosedDropdownRef.current = true;
            e.preventDefault();
            e.stopPropagation();
          } else if (justClosedDropdownRef.current) {
            justClosedDropdownRef.current = false;
            
            dropdown.style.display = '';
            // event'i engelleme, kütüphane açsın
          }
          // Normalde kapalıysa hiçbir şey yapma, kütüphane açsın
        };
        flagButton.addEventListener('click', handleFlagClick, true);
        // Cleanup
        return () => {
          flagButton.removeEventListener('click', handleFlagClick, true);
        };
      }

      // Dışarı tıklanınca dropdown'u kapat (sadece fonksiyon varsa)
      const handleClickOutside = (event) => {
        const dropdown = document.querySelector('.iti__dropdown-content');
        if (
          dropdown &&
          !dropdown.contains(event.target) &&
          !phoneInputRef.current.contains(event.target)
        ) {
          if (iti && typeof iti.closeDropdown === 'function') {
            iti.closeDropdown();
          }
        }
      };
      document.addEventListener('mousedown', handleClickOutside);

      const updatePhone = () => {
        setProposalFormData(f => ({
          ...f,
          phone: iti.getNumber() || ''
        }));
      };
      phoneInputRef.current.addEventListener('countrychange', updatePhone);
      phoneInputRef.current.addEventListener('input', updatePhone);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        phoneInputRef.current && phoneInputRef.current.removeEventListener('countrychange', updatePhone);
        phoneInputRef.current && phoneInputRef.current.removeEventListener('input', updatePhone);
        iti && iti.destroy();
      };
    }
  }, [showProposalModal]);

  useEffect(() => {
    if (showProposalModal) {
      setTimeout(() => {
        // Sadece dropdown ana kapsayıcı ve ülke listesi renklerini ayarla
        const dropdownContent = document.querySelector('.iti__dropdown-content');
        if (dropdownContent) {
          if (document.body.classList.contains('dark')) {
            dropdownContent.style.backgroundColor = '#23272f';
            dropdownContent.style.color = '#f3f4f6';
          } else {
            dropdownContent.style.backgroundColor = '#fff';
            dropdownContent.style.color = '#23272f';
          }
        }
        const countryList = document.querySelector('.iti__country-list');
        if (countryList) {
          if (document.body.classList.contains('dark')) {
            Array.from(countryList.querySelectorAll('li')).forEach(el => {
              el.style.backgroundColor = '#23272f';
              el.style.color = '#f3f4f6';
            });
          } else {
            Array.from(countryList.querySelectorAll('li')).forEach(el => {
              el.style.backgroundColor = '#fff';
              el.style.color = '#23272f';
            });
          }
        }
      }, 200);
    }
  }, [showProposalModal, isDarkMode]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false);
      }
    }
    if (currencyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currencyDropdownOpen]);

  const validate = () => {
    if (!formData.name.trim()) return { name: t('contact.form.errors.name') };
    if (!formData.email.trim()) return { email: t('contact.form.errors.email') };
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      return { email: t('contact.form.errors.emailInvalid') };
    }
    if (!formData.subject.trim()) return { subject: t('contact.form.errors.subject') };
    if (!formData.message.trim()) return { message: t('contact.form.errors.message') };
    return {};
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormErrors({
      ...formErrors,
      [e.target.name]: ''
    });
  };

  const handleProposalChange = (e) => {
    if (e.target.name === 'phone') {
      // Sadece rakam girilmesine izin ver
      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
      setProposalFormData({
        ...proposalFormData,
        phone: onlyNums
      });
      setProposalFormErrors({
        ...proposalFormErrors,
        phone: ''
      });
    } else if (e.target.name === 'currency') {
      setProposalFormData({
        ...proposalFormData,
        currency: e.target.value
      });
      setProposalFormErrors({
        ...proposalFormErrors,
        currency: ''
      });
    } else {
      setProposalFormData({
        ...proposalFormData,
        [e.target.name]: e.target.value
      });
      setProposalFormErrors({
        ...proposalFormErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleBudgetChange = (value) => {
    setProposalFormData({
      ...proposalFormData,
      budget: value || ''
    });
    setProposalFormErrors({
      ...proposalFormErrors,
      budget: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setAlert({ message: Object.values(errors)[0], type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 2000);
      return;
    }
    setAlert({ message: '', type: '' });
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setAlert({ message: t('contact.form.success'), type: 'success' });
      setTimeout(() => setAlert({ message: '', type: '' }), 2500);
    }, 2000);
  };

  const validateProposal = () => {
    if (!proposalFormData.projectName.trim()) return { projectName: t('contact.proposal.errors.projectName') };
    if (!proposalFormData.clientName.trim()) return { clientName: t('contact.proposal.errors.clientName') };
    if (!proposalFormData.email.trim()) return { email: t('contact.proposal.errors.email') };
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (proposalFormData.email && !emailRegex.test(proposalFormData.email)) {
      return { email: t('contact.proposal.errors.emailInvalid') };
    }
    if (!proposalFormData.phone.trim()) return { phone: t('contact.proposal.errors.phone') };
    if (!proposalFormData.projectType.trim()) return { projectType: t('contact.proposal.errors.projectType') };
    if (!proposalFormData.budget.trim()) return { budget: t('contact.proposal.errors.budget') };
    if (!proposalFormData.timeline.trim()) return { timeline: t('contact.proposal.errors.timeline') };
    if (!proposalFormData.description.trim()) return { description: t('contact.proposal.errors.description') };
    return {};
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    const errors = validateProposal();
    setProposalFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setProposalAlert({ message: Object.values(errors)[0], type: 'error' });
      setTimeout(() => setProposalAlert({ message: '', type: '' }), 2000);
      return;
    }
    setProposalAlert({ message: '', type: '' });
    setIsProposalSubmitting(true);
    setTimeout(() => {
      setIsProposalSubmitting(false);
      setProposalFormData({
        projectName: '',
        clientName: '',
        email: '',
        countryCode: '+90',
        phone: '',
        projectType: '',
        currency: 'TRY',
        budget: '',
        timeline: '',
        description: ''
      });
      setProposalAlert({ message: t('contact.proposal.success'), type: 'success' });
    }, 2000);
  };

  const openProposalModal = () => {
    setShowProposalModal(true);
  };

  const closeProposalModal = () => {
    setShowProposalModal(false);
  };

  // Component içinde, error ve i18n.language değişimini dinle
  useEffect(() => {
    if (error) {
      setError(getTranslatedErrorMessage(error, t, i18n, 'contactEdit.noData'));
    }
  }, [error, t, i18n.language]);

  if (!loading && (!contactData || error)) {
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
            <p className="section-subtitle">{t('contact.subtitle')}</p>
            {error && (
              <div className="mt-8 text-lg text-gray-400 flex justify-center items-center">
                {error}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  if (!contactData) return null;

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: t('contact.info.email'),
      value: contactData.email,
      link: `mailto:${contactData.email}`
    },
    {
      icon: FaMapMarkerAlt,
      title: t('contact.info.location'),
      value: contactData.location,
      link: '#'
    },
    {
      icon: FaGithub,
      title: 'GitHub',
      value: contactData.github.replace('https://', ''),
      link: contactData.github
    }
  ];

  const socialLinks = [
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

        {/* Alert Message */}
        {alert.message && (
          <div className={`fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300
            ${alert.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            style={{ minWidth: 220, textAlign: 'center', opacity: alert.message ? 1 : 0 }}
          >
            {alert.message}
          </div>
        )}

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
              {loading ? (
                <div className="text-gray-400">{t('common.loading')}</div>
              ) : error ? (
                <div className="text-red-400">{error}</div>
              ) : contactData ? (
                contactInfo.map((info, index) => (
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
                ))
              ) : (
                <div className="text-gray-400">{t('contactEdit.noData')}</div>
              )}
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
                {t('workingHours.title')}
              </h4>
              {whLoading ? (
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Yükleniyor...</p>
              ) : whError || !workingHours || (!workingHours.weekdays && !workingHours.weekend) ? (
                <p className="text-sm mb-2 text-gray-400">{t('workingHours.notAdded')}</p>
              ) : (
                <>
                  {workingHours.weekdays && (
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="font-semibold mr-2">{t('workingHours.weekdays')}:</span>
                      {translateDays(workingHours.weekdays, i18n.language, WEEKDAYS)} {workingHours.weekdayStart} - {workingHours.weekdayEnd}
                    </p>
                  )}
                  {workingHours.weekend && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="font-semibold mr-2">{t('workingHours.weekend')}:</span>
                      {translateDays(workingHours.weekend, i18n.language, WEEKEND)} {workingHours.weekendStart} - {workingHours.weekendEnd}
                    </p>
                  )}
                </>
              )}
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
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                        : 'bg-white/80 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-md'
                    }${formErrors.name ? ' border-2 border-red-500' : ''}`}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                  {formErrors.name && <div className="text-red-500 text-xs mt-1">{formErrors.name}</div>}
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
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                        : 'bg-white/80 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-md'
                    }${formErrors.email ? ' border-2 border-red-500' : ''}`}
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                  {formErrors.email && <div className="text-red-500 text-xs mt-1">{formErrors.email}</div>}
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
                  className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                      : 'bg-white/80 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-md'
                  }${formErrors.subject ? ' border-2 border-red-500' : ''}`}
                  placeholder={t('contact.form.subjectPlaceholder')}
                />
                {formErrors.subject && <div className="text-red-500 text-xs mt-1">{formErrors.subject}</div>}
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
                  rows="6"
                  className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 resize-none ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                      : 'bg-white/80 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-md'
                  }${formErrors.message ? ' border-2 border-red-500' : ''}`}
                  placeholder={t('contact.form.messagePlaceholder')}
                />
                {formErrors.message && <div className="text-red-500 text-xs mt-1">{formErrors.message}</div>}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed contact-send-btn"
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
                {/* Proposal Alert Message (inside modal, above form) */}
                {proposalAlert.message && (
                  <div className={`fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300
                    ${proposalAlert.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                    style={{ minWidth: 220, textAlign: 'center', opacity: proposalAlert.message ? 1 : 0 }}
                  >
                    {proposalAlert.message}
                  </div>
                )}
                {isProposalSubmitting && (
                  <div className="fixed top-8 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300 bg-blue-500 text-white"
                    style={{ minWidth: 220, textAlign: 'center' }}>
                    {t('contact.proposal.sending')}
                    <div className="w-full h-1 mt-2 bg-white/30 rounded overflow-hidden">
                      <div
                        className="h-full bg-white/80"
                        style={{ width: `${proposalAlertProgress}%`, transition: 'width 0.2s linear' }}
                      ></div>
                    </div>
                  </div>
                )}
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
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }${proposalFormErrors.projectName ? ' border-2 border-red-500' : ''}`}
                        placeholder={t('contact.proposal.projectNamePlaceholder')}
                      />
                      {proposalFormErrors.projectName && <div className="text-red-500 text-xs mt-1">{proposalFormErrors.projectName}</div>}
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
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }${proposalFormErrors.clientName ? ' border-2 border-red-500' : ''}`}
                        placeholder={t('contact.proposal.clientNamePlaceholder')}
                      />
                      {proposalFormErrors.clientName && <div className="text-red-500 text-xs mt-1">{proposalFormErrors.clientName}</div>}
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
                        type="text"
                        id="email"
                        name="email"
                        value={proposalFormData.email}
                        onChange={handleProposalChange}
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }${proposalFormErrors.email ? ' border-2 border-red-500' : ''}`}
                        placeholder={t('contact.proposal.emailPlaceholder')}
                      />
                      {proposalFormErrors.email && <div className="text-red-500 text-xs mt-1">{proposalFormErrors.email}</div>}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <label htmlFor="phone" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.proposal.phone')} *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        ref={phoneInputRef}
                        value={proposalFormData.phone}
                        onChange={handleProposalChange}
                        inputMode="numeric"
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                        }${proposalFormErrors.phone ? ' border-2 border-red-500' : ''}`}
                        placeholder={t('contact.proposal.phonePlaceholder')}
                        autoComplete="tel"
                      />
                      {proposalFormErrors.phone && <div className="text-red-500 text-xs mt-1">{proposalFormErrors.phone}</div>}
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
                        className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500' 
                            : 'bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500'
                        }${proposalFormErrors.projectType ? ' border-2 border-red-500' : ''}`}
                      >
                        <option value="">{t('contact.proposal.selectProjectType')}</option>
                        <option value="web-development">{t('contact.proposal.webDevelopment')}</option>
                        <option value="mobile-development">{t('contact.proposal.mobileDevelopment')}</option>
                        <option value="desktop-application">{t('contact.proposal.desktopApplication')}</option>
                        <option value="database-design">{t('contact.proposal.databaseDesign')}</option>
                        <option value="api-development">{t('contact.proposal.apiDevelopment')}</option>
                        <option value="other">{t('contact.proposal.other')}</option>
                      </select>
                      {proposalFormErrors.projectType && <div className="text-red-500 text-xs mt-1">{proposalFormErrors.projectType}</div>}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <label htmlFor="budget" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('contact.proposal.budget')} *</label>
                      <div className="relative w-full">
                        <div
                          ref={currencyDropdownRef}
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 pr-2 font-bold cursor-pointer select-none rounded-l-lg ${isDarkMode ? 'bg-gray-800 text-white border border-gray-600' : 'bg-gray-50 text-gray-900 border border-gray-300'}`}
                          style={{ width: 85, borderRight: 'none' }}
                          onClick={() => setCurrencyDropdownOpen(v => !v)}
                        >
                          <span className="mr-1">{currencyOptions.find(opt => opt.value === proposalFormData.currency)?.label}</span>
                          <span style={{ fontSize: '8px' }}>▼</span>
                          {currencyDropdownOpen && (
                            <div
                              className={`absolute left-0 top-full mt-1 w-full rounded-md shadow-lg py-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                              style={{ width: 70 }}
                            >
                              {currencyOptions.map(opt => (
                                <div
                                  key={opt.value}
                                  className={`px-3 py-2 text-sm flex items-center cursor-pointer transition-colors ${
                                    proposalFormData.currency === opt.value
                                      ? isDarkMode
                                        ? 'bg-blue-700/30 text-blue-300'
                                        : 'bg-blue-100 text-blue-700'
                                      : isDarkMode
                                        ? 'text-white hover:bg-gray-700/70'
                                        : 'text-gray-900 hover:bg-gray-100'
                                  }`}
                                  onClick={e => {
                                    e.stopPropagation();
                                    setProposalFormData({ ...proposalFormData, currency: opt.value });
                                    setCurrencyDropdownOpen(false);
                                  }}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <CurrencyInput
                          id="budget"
                          name="budget"
                          value={proposalFormData.budget}
                          decimalsLimit={2}
                          onValueChange={handleBudgetChange}
                          className={`w-full pr-4 py-3 rounded-lg transition-colors duration-300 ${isDarkMode
                            ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
                            : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                          }${proposalFormErrors.budget ? ' border-2 border-red-500' : ''}`}
                          placeholder={t('contact.proposal.budgetPlaceholder')}
                          allowNegative={false}
                          style={{ paddingLeft: 88 }}
                        />
                      </div>
                      {proposalFormErrors.budget && <div className="text-red-500 text-xs mt-1">{proposalFormErrors.budget}</div>}
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
                      className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                      }${proposalFormErrors.timeline ? ' border-2 border-red-500' : ''}`}
                      placeholder={t('contact.proposal.timelinePlaceholder')}
                    />
                    {proposalFormErrors.timeline && <div className="text-red-500 text-xs mt-1">{proposalFormErrors.timeline}</div>}
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
                      rows="6"
                      className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 resize-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                      }${proposalFormErrors.description ? ' border-2 border-red-500' : ''}`}
                      placeholder={t('contact.proposal.descriptionPlaceholder')}
                    />
                    {proposalFormErrors.description && <div className="text-red-500 text-xs mt-1">{proposalFormErrors.description}</div>}
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
                      {t('contact.proposal.send')}
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