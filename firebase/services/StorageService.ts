import storage from '@react-native-firebase/storage';

class StorageService {
  // Upload image to Firebase Storage (React Native Firebase)
  async uploadImage(imageUri: string, path: string): Promise<string> {
    try {
      const reference = storage().ref(path);
      
      // Use putFile for React Native (not uploadBytes)
      await reference.putFile(imageUri);
      
      // Get download URL
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
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
      const reference = storage().ref(imagePathOrUrl);
      await reference.delete();
    } catch (error) {
      console.error('Image delete error:', error);
      throw error;
    }
  }
}

export default new StorageService();
