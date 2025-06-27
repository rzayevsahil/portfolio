import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaDatabase,
  FaGitAlt, FaDocker, FaAws, FaFigma, FaPython, FaJava
} from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiPostgresql, SiTailwindcss, SiNextdotjs, SiCsharp, SiDotnet, SiAngular, SiMicrosoftazure, SiRedis, SiElasticsearch, SiRabbitmq, SiTensorflow } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Skills = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const skillCategories = [
    {
      title: t('skills.backend'),
      skills: [
        { name: 'C#', icon: SiCsharp, level: 95, color: '#239120' },
        { name: '.NET Core', icon: SiDotnet, level: 92, color: '#512BD4' },
        { name: 'ASP.NET Core', icon: SiDotnet, level: 90, color: '#512BD4' },
        { name: 'Web API', icon: SiDotnet, level: 88, color: '#512BD4' },
        { name: 'MVC', icon: SiDotnet, level: 85, color: '#512BD4' },
        { name: 'Entity Framework', icon: SiDotnet, level: 85, color: '#512BD4' },
        { name: 'RESTful APIs', icon: FaDatabase, level: 90, color: '#FFD700' }
      ]
    },
    {
      title: t('skills.frontend'),
      skills: [
        { name: 'HTML5', icon: FaHtml5, level: 90, color: '#E34F26' },
        { name: 'CSS3', icon: FaCss3Alt, level: 85, color: '#1572B6' },
        { name: 'JavaScript', icon: FaJs, level: 80, color: '#F7DF1E' },
        { name: 'Angular', icon: SiAngular, level: 75, color: '#DD0031' },
        { name: 'Razor', icon: SiDotnet, level: 80, color: '#512BD4' },
        { name: 'TypeScript', icon: SiTypescript, level: 70, color: '#3178C6' }
      ]
    },
    {
      title: t('skills.tools'),
      skills: [
        { name: 'SQL Server', icon: FaDatabase, level: 90, color: '#CC2927' },
        { name: 'PostgreSQL', icon: SiPostgresql, level: 80, color: '#336791' },
        { name: 'Redis', icon: SiRedis, level: 75, color: '#DC382D' },
        { name: 'ElasticSearch', icon: SiElasticsearch, level: 70, color: '#FED10A' },
        { name: 'Docker', icon: FaDocker, level: 80, color: '#2496ED' },
        { name: 'Azure', icon: SiMicrosoftazure, level: 75, color: '#0078D4' },
        { name: 'RabbitMQ', icon: SiRabbitmq, level: 70, color: '#FF6600' },
        { name: 'Git', icon: FaGitAlt, level: 85, color: '#F05032' }
      ]
    }
  ];

  return (
    <section id="skills" className={`section ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-100'}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('skills.title')}</h2>
          <p className="section-subtitle">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className={`text-2xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {category.title}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.2) + (skillIndex * 0.1), duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className={`rounded-lg p-6 border ${
                      isDarkMode 
                        ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50' 
                        : 'bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div 
                        className="mr-3"
                        style={{ color: skill.color }}
                      >
                        <skill.icon size={24} />
                      </div>
                      <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {skill.name}
                      </h4>
                    </div>
                    
                    <div className="mb-2">
                      <div className={`flex justify-between text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>{t('skills.level')}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ delay: (categoryIndex * 0.2) + (skillIndex * 0.1) + 0.3, duration: 1 }}
                          viewport={{ once: true }}
                          className="h-2 rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${skill.color} 0%, ${skill.color}80 100%)`,
                            boxShadow: `0 0 10px ${skill.color}40`
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className={`text-2xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('skills.otherSkills')}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Microservices', 'Clean Architecture', 'Hangfire', 'CI/CD',
              'GitHub Actions', 'Azure DevOps', 'Windows Forms', 'FastReport',
              'Performance Optimization', 'Database Design', 'API Design', 'Unit Testing'
            ].map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (index * 0.05), duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-lg p-4 text-center border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800/30 backdrop-blur-sm border-gray-700/30 hover:border-blue-500/50' 
                    : 'bg-white/60 backdrop-blur-sm border-gray-200/60 hover:border-blue-500/50 shadow-md'
                }`}
              >
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className={`rounded-lg p-8 border ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('skills.learning.title')}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('skills.learning.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {t('skills.learning.areas', { returnObjects: true }).map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + (index * 0.1), duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    isDarkMode 
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                      : 'bg-blue-100 text-blue-700 border-blue-300'
                  }`}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills; 