// api/openai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo se permite método POST" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Texto vacío" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Analiza el siguiente texto y responde sólo con "Positivo", "Negativo" o "Neutral".\n\n${text}`,
        },
      ],
    });

    const sentimiento = response.choices[0].message.content.trim();

    return res.status(200).json({ sentimiento });
  } catch (error) {
    console.error("Error en la API OpenAI:", error);
    return res.status(500).json({ error: "Error al analizar sentimiento" });
  }
}
