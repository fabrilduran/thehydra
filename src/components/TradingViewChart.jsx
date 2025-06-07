import React, { useEffect, useRef, useState } from 'react';
import VolverInicio from './VolverInicio';

function TradingViewChart({ symbol = "NASDAQ:AAPL" }) {
  const containerRef = useRef(null);
  const [reloadKey, setReloadKey] = useState(0); // Para forzar reinicio del gráfico

  useEffect(() => {
    const scriptId = "tradingview-widget-script";

    // Función para crear el widget
    const createWidget = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'es',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: 'tradingview-container',
          drawings_access: {
            type: 'all',
            tools: [{ name: "trend_line" }, { name: "horizontal_line" }]
          }
        });
      }
    };

    // Cargar script si no está
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = createWidget;
    } else {
      createWidget();
    }
  }, [symbol, reloadKey]); // Se vuelve a ejecutar cuando cambia reloadKey

  const handleLimpiarGrafico = () => {
    // Reinicia el gráfico forzando el re-render
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Gráfico Avanzado (TradingView)</h2>

      <div className="flex justify-end mb-2">
        <button
          onClick={handleLimpiarGrafico}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
        >
          Limpiar gráfico
        </button>
      </div>

      <div id="tradingview-container" style={{ height: '500px' }} ref={containerRef}></div>

      <div className="mt-6">
        <VolverInicio />
      </div>
    </div>
  );
}

export default TradingViewChart;
