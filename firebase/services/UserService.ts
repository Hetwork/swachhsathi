import { getApp } from '@react-native-firebase/app';
import {
  FirebaseFirestoreTypes,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  role?: 'user' | 'worker' | 'admin';
  ngoId?: string;
  fcmToken?: string | null;
  platform?: 'ios' | 'android' | 'web';
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
}

class UserService {
  private collectionName = 'users';

  // Create user document
  async createUser(uid: string, userData: Partial<UserData>) {
    const db = getFirestore(getApp());
    const userRef = doc(collection(db, this.collectionName), uid);

    return setDoc(userRef, {
      ...userData,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Update user document
  async updateUser(uid: string, userData: Partial<UserData>) {
    const db = getFirestore(getApp());
    const userRef = doc(collection(db, this.collectionName), uid);

    return updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
  }

  // Get all workers
  async getWorkers(): Promise<UserData[]> {
    const db = getFirestore(getApp());
    const usersRef = collection(db, this.collectionName);
    const workersQuery = query(usersRef, where('role', '==', 'worker'));
    const snapshot = await getDocs(workersQuery);

    return snapshot.docs.map(docSnap => docSnap.data() as UserData);
  }

  // Get workers by NGO
  async getWorkersByNGO(ngoId: string): Promise<UserData[]> {
    const db = getFirestore(getApp());
    const usersRef = collection(db, this.collectionName);
    const workersQuery = query(
      usersRef,
      where('role', '==', 'worker'),
      where('ngoId', '==', ngoId)
    );
    const snapshot = await getDocs(workersQuery);

    return snapshot.docs.map(docSnap => docSnap.data() as UserData);
  }

  // Subscribe to workers by NGO (real-time)
  subscribeToWorkersByNGO(
    ngoId: string,
    onUpdate: (workers: UserData[]) => void,
    onError?: (error: Error) => void
  ) {
    const db = getFirestore(getApp());
    const usersRef = collection(db, this.collectionName);
    const workersQuery = query(
      usersRef,
      where('role', '==', 'worker'),
      where('ngoId', '==', ngoId)
    );

    return onSnapshot(
      workersQuery,
      (snapshot) => {
        const workers = snapshot.docs.map(docSnap => docSnap.data() as UserData);
        onUpdate(workers);
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );
  }

  // Get user document
  async getUser(uid: string): Promise<UserData | null> {
    const db = getFirestore(getApp());
    const userRef = doc(collection(db, this.collectionName), uid);
    const docSnap = await getDoc(userRef);

    return docSnap.exists ? (docSnap.data() as UserData) : null;
  }
}

export default new UserService();
