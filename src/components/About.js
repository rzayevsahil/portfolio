import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaLaptopCode, FaUsers, FaRocket } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const stats = [
    { icon: FaCode, number: '50+', label: t('about.stats.projects') },
    { icon: FaLaptopCode, number: '3+', label: t('about.stats.experience') },
    { icon: FaUsers, number: '20+', label: t('about.stats.clients') },
    { icon: FaRocket, number: '100%', label: t('about.stats.success') }
  ];

  const experienceItems = [
    {
      year: t('about.experience.current.period'),
      title: t('about.experience.current.title'),
      company: t('about.experience.current.company'),
      description: t('about.experience.current.description')
    },
    {
      year: t('about.experience.previous1.period'),
      title: t('about.experience.previous1.title'),
      company: t('about.experience.previous1.company'),
      description: t('about.experience.previous1.description')
    },
    {
      year: t('about.experience.previous2.period'),
      title: t('about.experience.previous2.title'),
      company: t('about.experience.previous2.company'),
      description: t('about.experience.previous2.description')
    }
  ];

  return (
    <section id="about" className={`section ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="section-subtitle">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('about.greeting')} <span className="text-blue-400">{t('about.developer')}</span>
            </h3>
            
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>{t('about.description1')}</p>
              <p>{t('about.description2')}</p>
              <p>{t('about.description3')}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <button className="btn">
                {t('about.moreInfo')}
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-lg p-6 text-center border ${
                  isDarkMode 
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50' 
                    : 'bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg'
                }`}
              >
                <div className="text-blue-400 mb-3 flex justify-center">
                  <stat.icon size={32} />
                </div>
                <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.number}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className={`text-2xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('about.experience.title')}
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
            
            <div className="space-y-12">
              {experienceItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`rounded-lg p-6 border ${
                      isDarkMode 
                        ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50' 
                        : 'bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg'
                    }`}>
                      <div className="text-blue-400 font-semibold mb-2">{item.year}</div>
                      <h4 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                      <div className="text-purple-400 mb-2">{item.company}</div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 