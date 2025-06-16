import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import VolverInicio from "./VolverInicio";
import { fetchStockData } from "../utils/fetchStockData"; // ✅ Ruta corregida

const StockChart = () => {
  const [ticker, setTicker] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!ticker.trim()) {
      setError("Ingresá un ticker válido.");
      return;
    }

    try {
      const result = await fetchStockData(ticker.trim().toUpperCase());
      if (result && result.length > 0) {
        setData(result);
        setError("");
      } else {
        setData([]);
        setError("No se encontraron datos para ese ticker.");
      }
    } catch (err) {
      setData([]);
      setError("Ocurrió un error al obtener los datos.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">📈 Gráfico Personalizado</h2>

      <div className="flex gap-2 mb-4 justify-center">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ingresá un ticker (Ej: AAPL)"
          className="border p-2 rounded w-full max-w-xs"
          autoFocus
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        !error && <p className="text-center">No hay datos para mostrar.</p>
      )}

      <div className="mt-4 text-center">
        <VolverInicio />
      </div>
    </div>
  );
};

export default StockChart;
