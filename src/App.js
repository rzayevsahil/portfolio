import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import EditWorkingHours from './pages/admin/EditWorkingHours';
import BlogManagement from './pages/admin/BlogManagement';
import Login from './pages/admin/Login';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import GlobalLoader from './components/GlobalLoader';
import NotFound from './components/NotFound';
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

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
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
    <LoadingProvider>
      <ThemeProvider>
        <GlobalLoaderWrapper />
        <LanguageProvider>
          <Router>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/*" element={
                  <PrivateRoute>
                    <Routes>
                      <Route path="" element={<AdminLayout />}>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="add-article" element={<AddArticle />} />
                        <Route path="blog-management" element={<BlogManagement />} />
                        <Route path="profile" element={<EditProfile />} />
                        <Route path="contact" element={<EditContact />} />
                        <Route path="medium" element={<MediumEditor />} />
                        <Route path="working-hours" element={<EditWorkingHours />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </LoadingProvider>
  );
}

function GlobalLoaderWrapper() {
  const { globalLoading } = useLoading();
  return <GlobalLoader show={globalLoading} />;
}

export default App; 