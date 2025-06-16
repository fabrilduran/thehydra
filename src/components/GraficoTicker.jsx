// src/componentes/GraficoTicker.jsx
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import VolverInicio from './VolverInicio';
import { fetchStockData } from '../utils/fetchStockData';


const GraficoTicker = () => {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    setError('');
    if (!ticker) return;

    const stock = await fetchStockData(ticker.toUpperCase());
    if (!stock || !stock.length) {
      setError(`No se encontraron datos para el ticker: ${ticker}`);
      setData([]);
      return;
    }

    setData(stock);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        📈 Gráfico de Precios
      </h2>

      {/* Buscador de ticker */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Ej: AAPL"
          className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={cargarDatos}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Mostrar Gráfico
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {data.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>No hay datos disponibles para mostrar el gráfico.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis domain={['auto', 'auto']} stroke="#8884d8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                border: '1px solid #ccc',
              }}
              labelStyle={{ color: '#333' }}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="mt-6">
        <VolverInicio />
      </div>
    </div>
  );
};

export default GraficoTicker;
