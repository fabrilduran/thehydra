// api/google.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { text } = req.body;
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Falta la API key de Google" });
  }

  try {
    const googleResponse = await fetch(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: {
            type: "PLAIN_TEXT",
            content: text,
          },
          encodingType: "UTF8",
        }),
      }
    );

    if (!googleResponse.ok) {
      throw new Error("Error al analizar sentimiento con Google");
    }

    const data = await googleResponse.json();

    const { score, magnitude } = data.documentSentiment;

    // Interpretación básica
    let sentimiento;
    if (score > 0.25) sentimiento = "Positivo";
    else if (score < -0.25) sentimiento = "Negativo";
    else sentimiento = "Neutral";

    let intensidad;
    if (magnitude >= 2.0) intensidad = "Fuerte";
    else if (magnitude >= 0.5) intensidad = "Moderado";
    else intensidad = "Débil";

    res.status(200).json({ sentimiento, intensidad, score, magnitude });
  } catch (error) {
    console.error("❌ Error Google Sentiment:", error);
    res.status(500).json({ error: "Error en el análisis de sentimiento con Google" });
  }
}
