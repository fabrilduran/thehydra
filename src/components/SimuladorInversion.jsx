import React, { useState } from 'react';
import VolverInicio from './VolverInicio';

function SimuladorInversion() {
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [gananciaTotal, setGananciaTotal] = useState(null);
  const [gananciaPorcentaje, setGananciaPorcentaje] = useState(null);
  const [error, setError] = useState('');

  const calcularGanancia = () => {
    const compra = parseFloat(precioCompra);
    const venta = parseFloat(precioVenta);
    const cant = parseInt(cantidad);

    if (isNaN(compra) || isNaN(venta) || isNaN(cant) || compra <= 0 || cant <= 0) {
      setGananciaTotal(null);
      setGananciaPorcentaje(null);
      setError('Por favor ingresá valores válidos y mayores a cero.');
      return;
    }

    const totalGanancia = (venta - compra) * cant;
    const porcentaje = ((venta - compra) / compra) * 100;

    setGananciaTotal(totalGanancia.toFixed(2));
    setGananciaPorcentaje(porcentaje.toFixed(2));
    setError('');
  };

  const limpiarFormulario = () => {
    setPrecioCompra('');
    setPrecioVenta('');
    setCantidad('');
    setGananciaTotal(null);
    setGananciaPorcentaje(null);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md mx-auto mt-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Simulador de Inversión</h2>

      {error && (
        <div className="mb-4 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Precio de Compra:</label>
        <input
          type="number"
          value={precioCompra}
          onChange={e => setPrecioCompra(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Ej: 150.25"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Precio de Venta Objetivo:</label>
        <input
          type="number"
          value={precioVenta}
          onChange={e => setPrecioVenta(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Ej: 180.00"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Cantidad de Acciones:</label>
        <input
          type="number"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Ej: 100"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={calcularGanancia}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 w-full"
        >
          Calcular
        </button>
        <button
          onClick={limpiarFormulario}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 w-full"
        >
          Limpiar
        </button>
      </div>

      {gananciaTotal !== null && (
        <div className="mt-6 text-center text-lg">
          <p className="mb-2">💰 <strong>Ganancia Total:</strong> ${gananciaTotal}</p>
          <p>📈 <strong>Ganancia en %:</strong> {gananciaPorcentaje}%</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <VolverInicio />
      </div>
    </div>
  );
}

export default SimuladorInversion;
