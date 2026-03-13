export {};

declare global {
  interface Window {
    __FIREBASE_APP__?: unknown;
    __FIREBASE_AUTH__?: unknown;
    firebaseAuth?: {
      onAuthStateChanged: (cb: (user: { email?: string | null; displayName?: string | null } | null) => void) => () => void;
      signUp: (email: string, password: string) => Promise<{ user: { email?: string | null } }>;
      signIn: (email: string, password: string) => Promise<{ user: { email?: string | null } }>;
      signOut: () => Promise<void>;
      sendEmailVerification: (user: { email?: string | null }) => Promise<void>;
      signInWithGoogle: () => Promise<{ user: { email?: string | null; displayName?: string | null } }>;
    };
  }
}

