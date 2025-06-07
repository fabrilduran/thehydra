import React, { useContext, useEffect, useState } from 'react';
import { FavoritosContext } from "../context/FavoritosContext";
import {
  obtenerFavoritos,
  agregarAFavoritos,
  eliminarDeFavoritos,
} from '../services/favoritosService';

function Favoritos() {
  const { favoritos, setFavoritos } = useContext(FavoritosContext);
  const [nuevoTicker, setNuevoTicker] = useState('');
  const [nuevaNota, setNuevaNota] = useState('');

  // Cargar favoritos desde Firebase al iniciar
  useEffect(() => {
    const cargarFavoritos = async () => {
      const datos = await obtenerFavoritos();
      setFavoritos(datos);
    };
    cargarFavoritos();
  }, [setFavoritos]);

  const manejarAgregar = async () => {
    const tickerFormateado = nuevoTicker.trim().toUpperCase();
    const notaFormateada = nuevaNota.trim();

    if (tickerFormateado === '') return;

    // Validar si ya está en la lista
    if (favoritos.some(fav => fav.ticker === tickerFormateado)) {
      alert("Este ticker ya está en favoritos.");
      return;
    }

    const nuevoFavorito = { ticker: tickerFormateado, nota: notaFormateada };
    await agregarAFavoritos(nuevoFavorito);
    setFavoritos((prev) => [...prev, nuevoFavorito]);
    setNuevoTicker('');
    setNuevaNota('');
  };

  const manejarEliminar = async (ticker) => {
    await eliminarDeFavoritos(ticker);
    setFavoritos((prev) => prev.filter((fav) => fav.ticker !== ticker));
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">⭐ Favoritos</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Ticker (ej: AAPL)"
          value={nuevoTicker}
          onChange={(e) => setNuevoTicker(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Nota personal"
          value={nuevaNota}
          onChange={(e) => setNuevaNota(e.target.value)}
          className="p-2 border rounded w-full md:w-2/3 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={manejarAgregar}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      {favoritos.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">No hay favoritos aún.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {favoritos.map((fav) => (
            <li
              key={fav.ticker}
              className="flex justify-between items-center border-b pb-2 border-gray-400 dark:border-gray-600"
            >
              <div>
                <strong>{fav.ticker}</strong> — <span className="text-sm">{fav.nota}</span>
              </div>
              <button
                onClick={() => manejarEliminar(fav.ticker)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favoritos;
