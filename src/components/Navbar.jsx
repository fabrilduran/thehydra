// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wider mb-2 md:mb-0">HYDRA 🐺</h1>

        {/* Navegación */}
        <ul className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <li>
            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/buscador" className="hover:text-cyan-400 transition-colors">
              Buscador
            </Link>
          </li>
          <li>
            <Link to="/grafico" className="hover:text-cyan-400 transition-colors">
              Gráfico
            </Link>
          </li>
          <li>
            <Link to="/stockchart" className="hover:text-cyan-400 transition-colors">
              StockChart
            </Link>
          </li>
          <li>
            <Link to="/ticketsearch" className="hover:text-cyan-400 transition-colors">
              TickerSearch
            </Link>
          </li>
          <li>
            <Link to="/oportunidades" className="hover:text-cyan-400 transition-colors">
              Oportunidades
            </Link>
          </li>
          <li>
            <Link to="/simulador" className="hover:text-cyan-400 transition-colors">
              Simulador
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
