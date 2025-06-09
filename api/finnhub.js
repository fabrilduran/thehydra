// api/finnhub.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { ticker } = req.body;
  const API_KEY = process.env.FINNHUB_API_KEY;
  const baseUrl = "https://finnhub.io/api/v1";

  if (!API_KEY) {
    return res.status(500).json({ error: "Falta la API key de Finnhub" });
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 60 * 60 * 24 * 30;

    const response = await fetch(
      `${baseUrl}/stock/candle?symbol=${ticker}&resolution=D&from=${thirtyDaysAgo}&to=${now}&token=${API_KEY}`
    );
    const data = await response.json();

    if (data.s !== "ok" || !Array.isArray(data.t) || !Array.isArray(data.c)) {
      return res.status(400).json({ error: "Datos inválidos", data });
    }

    const formattedData = data.t.map((timestamp, i) => ({
      date: new Date(timestamp * 1000).toISOString().split("T")[0],
      close: data.c[i],
    }));

    formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("❌ Error Finnhub:", error.message);
    res.status(500).json({ error: "Error al obtener datos de Finnhub" });
  }
}
