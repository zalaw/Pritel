import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { auth, db, storage } from "../firebase";
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
import {
  DocumentReference,
  DocumentSnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Reward } from "../interfaces";
import { toast } from "react-toastify";
import { simulateLoading } from "../dev/helpers";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

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
  saveClaimPoints: (claimPoints: number, claimPointsInterval: number) => Promise<void>;
  getRewards: () => Promise<void>;
  addReward: (reward: Reward, imageFile: File | null) => Promise<void>;
}

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
  saveClaimPoints: () => {
    throw new Error("AuthContext not initialized properly");
  },
  getRewards: () => {
    throw new Error("AuthContext not initialized properly");
  },
  addReward: () => {
    throw new Error("AuthContext not initialized properly");
  },
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const navigate = useNavigate();

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

  async function saveClaimPoints(claimPoints: number, claimPointsInterval: number) {
    try {
      await simulateLoading(2000, 5000);

      await setDoc(doc(db, "companies", currentUser!.companyId), { claimPoints, claimPointsInterval }, { merge: true });

      setCurrentUser({
        ...currentUser!,
        company: { ...currentUser!.company, claimPoints, claimPointsInterval },
      });

      toast.success("Claim points updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  }

  async function getRewards() {
    const rewards: Reward[] = [];

    const querySnapshot = await getDocs(
      query(collection(db, "rewards"), where("companyId", "==", currentUser!.companyId), orderBy("createdAt", "desc"))
    );

    querySnapshot.forEach(doc => {
      console.log(doc.id, " => ", doc.data());
      // rewards.push({ ...doc.data() });
    });
  }

  async function addReward(reward: Reward, imageFile: File | null) {
    if (imageFile === null) return;

    try {
      const now = new Date();
      const imageName = crypto.randomUUID();
      const storageRef = ref(storage, `rewards-images/${imageName}`);

      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        () => {},
        err => console.log(err),
        async () => {
          const imageURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "rewards"), {
            ...reward,
            imageName,
            imageURL,
            company: doc(db, `companies/${currentUser!.companyId}`),
            companyId: currentUser!.companyId,
            createdAt: now,
            updatedAt: now,
          });

          toast.success("Reward added successfully!");
        }
      );
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
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

        setUserLoading(false);
      } else {
        setCurrentUser(null);
        setUserLoading(false);
      }
    });

    return () => {
      unsubscribe();
      setUserLoading(false);
    };
  }, []);

  useEffect(() => {
    if (currentUser && ["/signin", "/enroll"].includes(window.location.pathname)) navigate("/");
  }, [currentUser, navigate]);

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
    saveClaimPoints,
    getRewards,
    addReward,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
