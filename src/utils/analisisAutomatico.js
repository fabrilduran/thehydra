import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY_FINNHUB;

// --- Funciones técnicas ---
const calcularEMA = (precios, periodo) => {
  const k = 2 / (periodo + 1);
  let ema = precios[0];
  for (let i = 1; i < precios.length; i++) {
    ema = precios[i] * k + ema * (1 - k);
  }
  return ema;
};

const calcularRSI = (precios) => {
  const ganancias = [];
  const perdidas = [];

  for (let i = 1; i < precios.length; i++) {
    const cambio = precios[i] - precios[i - 1];
    if (cambio >= 0) ganancias.push(cambio);
    else perdidas.push(Math.abs(cambio));
  }

  const avgGanancia = ganancias.slice(-14).reduce((a, b) => a + b, 0) / 14;
  const avgPerdida = perdidas.slice(-14).reduce((a, b) => a + b, 0) / 14;
  const rs = avgGanancia / (avgPerdida || 1);
  return 100 - 100 / (1 + rs);
};

const calcularOBV = (precios, volumenes) => {
  let obv = [0];
  for (let i = 1; i < precios.length; i++) {
    if (precios[i] > precios[i - 1]) obv.push(obv[i - 1] + volumenes[i]);
    else if (precios[i] < precios[i - 1]) obv.push(obv[i - 1] - volumenes[i]);
    else obv.push(obv[i - 1]);
  }
  return obv;
};

// --- Email automático ---
const enviarAlertaEmail = async ({ ticker, motivo }) => {
  try {
    await axios.post('/api/enviarAlerta', {
      asunto: `💡 Señal de entrada detectada en ${ticker}`,
      mensaje: `✅ Señal técnica clara en ${ticker}: ${motivo}`,
    });
    console.log(`📩 Email enviado por señal en ${ticker}`);
  } catch (error) {
    console.error(`❌ Error enviando email para ${ticker}:`, error.message);
  }
};

// --- Análisis técnico principal ---
export const analizarOportunidades = async (listaTickers) => {
  const oportunidades = [];

  for (const ticker of listaTickers) {
    try {
      const hasta = Math.floor(Date.now() / 1000);
      const desde = hasta - 60 * 60 * 24 * 30;

      const res = await axios.get('https://finnhub.io/api/v1/stock/candle', {
        params: {
          symbol: ticker,
          resolution: 'D',
          from: desde,
          to: hasta,
          token: API_KEY,
        }
      });

      const { c: cierres, v: volumenes, s: status } = res.data;
      if (status !== 'ok' || cierres.length < 26) continue;

      const ema12 = calcularEMA(cierres.slice(-12), 12);
      const ema26 = calcularEMA(cierres.slice(-26), 26);
      const rsi = calcularRSI(cierres);
      const obv = calcularOBV(cierres, volumenes);

      const cruceConfirmado = ema12 > ema26;
      const diferencia = Math.abs(ema12 - ema26);
      const cercaDeCruce = diferencia <= (ema26 * 0.015);
      const rsiIdeal = rsi >= 48 && rsi <= 65;
      const obvSube = obv[obv.length - 1] > obv[obv.length - 2];

      if (cruceConfirmado && rsiIdeal && obvSube && cercaDeCruce) {
        const motivo = '📈 Señal técnica cercana: EMA12 > EMA26, RSI ideal y OBV creciente';
        oportunidades.push({ ticker, motivo });
      }

    } catch (error) {
      console.error(`⚠️ Error analizando ${ticker}:`, error.message);
    }
  }

  return oportunidades;
};

// --- Análisis automático fuerte (para alertas por email) ---
export const analizarSenalesClaras = async (listaTickers) => {
  const señales = [];

  for (const ticker of listaTickers) {
    try {
      const hasta = Math.floor(Date.now() / 1000);
      const desde = hasta - 60 * 60 * 24 * 30;

      const res = await axios.get('https://finnhub.io/api/v1/stock/candle', {
        params: {
          symbol: ticker,
          resolution: 'D',
          from: desde,
          to: hasta,
          token: API_KEY,
        }
      });

      const { c: cierres, v: volumenes, s: status } = res.data;
      if (status !== 'ok' || cierres.length < 26) continue;

      const ema12 = calcularEMA(cierres.slice(-12), 12);
      const ema26 = calcularEMA(cierres.slice(-26), 26);
      const rsi = calcularRSI(cierres);
      const obv = calcularOBV(cierres, volumenes);

      const cruceConfirmado = ema12 > ema26;
      const cruceFuerte = cruceConfirmado && Math.abs(ema12 - ema26) > (ema26 * 0.015);
      const rsiIdeal = rsi >= 50 && rsi <= 60;
      const obvSube = obv[obv.length - 1] > obv[obv.length - 2];

      if (cruceFuerte && rsiIdeal && obvSube) {
        const motivo = '🔥 Cruce fuerte EMA + RSI ideal + OBV creciente';
        señales.push({ ticker, motivo });
        await enviarAlertaEmail({ ticker, motivo });
      }

    } catch (error) {
      console.error(`⚠️ Error con ${ticker}:`, error.message);
    }
  }

  return señales;
};
