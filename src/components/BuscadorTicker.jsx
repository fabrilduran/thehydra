import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VolverInicio from './VolverInicio';

const BuscadorTicker = () => {
  const [ticker, setTicker] = useState('');
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setTicker(e.target.value.toUpperCase());
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim() !== '') {
      navigate(`/tickersearch/${ticker.trim()}`);
      setTicker('');
    }
  };


  const analizarSentimiento = async () => {
    if (texto.trim() === '') return;
    setCargando(true);

    const sentimientoGoogle = await fetch('/api/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texto }),
    }).then(res => res.json())
      .catch(err => ({ error: 'Error al llamar a Google', detalle: err.message }));

    const sentimientoOpenAI = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texto }),
    }).then(res => res.json())
      .catch(err => ({ error: 'Error al llamar a OpenAI', detalle: err.message }));

    setResultado({
      google: sentimientoGoogle,
      openai: sentimientoOpenAI,
    });

    setCargando(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">🔎 Buscar Ticker + Análisis de Sentimiento</h2>

      <form onSubmit={manejarSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Ingresá el ticker (ej: AAPL)"
          value={ticker}
          onChange={manejarCambio}
          className="border rounded p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 disabled:opacity-50"
          disabled={ticker.trim() === ''}
        >
          Buscar
        </button>
      </form>

      <div className="mb-4">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí texto para analizar sentimiento (ej: noticias, eventos...)"
          rows={4}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={analizarSentimiento}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          disabled={texto.trim() === ''}
        >
          🧠 Analizar Sentimiento
        </button>
      </div>

      {cargando ? (
        <p className="text-center">🔄 Analizando sentimiento...</p>
      ) : resultado && (
        <div className="bg-white p-4 border rounded shadow space-y-2">
          {resultado.google?.error ? (
            <p>❌ Error con Google: {resultado.google.error}</p>
          ) : (
            <>
              <p>🟦 Sentimiento (Google): <strong>{resultado.google.sentimiento}</strong></p>
              <p>🔢 Intensidad: {resultado.google.intensidad}</p>
            </>
          )}

          {resultado.openai?.error ? (
            <p>❌ Error con OpenAI: {resultado.openai.error}</p>
          ) : (
            <>
              <p>🤖 Sentimiento (OpenAI): <strong>{resultado.openai.sentimiento}</strong></p>
              <p>💬 Explicación: {resultado.openai.explicacion}</p>
            </>
          )}
        </div>
      )}

      <div className="mt-6">
        <VolverInicio />
      </div>
    </div>
  );
};

export default BuscadorTicker;
