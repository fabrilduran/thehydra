import React, { useState, useEffect } from 'react';
import { analizarOportunidades } from '../utils/analisisAutomatico';
import VolverInicio from './VolverInicio';
import { SECTORES } from '../data/sectores';
import { obtenerTickersPorSector } from '../utils/obtenerTickersPorSector';

const BuscadorOportunidades = () => {
  const [mercadoSeleccionado, setMercadoSeleccionado] = useState('USA');
  const [sectorSeleccionado, setSectorSeleccionado] = useState('');
  const [tickersInput, setTickersInput] = useState('');
  const [oportunidades, setOportunidades] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [sentimientos, setSentimientos] = useState({});

  const handleSeleccionarSector = async (sectorNombre) => {
    setSectorSeleccionado(sectorNombre);
    const sector = SECTORES.find((s) => s.nombre === sectorNombre);
    if (!sector) return;

    const codigo = mercadoSeleccionado === 'USA' ? sector.codigoUS : sector.codigoAR;
    const tickers = await obtenerTickersPorSector(codigo, mercadoSeleccionado);
    setTickersInput(tickers.join(', '));
  };

  const handleBuscar = async () => {
    const tickers = tickersInput
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    if (tickers.length === 0) return;

    setCargando(true);
    const resultados = await analizarOportunidades(tickers);
    setOportunidades(resultados);
    setCargando(false);
  };

  const handleBuscarAutomatico = async () => {
    if (!sectorSeleccionado) return;
    await handleSeleccionarSector(sectorSeleccionado);
    setTimeout(handleBuscar, 500);
  };

  const handleAnalizarSentimiento = async (texto, ticker) => {
    try {
      const [googleRes, openaiRes] = await Promise.all([
        fetch('/api/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: texto }),
        }).then((res) => res.json()),
        fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: texto }),
        }).then((res) => res.json()),
      ]);

      setSentimientos((prev) => ({
        ...prev,
        [ticker]: {
          google: { sentimiento: googleRes, error: googleRes.error },
          openai: { sentimiento: openaiRes, error: openaiRes.error },
        },
      }));
    } catch (err) {
      console.error('Error analizando sentimiento:', err);
    }
  };

  const handleAnalizarTodosLosSentimientos = async () => {
    for (const accion of oportunidades) {
      await handleAnalizarSentimiento(accion.motivo, accion.ticker);
    }
  };

  // Ejecución automática (comentada por defecto)
  /*
  useEffect(() => {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();

    // 2 horas antes de apertura USA (abre 9:30 -> check 7:30)
    // 2 horas después del cierre USA (cierra 16:00 -> check 18:00)
    if ((hora === 7 && minutos >= 30) || (hora === 18)) {
      handleBuscarAutomatico();
    }
  }, []);
  */

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">📊 Buscador de Oportunidades</h2>

      <div className="mb-4 text-center space-y-2">
        <div className="flex flex-col md:flex-row gap-2 justify-center">
          <select
            value={mercadoSeleccionado}
            onChange={(e) => {
              setMercadoSeleccionado(e.target.value);
              setSectorSeleccionado('');
              setTickersInput('');
              setOportunidades([]);
              setSentimientos({});
            }}
            className="p-2 border rounded w-full md:w-1/3"
          >
            <option value="USA">🇺🇸 Mercado USA</option>
            <option value="Argentina">🇦🇷 Mercado Argentina</option>
          </select>

          <select
            value={sectorSeleccionado}
            onChange={(e) => handleSeleccionarSector(e.target.value)}
            className="p-2 border rounded w-full md:w-2/3"
          >
            <option value="">📂 Seleccioná un sector</option>
            {SECTORES.map((sec) => (
              <option key={sec.nombre} value={sec.nombre}>
                {sec.nombre}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={tickersInput}
          onChange={(e) => setTickersInput(e.target.value)}
          rows={2}
          placeholder="O escribí los tickers manualmente (ej: AAPL, YPF.BA, etc)"
          className="w-full p-2 border rounded"
        />

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <button
            onClick={handleBuscar}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Buscar Oportunidades
          </button>

          <button
            onClick={handleBuscarAutomatico}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            🔄 Analizar Sector Automáticamente
          </button>

          <button
            onClick={handleAnalizarTodosLosSentimientos}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            disabled={oportunidades.length === 0}
          >
            🧠 Analizar Sentimiento de Todos
          </button>
        </div>
      </div>

      {cargando ? (
        <p className="text-center">🔄 Analizando tickers...</p>
      ) : oportunidades.length > 0 ? (
        <ul className="space-y-4">
          {oportunidades.map((accion, index) => (
            <li
              key={index}
              className="bg-white shadow p-4 rounded border hover:shadow-md transition duration-200"
            >
              <strong>{accion.ticker}</strong> — {accion.motivo}

              <div className="mt-2">
                <button
                  onClick={() => handleAnalizarSentimiento(accion.motivo, accion.ticker)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Analizar Sentimiento
                </button>
              </div>

              {sentimientos[accion.ticker] && (
                <div className="mt-2 text-sm text-gray-700">
                  {sentimientos[accion.ticker].google?.error ? (
                    <p>❌ Error con Google: {sentimientos[accion.ticker].google.error}</p>
                  ) : (
                    <>
                      <p>
                        🟦 Sentimiento (Google):{' '}
                        <strong>{sentimientos[accion.ticker].google.sentimiento.sentimiento}</strong>
                      </p>
                      <p>🔢 Intensidad: {sentimientos[accion.ticker].google.sentimiento.intensidad}</p>
                    </>
                  )}
                  {sentimientos[accion.ticker].openai?.error ? (
                    <p>❌ Error con OpenAI: {sentimientos[accion.ticker].openai.error}</p>
                  ) : (
                    <>
                      <p className="mt-2">
                        🤖 Sentimiento (OpenAI):{' '}
                        <strong>{sentimientos[accion.ticker].openai.sentimiento.sentimiento}</strong>
                      </p>
                      <p>💬 Explicación: {sentimientos[accion.ticker].openai.sentimiento.explicacion}</p>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !cargando && <p className="text-center">No se encontraron oportunidades.</p>
      )}

      <div className="mt-6">
        <VolverInicio />
      </div>
    </div>
  );
};

export default BuscadorOportunidades;
