import AppButton from '@/component/AppButton';
import AppTextInput from '@/component/AppTextInput';
import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useCreateReport } from '@/firebase/hooks/useReport';
import { useUser } from '@/firebase/hooks/useUser';
import AIService from '@/firebase/services/AIService';
import StorageService from '@/firebase/services/StorageService';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NewReport = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  const createReport = useCreateReport();
  
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || locationPermission.status !== 'granted') {
      Alert.alert('Permissions Required', 'Camera and location permissions are required to report garbage.');
      return false;
    }
    return true;
  };

  const captureImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await getLocation();
      await analyzeImageWithAI(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      
      setLocation({
        coords: loc.coords,
        address: address[0] ? `${address[0].street || ''}, ${address[0].city || ''}` : 'Location detected',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const analyzeImageWithAI = async (imageUri: string) => {
    if (!authUser) return;
    
    setAiAnalyzing(true);
    try {
      const result = await AIService.analyzeGarbageImage(imageUri, authUser.uid);
      
      if (result.isGarbage) {
        setAiSuggestion(result);
        if (result.severity) setSeverity(result.severity);
      } else {
        Alert.alert('No Garbage Detected', result.description);
      }
      setAiAnalyzing(false);
    } catch (error) {
      setAiAnalyzing(false);
      Alert.alert('Error', 'Failed to analyze image. You can still submit manually.');
      console.error('AI Analysis failed:', error);
    }
  };

  const acceptAISuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion.category || '');
      setDescription(aiSuggestion.description);
      if (aiSuggestion.severity) setSeverity(aiSuggestion.severity);
      setAiSuggestion(null);
    }
  };

  const handleSubmit = async () => {
    if (!image || !location || !description || !category) {
      Alert.alert('Error', 'Please capture image and fill all fields');
      return;
    }

    if (!authUser || !userData) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setSubmitting(true);
    try {
      console.log('Uploading image from:', image);
      const imageUrl = await StorageService.uploadReportImage(image, authUser.uid);
      console.log('Image uploaded to Firebase:', imageUrl);
      
      if (!imageUrl || !imageUrl.startsWith('http')) {
        throw new Error('Invalid Firebase URL received');
      }
      
      await createReport.mutateAsync({
        userId: authUser.uid,
        userName: userData.name || 'User',
        userEmail: userData.email,
        imageUrl,
        category,
        description,
        severity,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: location.address,
        },
        status: 'pending',
      });

      Alert.alert('Success', 'Report submitted successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', `Failed to submit report: ${error.message || 'Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {!image ? (
          <TouchableOpacity style={styles.cameraCard} onPress={captureImage}>
            <Ionicons name="camera" size={64} color={colors.primary} />
            <Text style={styles.cameraText}>Tap to Capture Garbage Photo</Text>
            <Text style={styles.cameraSubtext}>Camera will open automatically</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.capturedImage} />
            <TouchableOpacity style={styles.retakeButton} onPress={captureImage}>
              <Ionicons name="camera-reverse" size={20} color={colors.white} />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}

        {aiAnalyzing && (
          <View style={styles.aiAnalyzing}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.aiAnalyzingText}>AI is analyzing the image...</Text>
          </View>
        )}

        {aiSuggestion && (
          <View style={styles.aiSuggestionCard}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={20} color="#8B5CF6" />
              <Text style={styles.aiTitle}>AI Detection</Text>
            </View>
            <Text style={styles.aiResult}>
              Garbage detected: <Text style={styles.aiHighlight}>{aiSuggestion.severity} severity</Text>
            </Text>
            <Text style={styles.aiCategory}>Category: {aiSuggestion.category}</Text>
            <Text style={styles.aiConfidence}>Confidence: {(aiSuggestion.confidence * 100).toFixed(0)}%</Text>
            <View style={styles.aiActions}>
              <TouchableOpacity style={styles.aiAcceptButton} onPress={acceptAISuggestion}>
                <Text style={styles.aiAcceptText}>Auto-fill Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAiSuggestion(null)}>
                <Text style={styles.aiDismissText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {location && (
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.locationTitle}>Location Detected</Text>
            </View>
            <Text style={styles.locationText}>{location.address}</Text>
            <Text style={styles.locationCoords}>
              {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Category</Text>
          <AppTextInput
            placeholder="e.g., Plastic Waste, Food Waste"
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Description</Text>
          <AppTextInput
            placeholder="Describe the garbage issue..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <AppButton
            title={submitting ? 'Submitting...' : 'Submit Report'}
            onPress={handleSubmit}
            style={{ marginTop: 20 }}
            disabled={!image || !location || submitting}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraCard: {
    margin: 20,
    padding: 60,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  cameraSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  imageContainer: {
    margin: 20,
    position: 'relative',
  },
  capturedImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  retakeText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  aiAnalyzing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    gap: 12,
  },
  aiAnalyzingText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  aiSuggestionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  aiResult: {
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  aiHighlight: {
    fontWeight: '700',
    color: '#EF4444',
  },
  aiCategory: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  aiConfidence: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  aiActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aiAcceptButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  aiAcceptText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  aiDismissText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  locationCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 8,
  },
});

export default NewReport;
