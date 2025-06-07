import axios from 'axios';
import { ADX } from 'technicalindicators';
import enviarAlertaEmail from './services/mailer.js';

const API_KEY = process.env.VITE_API_KEY_FINNHUB;

async function analizarAccion(ticker) {
  try {
    const hasta = Math.floor(Date.now() / 1000);
    const desde = hasta - 60 * 60 * 24 * 90; // últimos 90 días

    const res = await axios.get(`https://finnhub.io/api/v1/stock/candle`, {
      params: {
        symbol: ticker,
        resolution: 'D',
        from: desde,
        to: hasta,
        token: API_KEY,
      }
    });

    const { c: cierres, h: altos, l: bajos, v: volumenes, s: status } = res.data;
    if (status !== 'ok' || cierres.length < 20) {
      console.log(`No hay suficiente data para ${ticker}`);
      return;
    }

    const precios = cierres.slice(-20);
    const altos20 = altos.slice(-20);
    const bajos20 = bajos.slice(-20);
    const volumenes20 = volumenes.slice(-20);

    const precioActual = precios[precios.length - 1];
    const volumenActual = volumenes20[volumenes20.length - 1];
    const volumenProm7 = volumenes20.slice(-8, -1).reduce((a, b) => a + b, 0) / 7;

    const mediaCorta = (precios[precios.length - 1] + precios[precios.length - 2]) / 2;
    const mediaLarga = precios.slice(-5, -2).reduce((a, b) => a + b, 0) / 3;

    const adxValues = ADX.calculate({
      close: precios,
      high: altos20,
      low: bajos20,
      period: 14
    });

    const adxActual = adxValues[adxValues.length - 1]?.adx;

    console.log(`\n🔎 Análisis para ${ticker}`);
    console.log(`Precio actual: ${precioActual}`);
    console.log(`Media corta (2d): ${mediaCorta.toFixed(2)}`);
    console.log(`Media larga (3d): ${mediaLarga.toFixed(2)}`);
    console.log(`Volumen actual: ${volumenActual}`);
    console.log(`Volumen promedio (7d): ${volumenProm7.toFixed(0)}`);
    console.log(`ADX actual: ${adxActual?.toFixed(2) || 'N/D'}`);

    const condicionesEntrada =
      mediaCorta > mediaLarga &&
      volumenActual > volumenProm7 &&
      adxActual && adxActual > 20;

    const condicionesSalida =
      mediaCorta < mediaLarga &&
      volumenActual < volumenProm7 &&
      adxActual && adxActual > 20;

    if (condicionesEntrada) {
      console.log("✅ 📈 ENTRADA RECOMENDADA");
      enviarAlertaEmail(ticker, "ENTRADA", "Cruce alcista + Volumen en aumento + ADX fuerte");
    } else if (condicionesSalida) {
      console.log("⚠️ 📉 SALIDA SUGERIDA");
      enviarAlertaEmail(ticker, "SALIDA", "Cruce bajista + Volumen en disminución + ADX fuerte");
    } else {
      console.log("❕ Sin señal clara. Esperar confirmación.");
    }
  } catch (error) {
    console.error(`❌ Error al analizar ${ticker}:`, error.message);
  }
}

export default analizarAccion;
