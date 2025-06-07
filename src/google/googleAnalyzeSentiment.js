
// Función para analizar el sentimiento con Google
export async function googleAnalyzeSentiment(text) {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY; // Obtiene la clave API desde el archivo .env

  console.log("🔑 API Key cargada para Google: ", apiKey);  // Verifica si la clave es correcta

  const response = await fetch(
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

  if (!response.ok) {
    throw new Error("Error al analizar sentimiento con Google Cloud");
  }

  const data = await response.json();

  console.log("📊 Respuesta de Google: ", data);  // Log para ver la respuesta completa de Google

  // Interpretación del sentimiento basado en score y magnitude
  const { score, magnitude } = data.documentSentiment;
  const sentimiento = interpretarSentimiento(score, magnitude);

  return {
    sentimiento,
    score,
    magnitude
  };
}

// Función para interpretar el sentimiento basado en el score y magnitud de Google
const interpretarSentimiento = (score, magnitude) => {
  let sentimiento;
  if (score > 0.25) sentimiento = "Positivo";
  else if (score < -0.25) sentimiento = "Negativo";
  else sentimiento = "Neutral";

  let intensidad;
  if (magnitude >= 2.0) intensidad = "Fuerte";
  else if (magnitude >= 0.5) intensidad = "Moderado";
  else intensidad = "Débil";

  return { sentimiento, intensidad };
};
