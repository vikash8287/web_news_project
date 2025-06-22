// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBtaIDFVhqex-Kpq04DOTKsccQkQBBM_uo",
  authDomain: "news-dashboard-d0f19.firebaseapp.com",
  projectId: "news-dashboard-d0f19",
  storageBucket: "news-dashboard-d0f19.firebasestorage.app",
  messagingSenderId: "974777055012",
  appId: "1:974777055012:web:c3c4dea3f9437c92c765b1",
  measurementId: "G-M4FGHH0C7J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

