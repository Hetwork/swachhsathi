import functions from '@react-native-firebase/functions';

export interface CreateWorkerData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

class WorkerService {
  // Create worker account via Cloud Function
  async createWorker(workerData: CreateWorkerData): Promise<any> {
    try {
      const createWorkerFn = functions().httpsCallable('createWorker');
      const result = await createWorkerFn(workerData);
      return result.data;
    } catch (error) {
      console.error('Create worker error:', error);
      throw error;
    }
  }
}

export default new WorkerService();
