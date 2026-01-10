import { getApp } from '@react-native-firebase/app';
import {
    FirebaseFirestoreTypes,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from '@react-native-firebase/firestore';

export interface NGOData {
  ngoId: string; // Same as user's UID
  ngoName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  adminId: string;
  registrationNumber: string;
  categories: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
}

class NGOService {
  private collectionName = 'ngos';

  // Create NGO document
  async createNGO(ngoId: string, ngoData: Omit<NGOData, 'ngoId' | 'status' | 'createdAt' | 'updatedAt'>) {
    const db = getFirestore(getApp());
    const ngoRef = doc(collection(db, this.collectionName), ngoId);

    return setDoc(ngoRef, {
      ...ngoData,
      ngoId,
      status: 'approved', // Default status is pending until admin approves
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Get NGO by ID
  async getNGO(ngoId: string): Promise<NGOData | null> {
    const db = getFirestore(getApp());
    const ngoRef = doc(collection(db, this.collectionName), ngoId);
    const docSnap = await getDoc(ngoRef);

    return docSnap.exists ? (docSnap.data() as NGOData) : null;
  }

  // Get all NGOs
  async getAllNGOs(): Promise<NGOData[]> {
    const db = getFirestore(getApp());
    const ngosRef = collection(db, this.collectionName);
    const snapshot = await getDocs(ngosRef);

    return snapshot.docs.map(docSnap => docSnap.data() as NGOData);
  }

  // Get NGOs by status
  async getNGOsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<NGOData[]> {
    const db = getFirestore(getApp());
    const ngosRef = collection(db, this.collectionName);
    const ngosQuery = query(ngosRef, where('status', '==', status));
    const snapshot = await getDocs(ngosQuery);

    return snapshot.docs.map(docSnap => docSnap.data() as NGOData);
  }

  // Update NGO status (for admin approval/rejection)
  async updateNGOStatus(ngoId: string, status: 'approved' | 'rejected') {
    const db = getFirestore(getApp());
    const ngoRef = doc(collection(db, this.collectionName), ngoId);

    return updateDoc(ngoRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  // Update NGO details
  async updateNGO(ngoId: string, ngoData: Partial<Omit<NGOData, 'ngoId' | 'createdAt'>>) {
    const db = getFirestore(getApp());
    const ngoRef = doc(collection(db, this.collectionName), ngoId);

    return updateDoc(ngoRef, {
      ...ngoData,
      updatedAt: serverTimestamp(),
    });
  }
}

export default new NGOService();
