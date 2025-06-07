// src/services/favoritosService.js
import { db } from '../config/firebaseConfig';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

const getUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.uid : null;
};

export const obtenerFavoritos = async () => {
  const uid = getUserId();
  if (!uid) return [];

  const favoritosRef = collection(db, 'favoritos');
  const q = query(favoritosRef, where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// ✅ Recibe objeto con { ticker, nota }
export const agregarAFavoritos = async ({ ticker, nota }) => {
  const uid = getUserId();
  if (!uid) throw new Error('Usuario no autenticado');

  await addDoc(collection(db, 'favoritos'), {
    uid,
    ticker,
    nota,
    timestamp: new Date()
  });
};

export const eliminarDeFavoritos = async (id) => {
  await deleteDoc(doc(db, 'favoritos', id));
};
