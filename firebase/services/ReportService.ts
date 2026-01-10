import firestore from '@react-native-firebase/firestore';

export interface Report {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  severity: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
  workerId?: string;
  workerName?: string;
  createdAt: any;
  updatedAt: any;
}

class ReportService {
  private collection = firestore().collection('reports');

  // Get all reports
  async getAllReports(): Promise<Report[]> {
    try {
      const snapshot = await this.collection
        .orderBy('updatedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Error fetching all reports:', error);
      // Fallback: fetch without ordering
      const snapshot = await this.collection.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    }
  }

  // Get user reports by userId
  async getUserReports(userId: string): Promise<Report[]> {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .orderBy('updatedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Error fetching user reports:', error);
      // Fallback: fetch without ordering
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    }
  }

  // Get single report by ID
  async getReport(reportId: string): Promise<Report | null> {
    const doc = await this.collection.doc(reportId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data(),
    } as Report;
  }

  // Create new report
  async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await this.collection.add({
      ...reportData,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    
    return docRef.id;
  }

  // Update report status
  async updateReportStatus(
    reportId: string, 
    status: Report['status'],
    workerId?: string,
    workerName?: string
  ): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (workerId) {
      updateData.workerId = workerId;
    }
    
    if (workerName) {
      updateData.workerName = workerName;
    }

    await this.collection.doc(reportId).update(updateData);
  }

  // Update report
  async updateReport(reportId: string, data: Partial<Report>): Promise<void> {
    await this.collection.doc(reportId).update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  // Delete report
  async deleteReport(reportId: string): Promise<void> {
    await this.collection.doc(reportId).delete();
  }

  // Get reports by status
  async getReportsByStatus(status: Report['status']): Promise<Report[]> {
    const snapshot = await this.collection
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Report[];
  }

  // Get worker reports
  async getWorkerReports(workerId: string): Promise<Report[]> {
    const snapshot = await this.collection
      .where('workerId', '==', workerId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Report[];
  }
}

export default new ReportService();
