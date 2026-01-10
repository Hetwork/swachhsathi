import functions from '@react-native-firebase/functions';
import StorageService from './StorageService';

export interface AIAnalysisResult {
  isGarbage: boolean;
  category: string | null;
  severity: 'Low' | 'Medium' | 'High' | null;
  confidence: number;
  description: string;
  detectedLabels?: string[];
  objectCount?: number;
}

class AIService {
  // Analyze garbage image using Firebase Function
  async analyzeGarbageImage(
    localImageUri: string,
    userId: string
  ): Promise<AIAnalysisResult> {
    try {
      // Upload image to get public URL
      const tempPath = `temp/${userId}/${Date.now()}.jpg`;
      const imageUrl = await StorageService.uploadImage(localImageUri, tempPath);

      // Call Firebase Function
      const analyzeImage = functions().httpsCallable('analyzeGarbageImage');
      const result = await analyzeImage({ imageUri: imageUrl });

      return result.data as AIAnalysisResult;
    } catch (error) {
      console.error('AI Analysis error:', error);
      throw error;
    }
  }

  // Compare before and after images
  async compareBeforeAfter(
    beforeImageUrl: string,
    afterImageUrl: string
  ): Promise<{
    isClean: boolean;
    message: string;
    cleanlinessScore: number;
    beforeLabels?: string[];
    afterLabels?: string[];
  }> {
    try {
      const compareImages = functions().httpsCallable('compareBeforeAfter');
      const result = await compareImages({ beforeImageUrl, afterImageUrl });

      return result.data;
    } catch (error) {
      console.error('Image comparison error:', error);
      throw error;
    }
  }
}

export default new AIService();
