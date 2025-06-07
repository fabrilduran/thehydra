// src/services/googleNewsScraper.js

/**
 * Obtiene titulares de noticias recientes sobre un ticker usando Google News RSS.
 * @param {string} ticker - El símbolo bursátil (por ejemplo: AAPL, TSLA).
 * @returns {Promise<Array>} Lista de titulares con título, link y fecha.
 */
export async function fetchGoogleNewsHeadlines(ticker) {
  try {
    const query = encodeURIComponent(`${ticker} stock`);
    const rssUrl = `https://news.google.com/rss/search?q=${query}+when:7d&hl=es-419&gl=US&ceid=US:es-419`;

    // AllOrigins permite sortear CORS
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
    if (!response.ok) throw new Error("No se pudo acceder al feed RSS");

    const data = await response.json();

    // Parsea XML a DOM
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "application/xml");
    const items = xml.querySelectorAll("item");

    const headlines = Array.from(items).map((item) => ({
      title: item.querySelector("title")?.textContent || "",
      link: item.querySelector("link")?.textContent || "",
      pubDate: item.querySelector("pubDate")?.textContent || "",
    }));

    return headlines;
  } catch (error) {
    console.error("Error al obtener titulares de Google News:", error);
    return [];
  }
}
