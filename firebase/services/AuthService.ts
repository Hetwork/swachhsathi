import { getApp } from '@react-native-firebase/app';
import {
  FirebaseAuthTypes,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string) {
    const authInstance = getAuth(getApp());
    return createUserWithEmailAndPassword(authInstance, email, password);
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const authInstance = getAuth(getApp());
    return signInWithEmailAndPassword(authInstance, email, password);
  }

  // Sign out
  async signOut() {
    const authInstance = getAuth(getApp());
    return signOut(authInstance);
  }

  // Auth state listener
  onAuthStateChanged(
    callback: (user: FirebaseAuthTypes.User | null) => void
  ) {
    const authInstance = getAuth(getApp());
    return onAuthStateChanged(authInstance, callback);
  }

  // Get current user
  getCurrentUser() {
    const authInstance = getAuth(getApp());
    return authInstance.currentUser;
  }
}

export default new AuthService();
