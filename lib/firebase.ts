import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, updateDoc, query, where, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB438xt5E8qL35hTbyk3oCcB7Deo0cVV8g',
  authDomain: 'awsomesaws-6e713.firebaseapp.com',
  projectId: 'awsomesaws-6e713',
  storageBucket: 'awsomesaws-6e713.firebasestorage.app',
  messagingSenderId: '665771817455',
  appId: '1:665771817455:web:0733e4ebda83da3c52de1a',
  measurementId: 'G-WF1S6JH2B4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Expose on window for backward compatibility with existing components
if (typeof window !== 'undefined') {
  (window as any).__FIREBASE_APP__ = app;
  (window as any).__FIREBASE_AUTH__ = auth;
  (window as any).__FIREBASE_DB__ = db;
  (window as any).firebaseAuth = {
    onAuthStateChanged: (cb: (user: { email?: string | null; displayName?: string | null } | null) => void) =>
      onAuthStateChanged(auth, cb),
    signUp: (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password),
    signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
    signOut: () => signOut(auth),
    sendEmailVerification: (user: { email?: string | null }) =>
      sendEmailVerification(user as any),
    signInWithGoogle: () => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider);
    },
  };

  (window as any).firebaseDB = {
    saveUser: async (userData: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role?: string;
      createdAt: string;
    }) => {
      await setDoc(doc(db, 'users', userData.id), {
        ...userData,
        role: userData.role || 'customer',
        status: 'active',
        lastLogin: new Date().toISOString(),
        totalBookings: 0,
        totalSpent: 0,
      });
    },
    updateUser: async (userId: string, updates: Partial<{
      firstName: string;
      lastName: string;
      phone: string;
      role: string;
      status: string;
      lastLogin: string;
      totalBookings: number;
      totalSpent: number;
    }>) => {
      await updateDoc(doc(db, 'users', userId), updates);
    },
    getUser: async (userId: string) => {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
      return null;
    },
    getAllUsers: async () => {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const users: any[] = [];
      querySnapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
      return users;
    },
    getUserByEmail: async (email: string) => {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    },
  };

  // Analytics only works in browser contexts and may be blocked by privacy settings
  try {
    getAnalytics(app);
  } catch {
    // ignore
  }
}
