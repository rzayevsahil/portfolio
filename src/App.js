import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Blog from './components/Blog';
import ArticleDetail from './components/ArticleDetail';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BlogList from './components/BlogList';
import AdminPanel from './components/AdminPanel';
import AdminLayout from './layouts/AdminLayout';
import EditProfile from './pages/admin/EditProfile';
import EditContact from './pages/admin/EditContact';
import AddArticle from './pages/admin/AddArticle';
import MediumEditor from './pages/admin/MediumEditor';
import './i18n';

function HomePage() {
  useEffect(() => {
    const scrollToHash = () => {
    if (window.location.hash) {
        let count = 0;
        const maxTries = 10;
        const tryScroll = () => {
      const el = document.querySelector(window.location.hash);
      if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          } else if (count < maxTries) {
            count++;
            setTimeout(tryScroll, 100);
      }
        };
        tryScroll();
      }
    };

    window.addEventListener('hashchange', scrollToHash);
    scrollToHash();

    return () => {
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Blog />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: 50,
            height: 50,
            border: '3px solid var(--accent-primary)',
            borderTop: '3px solid transparent',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminPanel />} />
                <Route path="add-article" element={<AddArticle />} />
                <Route path="profile" element={<EditProfile />} />
                <Route path="contact" element={<EditContact />} />
                <Route path="medium" element={<MediumEditor />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 