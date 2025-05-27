// src/libs/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPH76GAsqdTtYMmwzW_eMzWO1TK22XXM0",
  authDomain: "personal-finance-tracker-956d7.firebaseapp.com",
  projectId: "personal-finance-tracker-956d7",
  storageBucket: "personal-finance-tracker-956d7.appspot.com",
  messagingSenderId: "799857825458",
  appId: "1:799857825458:web:281f994df77d9fe52f1bab",
  measurementId: "G-7J98KH5BXE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
