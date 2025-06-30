import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaDatabase, FaMicrophone, FaPills, FaJava } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiTailwindcss, SiCsharp, SiDotnet, SiPython, SiTensorflow } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const projects = [
    {
      id: 1,
      title: 'Database Query Application with Voice Commands',
      description: 'Developed a Turkish voice interface that converts spoken queries into SQL using BERT-based NLP. Enabled natural language database interaction without SQL knowledge. Technologies: Python, BERT, Speech-to-Text, SQL.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      technologies: ['Python', 'BERT', 'Speech-to-Text', 'SQL', 'NLP'],
      category: 'ai',
      github: 'https://github.com/rzayevsahil',
      live: 'https://dergipark.org.tr',
      featured: true,
      period: '09/2022 - 05/2023'
    },
    {
      id: 2,
      title: 'Pharmacy Automation System',
      description: 'Built a WinForms-based pharmacy management system with role-based access and inventory tracking. Features include user management, inventory control, and reporting capabilities.',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
      technologies: ['C#', 'WinForms', 'SQL Server', 'ADO.NET'],
      category: 'desktop',
      github: 'https://github.com/rzayevsahil',
      live: '#',
      featured: true,
      period: '08/2022 - 09/2022'
    },
    {
      id: 3,
      title: 'Restaurant Automation Solution',
      description: 'Developed a restaurant automation solution featuring dual-screen functionality for cashier and customer interactions. Enabled real-time order management via RESTful APIs, improving efficiency.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      technologies: ['Angular', 'Java', 'Spring Boot', 'TypeScript', 'RxJS'],
      category: 'fullstack',
      github: 'https://github.com/rzayevsahil',
      live: '#',
      featured: false,
      period: '02/2022 - 12/2022'
    },
    {
      id: 4,
      title: 'Modular Web Applications',
      description: 'Developed modular web applications using ASP.NET Core and Angular JS. Built reusable UI components and implemented client-side filtering logic. Created dynamic reports with FastReport.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      technologies: ['ASP.NET Core', 'Angular JS', 'FastReport', 'SQL Server'],
      category: 'fullstack',
      github: 'https://github.com/rzayevsahil',
      live: '#',
      featured: false,
      period: '06/2023 - 04/2025'
    },
    {
      id: 5,
      title: 'RESTful API Development',
      description: 'Designed and implemented RESTful APIs for various business applications. Optimized SQL queries for performance and implemented proper error handling and logging.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      technologies: ['ASP.NET Core', 'Web API', 'Entity Framework', 'SQL Server'],
      category: 'backend',
      github: 'https://github.com/rzayevsahil',
      live: '#',
      featured: false,
      period: '06/2023 - 04/2025'
    },
    {
      id: 6,
      title: 'Dynamic Reporting System',
      description: 'Created dynamic reports with FastReport, including sub-report support. Implemented complex data visualization and export functionality for business intelligence.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      technologies: ['FastReport', 'C#', 'SQL Server', 'ASP.NET Core'],
      category: 'backend',
      github: 'https://github.com/rzayevsahil',
      live: '#',
      featured: false,
      period: '06/2023 - 04/2025'
    }
  ];

  const filters = [
    { id: 'all', label: t('projects.filters.all') },
    { id: 'fullstack', label: t('projects.filters.fullstack') },
    { id: 'backend', label: t('projects.filters.backend') },
    { id: 'ai', label: 'AI/ML' },
    { id: 'desktop', label: 'Desktop' }
  ];

  const getTechnologyIcon = (tech) => {
    const icons = {
      'C#': SiCsharp,
      'ASP.NET Core': SiDotnet,
      'Python': SiPython,
      'BERT': SiTensorflow,
      'Angular': FaReact,
      'SQL Server': FaDatabase,
      'WinForms': SiCsharp,
      'FastReport': SiDotnet,
      'Java': FaJava,
      'Spring Boot': FaJava,
      'TypeScript': SiTypescript,
      'RxJS': FaReact,
      'Entity Framework': SiDotnet,
      'Web API': SiDotnet,
      'ADO.NET': SiDotnet,
      'NLP': SiTensorflow,
      'Speech-to-Text': FaMicrophone,
      'SQL': FaDatabase
    };
    return icons[tech] || FaDatabase;
  };

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="projects" className={`section ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('projects.title')}</h2>
          <p className="section-subtitle">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-blue-500 text-white'
                  : isDarkMode 
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                    : 'bg-white/80 text-gray-700 hover:bg-gray-100/80 shadow-md'
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className={`rounded-lg overflow-hidden border transition-all duration-120 ${
                  project.featured ? 'ring-2 ring-blue-500/30' : ''
                } ${
                  isDarkMode 
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50' 
                    : 'bg-white/80 backdrop-blur-sm border-gray-200/50 hover:border-blue-500/50 shadow-lg'
                }`}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-120 hover:scale-110"
                  />
                  {project.featured && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {t('projects.featured')}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-gray-800/80 text-white px-2 py-1 rounded text-xs">
                    {project.period}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-120 flex items-center justify-center space-x-4">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                    >
                      <FaGithub size={20} />
                    </motion.a>
                    {project.live !== '#' && (
                      <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                      >
                        <FaExternalLinkAlt size={20} />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => {
                      const Icon = getTechnologyIcon(tech);
                      return (
                        <div
                          key={tech}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
                            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                          }`}
                        >
                          <Icon size={12} className="text-blue-400" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{tech}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center py-2 px-4 rounded-lg transition-colors duration-300 text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700/50 hover:bg-gray-600/50 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {t('projects.github')}
                    </a>
                    {project.live !== '#' && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 text-center py-2 px-4 rounded-lg transition-colors duration-300 text-sm ${
                          isDarkMode 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {t('projects.liveDemo')}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className={`rounded-lg p-8 border ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('projects.moreProjects.title')}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('projects.moreProjects.description')}
            </p>
            <motion.a
              href="https://github.com/rzayevsahil"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <FaGithub size={20} />
              <span>{t('projects.moreProjects.button')}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 