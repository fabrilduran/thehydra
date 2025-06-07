// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import ThemeToggle from './ThemeToggle'; // ✅ Opcional si querés cambiar el tema global
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white relative">
      <Navbar />
      <ThemeToggle /> {/* ✅ Aparece arriba a la derecha en todas las pantallas privadas */}
      <main className="p-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
