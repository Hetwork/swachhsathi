import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string) {
    return auth().createUserWithEmailAndPassword(email, password);
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    return auth().signInWithEmailAndPassword(email, password);
  }

  // Sign out
  async signOut() {
    return auth().signOut();
  }

  // Auth state listener
  onAuthStateChanged(
    callback: (user: FirebaseAuthTypes.User | null) => void
  ) {
    return auth().onAuthStateChanged(callback);
  }

  // Get current user
  getCurrentUser() {
    return auth().currentUser;
  }
}

export default new AuthService();
