import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBlxN5obzzkK98Rg7NmT01EFXa-6t5Qz60',
  authDomain: 'techcall3-99ef9.firebaseapp.com',
  projectId: 'techcall3-99ef9',
  storageBucket: 'techcal13-99ef9.firebasestorage.app',
  messagingSenderId: '127162678608',
  appId: '1:127162678608:web:502faafe6b70d62f43c055',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const ALUNO_ID = 'RA2457051';
