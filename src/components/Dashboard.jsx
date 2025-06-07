import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

import BuscadorTicker from './BuscadorTicker';
import GraficoTicker from './GraficoTicker';
import StockChart from './StockChart';
import TickerSearch from './TickerSearch'; // ✅ corregido nombre
import SimuladorInversion from './SimuladorInversion';
import TradingViewChart from './TradingViewChart';
import Favoritos from './Favoritos';
import BuscadorOportunidades from './BuscadorOportunidades';
import VolverInicio from './VolverInicio';

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [resultadosAuto, setResultadosAuto] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const analizar = async () => {
      try {
        const { default: analizarTickersPorDefecto } = await import('../utils/analizarTickersPorMercado');
        const resultados = await analizarTickersPorDefecto();
        console.log('Análisis automático al ingresar al Dashboard:', resultados);
        setResultadosAuto(resultados);
      } catch (error) {
        console.error('Error al analizar tickers automáticamente:', error);
      }
    };

    analizar();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* Botones superiores */}
      <div className="flex justify-end px-4 py-2 space-x-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-gray-300 dark:bg-gray-700 text-sm px-4 py-2 rounded shadow hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          {isDarkMode ? 'Modo Claro ☀️' : 'Modo Oscuro 🌙'}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded shadow transition"
        >
          Salir
        </button>
      </div>

      {/* Bienvenida */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold">Bienvenido a HYDRA</h1>
        <p className="text-gray-600 dark:text-gray-400">Tu asistente financiero personal para el análisis de acciones</p>
      </div>

      {/* Índices principales */}
      <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow mb-8 mx-4">
        <h2 className="text-xl font-semibold mb-2 text-center">Índices Principales</h2>
        <iframe
          src="https://s.tradingview.com/embed-widget/indices/?locale=es&theme=dark&style=1&width=100%25&height=400"
          width="100%"
          height="400"
          frameBorder="0"
          allowTransparency="true"
          scrolling="no"
        ></iframe>
      </div>

      {/* Módulos funcionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-16">
        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Buscador de Tickers</h2>
          <BuscadorTicker />
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Gráfico Personalizado</h2>
          <GraficoTicker />
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Gráfico con Recharts</h2>
          <StockChart />
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Búsqueda Avanzada</h2>
          <TickerSearch />
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Simulador de Inversión</h2>
          <SimuladorInversion />
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">🐺 Tus Favoritos</h2>
          <Favoritos />
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Análisis AAPL</h2>
          <TradingViewChart symbol="NASDAQ:AAPL" />
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Buscador de Oportunidades</h2>
          <BuscadorOportunidades />
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">📈 Señales Técnicas Detectadas</h2>
          {resultadosAuto.length > 0 ? (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {resultadosAuto.map((r) => (
                <li key={r.ticker} className="border-b border-gray-500 pb-2">
                  <strong>{r.ticker}</strong> — {r.signalDescription || 'Señal cercana'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No se detectaron señales por el momento.</p>
          )}
        </div>
      </div>

      {/* Botón volver arriba */}
      <div className="text-center mb-8">
        <VolverInicio />
      </div>
    </div>
  );
}

export default Dashboard;
