// client/src/firebase.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-FivYDfG-2jqNS8n_gN7OMFMXj_HWObg",
  authDomain: "finsight-app-75eab.firebaseapp.com",
  projectId: "finsight-app-75eab",
  storageBucket: "finsight-app-75eab.firebasestorage.app",
  messagingSenderId: "264469948872",
  appId: "1:264469948872:web:5caef46e7045392f7a38fd",
  measurementId: "G-WMKN3DLLK7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  auth,
  googleProvider,
  facebookProvider,
  signInWithPopup
};
