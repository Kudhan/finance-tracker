import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { auth } from "../../libs/firebaseConfig";
import useStore from "../../store";
import api from "../../libs/apiCall";

// Random password generator
const generateRandomPassword = (length = 12) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const SocialAuth = ({ isLoading, setLoading }) => {
  const [firebaseUser] = useAuthState(auth);
  const [selectedProvider, setSelectedProvider] = useState("google");
  const navigate = useNavigate();
  const { setCredentials } = useStore((state) => state);

  // Prevent duplicate API calls/toasts
  const [alreadyHandled, setAlreadyHandled] = useState(false);

  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    setSelectedProvider("google");
    try {
      
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error(error?.message || "Failed to sign in with Google");
      setLoading(false);
    }
  };

  useEffect(() => {
  const saveUserToDb = async () => {
    if (!firebaseUser || alreadyHandled) return;

    setAlreadyHandled(true);

    try {
      const userData = {
        firstname: firebaseUser.displayName,
        email: firebaseUser.email,
        provider: selectedProvider,
        uid: firebaseUser.uid,
        password: Math.random().toString(36).slice(-10), // Random password (backend needs it)
      };

      const { data: res } = await api.post("/auth/signup", userData);

      if (res?.token) {
        toast.success("Welcome back!");
        const userInfo = { ...res.user, token: res.token };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setCredentials(userInfo);
        navigate("/overview");
      } else {
        toast.error("Failed to save user data");
      }
    } catch (error) {
      console.error("Error saving user to DB:", error);

      // ❗ If user doesn't exist in backend, sign them out + clear everything
      if (error?.response?.status === 409 || error?.response?.status === 400) {
        toast.error("User data invalid or already exists. Resetting...");

        localStorage.removeItem("user");
        setCredentials(null);

        // Sign out from Firebase Auth
        await auth.signOut();
        setAlreadyHandled(false);
        window.location.reload(); // force retry login
      } else {
        toast.error(error?.response?.data?.message || "Failed to save user");
        setLoading(false);
      }
    }
  };

  if (firebaseUser) {
    saveUserToDb();
  }
}, [firebaseUser, selectedProvider, navigate, setCredentials, setLoading, alreadyHandled]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={signInWithGoogle}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
        type="button"
      >
        <FcGoogle className="text-xl" />
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
};

export default SocialAuth;
