// src/components/TickerSearch.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { fetchStockData } from "../services/fetchStockData"; // ✅ Ruta corregida
import VolverInicio from './VolverInicio';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TickerSearch = () => {
  const { symbol } = useParams();
  const [chartData, setChartData] = useState(null);
  const [ticker, setTicker] = useState(symbol || "AAPL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    setTicker(symbol);
  }, [symbol]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchStockData(ticker); // ✅ Usa la función default exportada
      if (!data || data.length === 0) {
        console.error("Datos inválidos recibidos para", ticker);
        setChartData(null);
        setLoading(false);
        return;
      }

      const fechas = data.map(d => d.date);
      const precios = data.map(d => d.close);

      setChartData({
        labels: fechas,
        datasets: [
          {
            label: `Precio de ${ticker}`,
            data: precios,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
            fill: false
          }
        ]
      });
      setLoading(false);
    };

    loadData();
  }, [ticker]);

  if (loading) {
    return (
      <div className="p-4">
        <p>Cargando datos para <strong>{ticker}</strong>...</p>
        <VolverInicio />
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="p-4">
        <p>No hay datos disponibles para el ticker: <strong>{ticker}</strong></p>
        <VolverInicio />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gráfico de {ticker}</h2>
      <div className="bg-white p-4 rounded shadow">
        <Line data={chartData} />
      </div>
      <div className="mt-4">
        <VolverInicio />
      </div>
    </div>
  );
};

export default TickerSearch;
