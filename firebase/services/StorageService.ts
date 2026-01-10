import { getApp } from '@react-native-firebase/app';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@react-native-firebase/storage';

class StorageService {
  // Upload image to Firebase Storage (modular API)
  async uploadImage(imageUri: string, path: string): Promise<string> {
    try {
      const storageInstance = getStorage(getApp());
      const storageRef = ref(storageInstance, path);

      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  // Upload report image
  async uploadReportImage(imageUri: string, userId: string): Promise<string> {
    const filename = `reports/${userId}/${Date.now()}.jpg`;
    return this.uploadImage(imageUri, filename);
  }

  // Upload profile image
  async uploadProfileImage(imageUri: string, userId: string): Promise<string> {
    const filename = `profiles/${userId}/avatar.jpg`;
    return this.uploadImage(imageUri, filename);
  }

  // Delete image from storage (by full path or URL)
  async deleteImage(imagePathOrUrl: string): Promise<void> {
    try {
      const storageInstance = getStorage(getApp());
      const storageRef = ref(storageInstance, imagePathOrUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Image delete error:', error);
      throw error;
    }
  }
}

export default new StorageService();
