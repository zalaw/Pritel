import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { auth } from "../firebase";
import { User, UserCredential, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

interface IValue {
  currentUser: User | null;
  signin: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IValue>({
  currentUser: null,
  signin: () => {
    throw new Error("AuthContext not initialized properly");
  },
  logout: () => {
    throw new Error("AuthContext not initialized properly");
  },
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function signin(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: IValue = {
    currentUser,
    signin,
    logout,
  };

  return <AuthContext.Provider value={value}>{loading ? "Loading..." : children}</AuthContext.Provider>;
}
