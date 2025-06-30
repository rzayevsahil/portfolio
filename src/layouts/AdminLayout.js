import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaFileAlt, FaEnvelope } from 'react-icons/fa';

const menuItems = [
  { to: '/admin/add-article', label: 'Makale Ekle', icon: <FaFileAlt /> },
  { to: '/admin/profile', label: 'Profil Bilgileri', icon: <FaUser /> },
  { to: '/admin/contact', label: 'İletişim Bilgileri', icon: <FaEnvelope /> },
];

const HamburgerIcon = ({ open }) => (
  <motion.div className="relative w-6 h-6 flex flex-col items-center justify-center" initial={false} animate={open ? 'open' : 'closed'}>
    <motion.span
      className="absolute h-0.5 w-6 bg-current rounded"
      variants={{
        closed: { rotate: 0, y: -7 },
        open: { rotate: 45, y: 0 }
      }}
      transition={{ duration: 0.4 }}
    />
    <motion.span
      className="absolute h-0.5 w-6 bg-current rounded"
      variants={{
        closed: { opacity: 1, scaleX: 1 },
        open: { opacity: 0, scaleX: 0 }
      }}
      transition={{ duration: 0.4 }}
    />
    <motion.span
      className="absolute h-0.5 w-6 bg-current rounded"
      variants={{
        closed: { rotate: 0, y: 7 },
        open: { rotate: -45, y: 0 }
      }}
      transition={{ duration: 0.4 }}
    />
  </motion.div>
);

const AdminLayout = () => {
  const { isDarkMode } = useTheme();
  const [open, setOpen] = useState(true);
  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: open ? 256 : 64 }}
        transition={{ duration: 0.4 }}
        className={`flex-shrink-0 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white'} rounded-r-2xl shadow-lg flex flex-col gap-4 p-4 relative`}
        style={{ width: open ? 256 : 64, minWidth: 0 }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          className={`absolute z-50 w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 shadow-lg bg-white transition-all duration-200 ${open ? 'top-5 -right-3' : 'top-5 left-1/2 -translate-x-1/2'}`}
          style={{ background: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#222', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          <HamburgerIcon open={open} />
        </button>
        <div className={`flex items-center ${open ? 'mb-6 justify-center' : 'mb-6 justify-center'}`} style={{ minHeight: 48 }}>
          {open && <span className="text-3xl font-mono font-bold text-gray-400">&gt;_</span>}
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold ml-2 align-middle"
                style={{ color: isDarkMode ? '#fff' : '#1a2233' }}
              >
                Sahil Rzayev
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <nav className={`flex flex-col gap-3 mt-4`}>
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center py-2 rounded-lg font-medium transition-colors duration-200
                ${open ? 'gap-3 px-4 justify-start w-full' : 'gap-0 px-0 justify-center w-auto'}
                ${isActive ? 'bg-blue-600 text-white' : isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <div className={`flex items-center h-10 min-h-[40px] ${open ? 'gap-3 pl-1 justify-start w-full' : 'justify-center w-auto'}`}>
                <span className="w-6 min-w-[24px] flex items-center justify-center">{item.icon}</span>
                {open && (
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block' }}
                >
                  {item.label}
                </motion.span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>
      </motion.aside>
      {/* Main Content */}
      <main className="flex-1 p-8" style={{ marginTop: '64px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 