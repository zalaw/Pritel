import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { auth } from "../firebase";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

interface AuthProviderProps {
  children: ReactNode;
}

interface IValue {
  currentUser: User | null;
  userLoading: boolean;
  enroll: (email: string, password: string) => Promise<UserCredential>;
  signin: (email: string, password: string) => Promise<UserCredential>;
  updateDisplayName: (name: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IValue>({
  currentUser: null,
  userLoading: true,
  enroll: () => {
    throw new Error("AuthContext not initialized properly");
  },
  signin: () => {
    throw new Error("AuthContext not initialized properly");
  },
  updateDisplayName: () => {
    throw new Error("AuthContext not initialized properly");
  },
  sendVerificationEmail: () => {
    throw new Error("AuthContext not initialized properly");
  },
  forgotPassword: () => {
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  function enroll(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function signin(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function updateDisplayName(name: string): Promise<void> {
    return updateProfile(auth.currentUser!, { displayName: name });
  }

  function sendVerificationEmail(): Promise<void> {
    return sendEmailVerification(auth.currentUser!);
  }

  function forgotPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  function logout(): Promise<void> {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log("onAuthStateChanged");
      console.log(user);

      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }

      setUserLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: IValue = {
    currentUser,
    userLoading,
    enroll,
    signin,
    updateDisplayName,
    sendVerificationEmail,
    forgotPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
