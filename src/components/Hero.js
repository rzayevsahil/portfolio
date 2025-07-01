import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaArrowDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import profileImg from '../assets/profile.jpg';
import { SiReact, SiNodedotjs, SiJavascript, SiPython, SiCsharp, SiDotnet } from 'react-icons/si';

const Hero = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const scrollToAbout = () => {
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const el = document.querySelector('#projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Typewriter animasyonu için iki ayrı satır
  const greeting = t('hero.greeting');
  const name = t('hero.title');
  const [typedGreeting, setTypedGreeting] = useState('');
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    setTypedGreeting('');
    setTypedName('');
    let i = 0;
    let j = 0;
    const typeGreeting = () => {
      if (i <= greeting.length) {
        setTypedGreeting(greeting.slice(0, i));
        i++;
        setTimeout(typeGreeting, 110);
      } else {
        typeName();
      }
    };
    const typeName = () => {
      if (j <= name.length) {
        setTypedName(name.slice(0, j));
        j++;
        setTimeout(typeName, 110);
      }
    };
    typeGreeting();
    // cleanup
    return () => {
      setTypedGreeting(greeting);
      setTypedName(name);
    };
    // eslint-disable-next-line
  }, [greeting, name]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative w-full h-full">
        {/* Animasyonlu gradient arka plan */}
        <div className="hero-animated-bg"></div>
        {/* Yazılım temalı hareketli kod satırı efektleri */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="animate-move-code absolute left-4 top-8 hero-code-green font-mono text-lg select-none">
            {'function helloWorld() { ... }'}
          </div>
          <div className="animate-move-code-alt absolute right-8 top-16 hero-code-blue font-mono text-base select-none">
            {'<div>AI & Software</div>'}
          </div>
          <div className="animate-move-code absolute left-8 bottom-8 hero-code-pink font-mono text-base select-none">
            {'0101010101010101'}
          </div>
          <div className="animate-move-code-alt absolute right-4 bottom-12 hero-code-green font-mono text-lg select-none">
            {'console.log("Hello!")'}
          </div>
          <div className={`animate-icon-bounce absolute left-8 top-1/2 ${isDarkMode ? 'text-blue-400 opacity-40' : 'text-blue-700 opacity-70'} text-5xl`}>
            <SiReact />
          </div>
          <div className={`animate-icon-bounce-alt absolute right-8 top-1/3 ${isDarkMode ? 'text-green-400 opacity-40' : 'text-green-700 opacity-70'} text-5xl`}>
            <SiNodedotjs />
          </div>
          <div className={`animate-icon-bounce absolute left-1/4 bottom-8 ${isDarkMode ? 'text-yellow-400 opacity-40' : 'text-yellow-600 opacity-70'} text-5xl`}>
            <SiJavascript />
          </div>
          <div className={`animate-icon-bounce-alt absolute right-1/4 bottom-8 ${isDarkMode ? 'text-blue-300 opacity-40' : 'text-blue-700 opacity-70'} text-5xl`}>
            <SiPython />
          </div>
          <div className={`animate-icon-bounce absolute left-1/2 top-8 ${isDarkMode ? 'text-purple-400 opacity-40' : 'text-purple-700 opacity-70'} text-5xl`}>
            <SiCsharp />
          </div>
          <div className={`animate-icon-bounce-alt absolute right-1/2 bottom-4 ${isDarkMode ? 'text-gray-400 opacity-40' : 'text-gray-700 opacity-70'} text-5xl`}>
            <SiDotnet />
          </div>
        </div>
        {/* Background Gradient */}
        {/* <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20' 
            : 'bg-gradient-to-br from-blue-100/50 via-purple-100/50 to-pink-100/50'
        }`}></div> */}
        {/* Profile Photo Background */}
        <img
          src={profileImg}
          alt="Sahil Rzayev"
          className={`absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/3 w-[340px] h-[340px] md:w-[520px] md:h-[520px] rounded-full object-cover z-0 pointer-events-none select-none shadow-2xl ${isDarkMode ? 'opacity-70' : 'opacity-85'}`}
          style={{ filter: 'blur(0.5px)' }}
        />
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{
              duration: 20,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
            className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl ${
              isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/20'
            }`}
          />
          <motion.div
            animate={{
              scale: [2, 1, 1, 2, 2],
              rotate: [0, 270, 270, 0, 0],
              borderRadius: ["50%", "50%", "20%", "20%", "50%"],
            }}
            transition={{
              duration: 20,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
            className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl ${
              isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/20'
            }`}
          />
        </div>
        {/* Main Hero Content */}
        <div className="container mx-auto px-4 text-center relative z-10 mt-40 md:mt-56">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {typedGreeting}
              </span>
              <br />
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {typedName}
                <span className="inline-block w-2 h-7 align-middle animate-pulse ml-1" style={{verticalAlign:'-0.2em'}}></span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary text-lg px-8 py-4"
                onClick={scrollToProjects}
              >
                {t('hero.cta')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary text-lg px-8 py-4"
              >
                {t('hero.downloadCV')}
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('#blog').scrollIntoView({ behavior: 'smooth' })}
                className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50' 
                    : 'bg-white/50 text-gray-700 hover:bg-gray-100/50 hover:text-gray-900 border border-gray-200/50 shadow-lg'
                }`}
              >
                <span>{t('hero.blogButton')}</span>
              </motion.button>
            </motion.div>
          </motion.div>
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.button
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={scrollToAbout}
              className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaArrowDown size={24} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 