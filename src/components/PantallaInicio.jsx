// src/components/PantallaInicio.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function PantallaInicio() {
  const navigate = useNavigate();

  const manejarClick = () => {
    navigate('/login');
  };

  return (
    <div style={estilos.contenedor}>
      <img src="/lobo.png" alt="Logo Hydra" style={estilos.imagen} className="fade-in" />
      <h1 style={estilos.titulo} className="fade-in-delay">HYDRA</h1>
      <p style={estilos.subtitulo} className="fade-in-delay-mas">La fuerza que siempre avanza.</p>
      <button style={estilos.boton} onClick={manejarClick} className="fade-in-delay-mas">Entrar</button>

      <style>
        {`
          .fade-in {
            opacity: 0;
            transform: scale(0.8);
            animation: aparecerZoom 2s ease forwards;
          }

          .fade-in-delay {
            opacity: 0;
            animation: aparecer 1.6s ease forwards;
            animation-delay: 1.2s;
          }

          .fade-in-delay-mas {
            opacity: 0;
            animation: aparecer 1.6s ease forwards;
            animation-delay: 2.4s;
          }

          @keyframes aparecerZoom {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes aparecer {
            to {
              opacity: 1;
            }
          }

          @media (max-height: 700px) {
            img {
              width: 180px !important;
              margin-bottom: 10px !important;
            }
            h1 {
              font-size: 36px !important;
            }
            p {
              font-size: 18px !important;
              margin-bottom: 20px !important;
            }
            button {
              font-size: 16px !important;
              padding: 8px 16px !important;
            }
          }

          @media (max-width: 400px) {
            h1 {
              font-size: 32px !important;
            }
            p {
              font-size: 16px !important;
            }
            button {
              font-size: 15px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

const estilos = {
  contenedor: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    boxSizing: 'border-box',
  },
  imagen: {
    width: '220px',
    height: 'auto',
    marginBottom: '20px',
  },
  titulo: {
    fontSize: '44px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: 0,
  },
  subtitulo: {
    fontSize: '22px',
    color: '#666',
    margin: '10px 0 30px',
  },
  boton: {
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#0e0e0e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default PantallaInicio;
