// src/components/RutaPrivada.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function RutaPrivada({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });

    return () => unsubscribe(); // Limpieza del observer
  }, []);

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        Verificando acceso...
      </div>
    );
  }

  // Si el usuario está autenticado, renderiza el contenido protegido
  return usuario ? children : <Navigate to="/login" replace />;
}

export default RutaPrivada;
