import 'dotenv/config';
import { googleAnalyzeSentiment } from './google/googleAnalyzeSentiment.js';
import { openaiAnalyzeSentiment } from './openai/openaiAnalyzeSentiment.js';

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

const testNoticia = async () => {
  const texto = "Este es un ejemplo para analizar el sentimiento.";

  // Google
  try {
    const resultadoGoogle = await googleAnalyzeSentiment(texto);
    const { score, magnitude } = resultadoGoogle.documentSentiment;
    const interpretado = interpretarSentimiento(score, magnitude);

    console.log("🟦 Resultado Google:");
    console.log("   ➤ Sentimiento:", interpretado.sentimiento);
    console.log("   ➤ Intensidad:", interpretado.intensidad);
    console.log("   ➤ Score bruto:", score);
    console.log("   ➤ Magnitud:", magnitude);
  } catch (error) {
    console.error("❌ Error con Google:", error.message);
  }

  // OpenAI
  try {
    const resultadoOpenAI = await openaiAnalyzeSentiment(texto);
    console.log("🟨 Resultado OpenAI:\n", resultadoOpenAI);
  } catch (error) {
    console.error("❌ Error con OpenAI:", error.message);
  }
};

testNoticia();
