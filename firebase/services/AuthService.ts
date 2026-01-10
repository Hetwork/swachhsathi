class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string) {
    const { getAuth, createUserWithEmailAndPassword } = await import('@react-native-firebase/auth');
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { getAuth, signInWithEmailAndPassword } = await import('@react-native-firebase/auth');
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign out
  async signOut() {
    const { getAuth, signOut } = await import('@react-native-firebase/auth');
    const auth = getAuth();
    return signOut(auth);
  }

  // Auth state listener
  onAuthStateChanged(callback: (user: any) => void) {
    const { getAuth, onAuthStateChanged } = require('@react-native-firebase/auth');
    const auth = getAuth();
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  getCurrentUser() {
    const { getAuth } = require('@react-native-firebase/auth');
    const auth = getAuth();
    return auth.currentUser;
  }
}

export default new AuthService();
