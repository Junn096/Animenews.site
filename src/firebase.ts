import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

// Configuration from clever-citizen-wfs6l (provisioned project)
const firebaseConfig = {
  apiKey: "AIzaSyCvnJU7fJczz42k_rFJiF6PJ4Wy2fA-zF0",
  authDomain: "clever-citizen-wfs6l.firebaseapp.com",
  projectId: "clever-citizen-wfs6l",
  storageBucket: "clever-citizen-wfs6l.firebasestorage.app",
  messagingSenderId: "259465737066",
  appId: "1:259465737066:web:ae44ee3cee79b423532b13"
};

const databaseId = "ai-studio-1e409aeb-7248-4406-a6db-1a33f48a2166";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use the specific database ID provisioned for this applet
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut } from 'firebase/auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
