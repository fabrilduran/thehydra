import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY_FINNHUB;

export const obtenerTickersPorSector = async (sectorCodigo, mercado) => {
  if (mercado === 'USA') {
    try {
      const res = await axios.get('https://finnhub.io/api/v1/stock/symbol', {
        params: {
          exchange: 'US',
          token: API_KEY,
        },
      });

      const tickers = res.data
        .filter(stock => stock.finnhubIndustry?.toLowerCase() === sectorCodigo.toLowerCase())
        .slice(0, 30)
        .map(stock => stock.symbol);

      return tickers;

    } catch (error) {
      console.error(`❌ Error obteniendo tickers de USA para sector ${sectorCodigo}:`, error.message);
      return [];
    }
  }

  if (mercado === 'Argentina') {
    const sectoresAR = {
      tecnologia: ['CEPU.BA', 'CTIO.BA'],
      energia: ['PAMP.BA', 'YPF.BA'],
      finanzas: ['GGAL.BA', 'BMA.BA'],
      salud: ['RICH.BA', 'CADO.BA'],
      consumo: ['MOLA.BA', 'AGRO.BA'],
      industria: ['TXAR.BA', 'FERR.BA'],
      telecomunicaciones: ['TECO2.BA'],
    };

    return sectoresAR[sectorCodigo.toLowerCase()] || [];
  }

  return [];
};
