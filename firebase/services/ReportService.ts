import firestore from '@react-native-firebase/firestore';

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
  createdAt?: any;
  updatedAt?: any;
}

class ReportService {
  private collectionName = 'reports';

  // Create new report
  async createReport(
    reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const docRef = await firestore()
        .collection(this.collectionName)
        .add({
          ...reportData,
          status: 'pending',
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      return docRef.id;
    } catch (error) {
      console.error('Create report error:', error);
      throw error;
    }
  }

  // Get all reports (public feed)
  async getAllReports(): Promise<Report[]> {
    try {
      const snapshot = await firestore()
        .collection(this.collectionName)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Get all reports error:', error);
      throw error;
    }
  }

  // Get reports by user
  async getUserReports(userId: string): Promise<Report[]> {
    try {
      const snapshot = await firestore()
        .collection(this.collectionName)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Get user reports error:', error);
      throw error;
    }
  }

  // Get single report
  async getReport(reportId: string): Promise<Report | null> {
    try {
      const docSnap = await firestore()
        .collection(this.collectionName)
        .doc(reportId)
        .get();

      return docSnap.exists
        ? ({ id: docSnap.id, ...docSnap.data() } as Report)
        : null;
    } catch (error) {
      console.error('Get report error:', error);
      throw error;
    }
  }

  // Update report status
  async updateReportStatus(
    reportId: string,
    status: Report['status'],
    workerId?: string
  ): Promise<void> {
    try {
      const reportRef = firestore()
        .collection(this.collectionName)
        .doc(reportId);

      const updateData: any = {
        status,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (workerId) {
        updateData.assignedTo = workerId;
      }

      await reportRef.update(updateData);

      await reportRef
        .collection('reportStatus')
        .add({
          status,
          assignedTo: workerId || null,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Update report status error:', error);
      throw error;
    }
  }

  // Get report status history
  async getReportStatusHistory(reportId: string): Promise<any[]> {
    try {
      const snapshot = await firestore()
        .collection(this.collectionName)
        .doc(reportId)
        .collection('reportStatus')
        .orderBy('timestamp', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get report status history error:', error);
      throw error;
    }
  }

  // Delete report
  async deleteReport(reportId: string): Promise<void> {
    try {
      await firestore()
        .collection(this.collectionName)
        .doc(reportId)
        .delete();
    } catch (error) {
      console.error('Delete report error:', error);
      throw error;
    }
  }
}

export default new ReportService();
