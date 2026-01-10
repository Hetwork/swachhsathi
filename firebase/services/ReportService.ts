import { getApp } from '@react-native-firebase/app';
import {
  FirebaseFirestoreTypes,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';

export interface Report {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  imageUrl: string;
  category: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
  severity?: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
}

class ReportService {
  private collectionName = 'reports';

  // Create report
  async createReport(
    reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const db = getFirestore(getApp());
    const reportsRef = collection(db, this.collectionName);
    const docRef = await addDoc(reportsRef, {
      ...reportData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  // Get all reports
  async getAllReports(): Promise<Report[]> {
    const db = getFirestore(getApp());
    const reportsRef = collection(db, this.collectionName);
    const reportsQuery = query(reportsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(reportsQuery);

    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Report),
    }));
  }

  // Get user reports
  async getUserReports(userId: string): Promise<Report[]> {
    const db = getFirestore(getApp());
    const reportsRef = collection(db, this.collectionName);
    const reportsQuery = query(
      reportsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(reportsQuery);

    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Report),
    }));
  }

  // Get single report
  async getReport(reportId: string): Promise<Report | null> {
    const db = getFirestore(getApp());
    const reportRef = doc(db, this.collectionName, reportId);
    const docSnap = await getDoc(reportRef);

    return docSnap.exists
      ? { id: docSnap.id, ...(docSnap.data() as Report) }
      : null;
  }

  // Update report status
  async updateReportStatus(
    reportId: string,
    status: Report['status'],
    workerId?: string
  ): Promise<void> {
    const db = getFirestore(getApp());
    const reportRef = doc(db, this.collectionName, reportId);

    await updateDoc(reportRef, {
      status,
      assignedTo: workerId ?? null,
      updatedAt: serverTimestamp(),
    });

    const statusHistoryRef = collection(reportRef, 'reportStatus');
    await addDoc(statusHistoryRef, {
      status,
      assignedTo: workerId ?? null,
      timestamp: serverTimestamp(),
    });
  }

  // Get status history
  async getReportStatusHistory(reportId: string): Promise<any[]> {
    const db = getFirestore(getApp());
    const statusHistoryRef = collection(
      doc(db, this.collectionName, reportId),
      'reportStatus'
    );
    const statusQuery = query(statusHistoryRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(statusQuery);

    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  }

  // Delete report
  async deleteReport(reportId: string): Promise<void> {
    const db = getFirestore(getApp());
    const reportRef = doc(db, this.collectionName, reportId);
    await deleteDoc(reportRef);
  }
}

export default new ReportService();
