import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  role?: 'user' | 'worker' | 'admin';
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
}

class UserService {
  private collectionName = 'users';

  // Create user document
  async createUser(uid: string, userData: Partial<UserData>) {
    const userRef = firestore()
      .collection(this.collectionName)
      .doc(uid);

    return userRef.set({
      ...userData,
      uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  // Update user document
  async updateUser(uid: string, userData: Partial<UserData>) {
    const userRef = firestore()
      .collection(this.collectionName)
      .doc(uid);

    return userRef.update({
      ...userData,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  // Get all workers
  async getWorkers(): Promise<UserData[]> {
    const snapshot = await firestore()
      .collection(this.collectionName)
      .where('role', '==', 'worker')
      .get();

    return snapshot.docs.map(doc => doc.data() as UserData);
  }

  // Get user document
  async getUser(uid: string): Promise<UserData | null> {
    const docSnap = await firestore()
      .collection(this.collectionName)
      .doc(uid)
      .get();

    return docSnap.exists ? (docSnap.data() as UserData) : null;
  }
}

export default new UserService();
