import firestore from '@react-native-firebase/firestore';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'technical' | 'account' | 'report' | 'general' | 'feedback';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  adminResponse?: string;
}

class SupportService {
  private collection = firestore().collection('support_tickets');

  async createTicket(data: {
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    message: string;
    category: SupportTicket['category'];
  }): Promise<string> {
    try {
      const ticketData = {
        ...data,
        status: 'open' as const,
        priority: 'medium' as const,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await this.collection.add(ticketData);
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create support ticket');
    }
  }

  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        resolvedAt: doc.data().resolvedAt?.toDate(),
      })) as SupportTicket[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch support tickets');
    }
  }

  async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    try {
      const doc = await this.collection.doc(ticketId).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate() || new Date(),
        updatedAt: doc.data()?.updatedAt?.toDate() || new Date(),
        resolvedAt: doc.data()?.resolvedAt?.toDate(),
      } as SupportTicket;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch ticket');
    }
  }

  async updateTicketStatus(
    ticketId: string,
    status: SupportTicket['status']
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (status === 'resolved' || status === 'closed') {
        updateData.resolvedAt = firestore.FieldValue.serverTimestamp();
      }

      await this.collection.doc(ticketId).update(updateData);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update ticket status');
    }
  }

  async getAllTickets(): Promise<SupportTicket[]> {
    try {
      const snapshot = await this.collection
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        resolvedAt: doc.data().resolvedAt?.toDate(),
      })) as SupportTicket[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch all tickets');
    }
  }

  async addAdminResponse(
    ticketId: string,
    response: string
  ): Promise<void> {
    try {
      await this.collection.doc(ticketId).update({
        adminResponse: response,
        status: 'in_progress',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add admin response');
    }
  }
}

export default new SupportService();
