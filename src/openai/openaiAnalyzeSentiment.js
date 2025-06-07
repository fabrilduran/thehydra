import OpenAI from "openai";
console.log("🔑 OpenAI API Key:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function openaiAnalyzeSentiment(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // o podés usar "gpt-4" si tenés acceso
      messages: [
        {
          role: "user",
          content: `Analiza el siguiente texto y devuelve su sentimiento: "Positivo", "Negativo" o "Neutral".\n\n${text}`,
        },
      ],
    });

    const sentiment = response.choices[0].message.content.trim();
    return sentiment;
  } catch (error) {
    console.error("Error al analizar el sentimiento con OpenAI:", error);
    return "Error";
  }
}
