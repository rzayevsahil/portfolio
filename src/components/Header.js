import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('#home');
  const [isNavLocked, setIsNavLocked] = useState(false);
  const observerRef = useRef(null);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sectionIds = ['#home', '#about', '#skills', '#projects', '#blog', '#contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      let currentSection = '#home';
      for (let i = 0; i < sectionIds.length; i++) {
        const section = document.querySelector(sectionIds[i]);
        if (section && section.offsetTop <= scrollY) {
          currentSection = sectionIds[i];
        }
      }
      setActiveNav(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // ilk yüklemede de çalışsın
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const validSections = ['#home', '#about', '#skills', '#projects', '#blog', '#contact'];
    let lockTimeout;
    const setActiveFromHash = () => {
      if (validSections.includes(window.location.hash)) {
        setActiveNav(window.location.hash);
        setIsNavLocked(true);
        clearTimeout(lockTimeout);
        lockTimeout = setTimeout(() => setIsNavLocked(false), 1200);
      }
    };
    setActiveFromHash();
    window.addEventListener('hashchange', setActiveFromHash);
    return () => {
      window.removeEventListener('hashchange', setActiveFromHash);
      clearTimeout(lockTimeout);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), href: '#home', path: '/' },
    { name: t('nav.about'), href: '#about', path: '/' },
    { name: t('nav.skills'), href: '#skills', path: '/' },
    { name: t('nav.projects'), href: '#projects', path: '/' },
    { name: t('nav.blog'), href: '#blog', path: '/' },
    { name: t('nav.contact'), href: '#contact', path: '/' }
  ];

  const scrollToSection = (href, path) => {
    setActiveNav(href);
    setIsNavLocked(true);
    window.location.hash = href;
    setTimeout(() => setIsNavLocked(false), 1000);
    if (location.pathname !== path) {
      navigate(path);
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? (isDarkMode
              ? 'bg-[#181e29]/40 shadow-lg backdrop-blur-xl'
              : 'bg-white/40 shadow-lg backdrop-blur-xl')
          : (isDarkMode
              ? 'bg-transparent'
              : 'bg-transparent')
        }`
      }
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center h-16 ${isAdmin ? 'justify-end' : 'justify-between'}`}>
          {/* Sadece admin panelinde: sadece ThemeToggle ve dil seçici */}
          {isAdmin ? (
            <div className="flex items-center space-x-4">
              <ThemeToggle className="focus:outline-none focus:ring-0 active:outline-none active:ring-0 shadow-none border-none" />
              {/* Dil seçici ThemeToggle içinde */}
            </div>
          ) : (
            <>
              <div className="flex items-center w-full justify-between">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  <Link to="/" className="flex items-center gap-2">
                    <Logo className="h-10 w-auto" />
                  </Link>
                </motion.div>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  {navItems.map((item, index) => {
                    const isActive = activeNav === item.href;
                    return (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => scrollToSection(item.href, item.path)}
                        className={`nav-underline-hover transition-colors duration-300${isActive ? ' active' : ''} ${
                          isDarkMode 
                            ? 'text-gray-300 hover:text-white' 
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {item.name}
                      </motion.button>
                    );
                  })}
                  {/* Theme Toggle */}
                  <ThemeToggle className="focus:outline-none focus:ring-0 active:outline-none active:ring-0 shadow-none border-none" />
                </nav>
              </div>
              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle className="focus:outline-none focus:ring-0 active:outline-none active:ring-0 shadow-none border-none" />
                <button
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-white hover:bg-gray-800/50' 
                      : 'text-gray-700 hover:bg-gray-200/50'
                  }`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </>
          )}
        </div>
        {/* Mobile Navigation */}
        {!isAdmin && isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden rounded-lg mt-2 ${
              isDarkMode 
                ? 'bg-black/90 backdrop-blur-md border border-gray-700/50' 
                : 'bg-white/90 backdrop-blur-md border border-gray-200/50'
            }`}
          >
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href, item.path)}
                  className={`block w-full text-left py-2 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header; 