import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { getApp } from '@react-native-firebase/app';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WasteAnalysisResult {
  type: string;
  category: 'biodegradable' | 'recyclable' | 'hazardous' | 'general';
  confidence: number;
  recyclingInfo: string;
  disposalMethod: string;
}

const WasteScanner = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const analyzeWaste = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const functions = getFunctions(getApp());
      const analyzeWasteImage = httpsCallable<{ imageUri: string }, WasteAnalysisResult>(
        functions,
        'analyzeWasteImage'
      );

      const response = await analyzeWasteImage({ imageUri: selectedImage });
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing waste:', error);
      Alert.alert('Error', 'Failed to analyze waste. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'biodegradable': return '#16A34A';
      case 'recyclable': return '#0284C7';
      case 'hazardous': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'biodegradable': return 'leaf';
      case 'recyclable': return 'refresh';
      case 'hazardous': return 'warning';
      default: return 'trash';
    }
  };

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Waste Scanner</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              Take a photo of waste to identify its type and get proper disposal instructions
            </Text>
          </View>

          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => {
                  setSelectedImage(null);
                  setResult(null);
                }}
              >
                <Ionicons name="close-circle" size={32} color={colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadSection}>
              <Ionicons name="scan" size={64} color={colors.textSecondary} />
              <Text style={styles.uploadText}>No image selected</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cameraButton]} 
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={24} color={colors.white} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.galleryButton]} 
              onPress={handlePickImage}
            >
              <Ionicons name="images" size={24} color={colors.white} />
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && !result && (
            <TouchableOpacity 
              style={styles.analyzeButton} 
              onPress={analyzeWaste}
              disabled={analyzing}
            >
              {analyzing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color={colors.white} />
                  <Text style={styles.analyzeButtonText}>Analyze Waste</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {result && (
            <View style={styles.resultCard}>
              <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(result.category)}15` }]}>
                <Ionicons 
                  name={getCategoryIcon(result.category) as any} 
                  size={40} 
                  color={getCategoryColor(result.category)} 
                />
              </View>

              <Text style={styles.resultTitle}>{result.type}</Text>
              <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(result.category) }]}>
                <Text style={styles.categoryTagText}>{result.category.toUpperCase()}</Text>
              </View>

              <View style={styles.confidenceBar}>
                <Text style={styles.confidenceLabel}>Confidence</Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${result.confidence}%`, backgroundColor: getCategoryColor(result.category) }
                    ]} 
                  />
                </View>
                <Text style={styles.confidenceValue}>{result.confidence}%</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Recycling Information</Text>
                <Text style={styles.sectionContent}>{result.recyclingInfo}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Disposal Method</Text>
                <Text style={styles.sectionContent}>{result.disposalMethod}</Text>
              </View>

              <TouchableOpacity 
                style={styles.scanAgainButton}
                onPress={() => {
                  setSelectedImage(null);
                  setResult(null);
                }}
              >
                <Ionicons name="scan" size={20} color={colors.primary} />
                <Text style={styles.scanAgainText}>Scan Another Item</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
  uploadSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border || '#E5E7EB',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: colors.primary,
  },
  galleryButton: {
    backgroundColor: '#8B5CF6',
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  analyzeButton: {
    flexDirection: 'row',
    backgroundColor: '#16A34A',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  analyzeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  categoryBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryTag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryTagText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceBar: {
    width: '100%',
    marginBottom: 24,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  infoSection: {
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    marginTop: 8,
  },
  scanAgainText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default WasteScanner;
