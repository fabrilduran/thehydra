// src/context/FavoritosContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { db, auth } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // 👉 Escucha cambios de sesión (usuario logueado)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

  // 👉 Carga los favoritos del usuario desde Firestore
  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!usuario) return;
      const docRef = doc(db, 'favoritos', usuario.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavoritos(data.lista || []);
      }
    };
    cargarFavoritos();
  }, [usuario]);

  // 👉 Guarda los favoritos en Firestore cuando cambian
  useEffect(() => {
    const guardarFavoritos = async () => {
      if (!usuario) return;
      const docRef = doc(db, 'favoritos', usuario.uid);
      await setDoc(docRef, { lista: favoritos });
    };
    if (usuario) guardarFavoritos();
  }, [favoritos, usuario]);

  // 📌 Agregar un ticker a favoritos
  const agregarFavorito = (ticker) => {
    if (!favoritos.includes(ticker)) {
      setFavoritos([...favoritos, ticker]);
    }
  };

  // 🗑️ Eliminar un ticker de favoritos
  const eliminarFavorito = (ticker) => {
    setFavoritos(favoritos.filter(fav => fav !== ticker));
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, agregarFavorito, eliminarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};
