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

const SocialAuth = ({ isLoading, setLoading }) => {
  const [firebaseUser] = useAuthState(auth);
  const [selectedProvider, setSelectedProvider] = useState("google");
  const navigate = useNavigate();
  const { setCredentials } = useStore((state) => state);

  // ✅ New state to prevent duplicate API calls and toasts
  const [alreadyHandled, setAlreadyHandled] = useState(false);

  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    setSelectedProvider("google");
    try {
      setLoading(true);
      await signInWithPopup(auth, provider); // Triggers Firebase auth
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error(error?.message || "Failed to sign in with Google");
      setLoading(false); // ✅ Make sure loading ends on failure
    }
  };

  useEffect(() => {
    const saveUserToDb = async () => {
      if (!firebaseUser || alreadyHandled) return;

      // ✅ Prevent saving user again on multiple re-renders
      setAlreadyHandled(true);

      try {
        const userData = {
          firstname: firebaseUser.displayName,
          email: firebaseUser.email,
          provider: selectedProvider,
          uid: firebaseUser.uid,
        };

        const { data: res } = await api.post("/auth/signup", userData);

        // ✅ Only proceed if signup response is successful
        if (res?.token) {
          toast.success("Welcome back!");
          const userInfo = { ...res.user, token: res.token };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setCredentials(userInfo);
          navigate("/overview"); // ✅ Redirect after successful signup
        } else {
          toast.error("Failed to save user data");
        }
      } catch (error) {
        // ✅ Handle duplicate email gracefully with redirect
        if (error?.response?.status === 409) {
          toast.error("This account already exists. Logging you in...");
          navigate("/overview");
        } else {
          console.error("Error saving user to DB:", error);
          toast.error(error?.response?.data?.message || "Failed to save user data");
        }
      } finally {
        setLoading(false);
      }
    };

    // ✅ Trigger only if Firebase user is available
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
