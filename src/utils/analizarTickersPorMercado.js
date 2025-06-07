// src/utils/analizarTickersPorMercado.js
import { fetchStockData } from '../services/fetchStockData'; // BIEN
// Lista predefinida de tickers por mercado
const mercados = {
  usa: ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMZN'],
  argentina: ['GGAL.BA', 'YPFD.BA', 'BMA.BA', 'CEPU.BA', 'PAMP.BA']
};

// Esta función analiza automáticamente los tickers según el mercado seleccionado
const analizarTickersPorDefecto = async (mercado = 'usa') => {
  const tickers = mercados[mercado.toLowerCase()] || mercados.usa;
  const resultados = [];

  for (const ticker of tickers) {
    try {
      const data = await fetchStockData(ticker);

      if (!data || !data.technicalAnalysis) continue;

      const { signal, close, resistance, support } = data.technicalAnalysis;

      // Si está cerca de punto de entrada o salida (~1.5%)
      const margen = 0.015;
      if (
        (signal === 'buy' && close >= support && close <= support * (1 + margen)) ||
        (signal === 'sell' && close <= resistance && close >= resistance * (1 - margen))
      ) {
        resultados.push({
          ticker,
          signal,
          close,
          support,
          resistance,
          motivo: `Se detectó señal técnica (${signal}) cercana al punto de ${signal === 'buy' ? 'entrada' : 'salida'}`
        });
      }
    } catch (error) {
      console.error(`Error analizando ${ticker}:`, error.message);
    }
  }

  return resultados;
};

export default analizarTickersPorDefecto;
