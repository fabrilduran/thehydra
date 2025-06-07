// src/utils/fetchStockData.js

export async function fetchStockData(ticker) {
  const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
  const baseUrl = "https://finnhub.io/api/v1";

  try {
    console.log("🔍 Solicitando datos para ticker:", ticker);

    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 60 * 60 * 24 * 30;

    const response = await fetch(
      `${baseUrl}/stock/candle?symbol=${ticker}&resolution=D&from=${thirtyDaysAgo}&to=${now}&token=${API_KEY}`
    );
    const data = await response.json();

    if (data.s !== "ok" || !Array.isArray(data.t) || !Array.isArray(data.c)) {
      console.warn("⚠️ Datos inválidos para:", ticker, data);
      return [];
    }

    // Formateamos a: [{ date: 'YYYY-MM-DD', close: número }]
    const formattedData = data.t.map((timestamp, i) => ({
      date: new Date(timestamp * 1000).toISOString().split("T")[0],
      close: data.c[i],
    }));

    // Orden opcional por fecha ascendente
    formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return formattedData;
  } catch (error) {
    console.error("❌ Error al obtener datos de Finnhub para", ticker, ":", error.message);
    return [];
  }
}
