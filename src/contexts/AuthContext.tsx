import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { auth, db } from "../firebase";
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { DocumentReference, DocumentSnapshot, doc, getDoc } from "firebase/firestore";

interface AuthProviderProps {
  children: ReactNode;
}

interface FirebaseUser {
  admin: boolean;
  company: DocumentReference<FirebaseCompany>;
  companyId: string;
  pointsCollected: number;
  pointsSpent: number;
  displayName: string;
  lastClaim: Date | null;
  photoName: string | null;
  photoURL: string | null;
  email: string;
  points: number;
}

interface FirebaseCompany {
  admin: DocumentReference | null;
  adminId: string;
  claimPoints: number | null;
  claimPointsInterval: number | null;
  name: string;
  totalEmployees: number;
  rewards: any[]; // ???
}

export interface CurrentUser {
  userId: string;
  companyId: string;
  user: FirebaseUser;
  company: FirebaseCompany;
}

interface IValue {
  currentUser: CurrentUser | null;
  userLoading: boolean;
  setCurrentUser: any;
  enroll: (email: string, password: string, authInstance?: Auth) => Promise<UserCredential>;
  signin: (email: string, password: string) => Promise<UserCredential>;
  updateDisplayName: (name: string, authInstance?: Auth) => Promise<void>;
  sendVerificationEmail: (authInstance?: Auth) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: (authInstance?: Auth) => Promise<void>;
}

//SetStateAction<CurrentUser | null>

const AuthContext = createContext<IValue>({
  currentUser: null,
  userLoading: true,
  setCurrentUser: () => {
    throw new Error("AuthContext not initialized properly");
  },
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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  function enroll(email: string, password: string, authInstance: Auth = auth): Promise<UserCredential> {
    return createUserWithEmailAndPassword(authInstance, email, password);
  }

  function signin(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function updateDisplayName(name: string, authInstance: Auth = auth): Promise<void> {
    return updateProfile(authInstance.currentUser!, { displayName: name });
  }

  function sendVerificationEmail(authInstance: Auth = auth): Promise<void> {
    return sendEmailVerification(authInstance.currentUser!);
  }

  function forgotPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  function logout(authInstance: Auth = auth): Promise<void> {
    return signOut(authInstance);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUserLoading(true);

      if (user) {
        const firestoreUser = (await getDoc(doc(db, "users", user.uid))) as DocumentSnapshot<FirebaseUser>;
        const firestoreUserData = firestoreUser.data()!;
        const firestoreCompany = (await getDoc(firestoreUserData.company)) as DocumentSnapshot<FirebaseCompany>;
        const firestoreCompanyData = firestoreCompany.data()!;

        setCurrentUser({
          userId: firestoreUser.id,
          companyId: firestoreCompany.id,
          user: {
            ...firestoreUserData,
          },
          company: {
            ...firestoreCompanyData,
          },
        });
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
    setCurrentUser,
    enroll,
    signin,
    updateDisplayName,
    sendVerificationEmail,
    forgotPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
