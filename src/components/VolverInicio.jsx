import { useNavigate } from 'react-router-dom';

function VolverInicio({ ruta = "/" }) {
  const navigate = useNavigate();

  return (
    <div className="mt-6 text-center">
      <button
        onClick={() => navigate(ruta)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
        aria-label="Volver al inicio"
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default VolverInicio;
