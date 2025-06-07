// src/utils/analyzeSentiment.js

import { googleAnalyzeSentiment } from "../google/googleAnalyzeSentiment.js";
import { openaiAnalyzeSentiment } from "../openai/openaiAnalyzeSentiment.js";

/**
 * Analiza el sentimiento de un texto usando Google, OpenAI o ambos.
 * @param {string} texto - Texto a analizar.
 * @param {string} fuente - "google", "openai" o "ambos".
 * @returns {object} Resultados de sentimiento por servicio.
 */
export async function analyzeSentiment(texto, fuente = "ambos") {
  const resultados = {};

  if (fuente === "google" || fuente === "ambos") {
    try {
      const resultadoGoogle = await googleAnalyzeSentiment(texto);
      resultados.google = resultadoGoogle;
    } catch (error) {
      resultados.google = { error: error.message || "Error en Google API" };
    }
  }

  if (fuente === "openai" || fuente === "ambos") {
    try {
      const resultadoOpenAI = await openaiAnalyzeSentiment(texto);
      resultados.openai = resultadoOpenAI;
    } catch (error) {
      resultados.openai = { error: error.message || "Error en OpenAI API" };
    }
  }

  return resultados;
}
