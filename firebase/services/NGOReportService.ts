import firestore from '@react-native-firebase/firestore';
import { Report } from './ReportService';

class NGOReportService {
  private collection = firestore().collection('reports');

  // Get reports for specific NGO
  async getNGOReports(ngoId: string): Promise<Report[]> {
    try {
      const snapshot = await this.collection
        .where('ngoId', '==', ngoId)
        .orderBy('updatedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Error fetching NGO reports:', error);
      // Fallback: fetch without ordering
      const snapshot = await this.collection
        .where('ngoId', '==', ngoId)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    }
  }

  // Get pending reports for NGO (not assigned yet)
  async getPendingNGOReports(ngoId: string): Promise<Report[]> {
    try {
      const snapshot = await this.collection
        .where('ngoId', '==', ngoId)
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Error fetching pending NGO reports:', error);
      // Fallback without ordering
      const snapshot = await this.collection
        .where('ngoId', '==', ngoId)
        .where('status', '==', 'pending')
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    }
  }

  // Get pending reports matching worker's categories
  async getPendingReportsByCategories(ngoId: string, categories: string[]): Promise<Report[]> {
    try {
      // First get all pending reports for this NGO
      const pendingReports = await this.getPendingNGOReports(ngoId);
      
      // Filter by categories if provided
      if (categories && categories.length > 0) {
        return pendingReports.filter(report => 
          report.category && categories.includes(report.category)
        );
      }
      
      return pendingReports;
    } catch (error) {
      console.error('Error fetching reports by categories:', error);
      return [];
    }
  }

  // Get reports by NGO and status
  async getNGOReportsByStatus(ngoId: string, status: Report['status']): Promise<Report[]> {
    try {
      const snapshot = await this.collection
        .where('ngoId', '==', ngoId)
        .where('status', '==', status)
        .orderBy('updatedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Error fetching NGO reports by status:', error);
      // Fallback
      const snapshot = await this.collection
        .where('ngoId', '==', ngoId)
        .where('status', '==', status)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    }
  }

  // Get reports assigned to specific worker (NGO scoped)
  async getWorkerReportsInNGO(ngoId: string, workerId: string): Promise<Report[]> {
    try {
      const snapshot = await this.collection
        .where('ngoId', '==', ngoId)
        .where('assignedTo', '==', workerId)
        .orderBy('updatedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    } catch (error) {
      console.error('Error fetching worker reports in NGO:', error);
      // Fallback
      const snapshot = await this.collection
        .where('ngoId', '==', ngoId)
        .where('assignedTo', '==', workerId)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[];
    }
  }

  // Assign report to worker (with NGO validation)
  async assignReportToWorker(
    reportId: string,
    ngoId: string,
    workerId: string,
    workerName: string
  ): Promise<void> {
    // First verify the report belongs to this NGO
    const reportDoc = await this.collection.doc(reportId).get();
    const report = reportDoc.data();
    
    if (!report || report.ngoId !== ngoId) {
      throw new Error('Report not found or does not belong to this NGO');
    }

    // Update report with worker assignment
    await this.collection.doc(reportId).update({
      status: 'assigned',
      assignedTo: workerId,
      workerId: workerId,
      workerName: workerName,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  // Get report statistics for NGO dashboard
  async getNGOReportStats(ngoId: string) {
    const reports = await this.getNGOReports(ngoId);
    
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      assigned: reports.filter(r => r.status === 'assigned').length,
      inProgress: reports.filter(r => r.status === 'in-progress').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      highSeverity: reports.filter(r => r.severity === 'High').length,
      mediumSeverity: reports.filter(r => r.severity === 'Medium').length,
      lowSeverity: reports.filter(r => r.severity === 'Low').length,
    };
  }
}

export default new NGOReportService();
