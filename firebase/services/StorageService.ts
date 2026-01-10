import storage from '@react-native-firebase/storage';

class StorageService {
  // Upload image to Firebase Storage
  async uploadImage(imageUri: string, path: string): Promise<string> {
    try {
      const storageRef = storage().ref(path);

      await storageRef.putFile(imageUri);
      return await storageRef.getDownloadURL();
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
      const ref = storage().refFromURL(imagePathOrUrl);
      await ref.delete();
    } catch (error) {
      console.error('Image delete error:', error);
      throw error;
    }
  }
}

export default new StorageService();
