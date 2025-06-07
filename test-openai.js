import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testKey() {
  try {
    const models = await openai.models.list();
    console.log("✅ Conexión exitosa con OpenAI. Modelos disponibles:");
    console.log(models.data.map(m => m.id));
  } catch (error) {
    console.error("❌ Error de conexión con OpenAI:", error.message);
  }
}

testKey();
