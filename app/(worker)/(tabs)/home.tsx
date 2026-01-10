import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useAllReports } from '@/firebase/hooks/useReport';
import { useUpdateUser, useUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { getCurrentLocation, startLocationTracking, stopLocationTracking } from '@/utils/locationTracker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const WorkerHome = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData, isLoading } = useUser(authUser?.uid);
  const { data: reports } = useAllReports();
  const updateUser = useUpdateUser();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsActive(userData.isActive || false);
    }
  }, [userData]);

  useEffect(() => {
    const initLocation = async () => {
      if (authUser?.uid) {
        const location = await getCurrentLocation();
        if (location) {
          await updateUser.mutateAsync({
            uid: authUser.uid,
            userData: {
              currentLocation: {
                latitude: location.latitude,
                longitude: location.longitude,
                timestamp: new Date().toISOString(),
              },
            },
          });
        }
      }
    };

    initLocation();
  }, [authUser?.uid]);

  useEffect(() => {
    if (isActive && authUser?.uid) {
      startLocationTracking(authUser.uid);
    } else {
      stopLocationTracking();
    }

    return () => stopLocationTracking();
  }, [isActive, authUser?.uid]);

  const handleToggleActive = async (value: boolean) => {
    try {
      if (value) {
        const hasPermission = await getCurrentLocation();
        if (!hasPermission) {
          Alert.alert('Permission Required', 'Location permission is required to go active');
          return;
        }
      }

      await updateUser.mutateAsync({
        uid: authUser!.uid,
        userData: { isActive: value },
      });
      setIsActive(value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const myTasks = reports?.filter(r => r.assignedTo === authUser?.uid && r.status !== 'resolved') || [];
  const recentTasks = myTasks.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return { bg: '#DBEAFE', text: '#3B82F6' };
      case 'in-progress': return { bg: '#E0E7FF', text: '#6366F1' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  if (isLoading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Container>
    );
  }

  const TaskItem = ({ item }: any) => {
    const statusColors = getStatusColor(item.status);
    return (
      <TouchableOpacity 
        style={styles.taskCard}
        onPress={() => router.push(`/(worker)/task-details?id=${item.id}`)}
      >
        <View style={styles.taskHeader}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.taskImage} />
          ) : (
            <View style={styles.taskImagePlaceholder}>
              <Ionicons name="image-outline" size={32} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.taskInfo}>
            <Text style={styles.taskCategory}>{item.category || 'Garbage Report'}</Text>
            <Text style={styles.taskDescription} numberOfLines={2}>{item.description}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userData?.name || 'Worker'}!</Text>
          <Text style={styles.subGreeting}>Ready to make a difference today?</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusIndicator, { backgroundColor: isActive ? '#10B981' : '#EF4444' }]} />
            <View>
              <Text style={styles.statusTitle}>Work Status</Text>
              <Text style={styles.statusSubtitle}>{isActive ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
          <Switch
            value={isActive}
            onValueChange={handleToggleActive}
            trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
            thumbColor={isActive ? '#10B981' : '#9CA3AF'}
            disabled={updateUser.isPending}
          />
        </View>

        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => router.push('/(worker)/map-view')}
        >
          <Ionicons name="map" size={24} color={colors.white} />
          <Text style={styles.mapButtonText}>View Map & Pending Reports</Text>
        </TouchableOpacity>

        <View style={styles.tasksSection}>
          <View style={styles.tasksSectionHeader}>
            <Text style={styles.sectionTitle}>Recent Assigned Tasks</Text>
            <Text style={styles.taskCount}>{myTasks.length} active</Text>
          </View>

          {recentTasks.length > 0 ? (
            <FlatList
              data={recentTasks}
              renderItem={({ item }) => <TaskItem item={item} />}
              keyExtractor={(item) => item.id!}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tasksList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No active tasks</Text>
              <Text style={styles.emptySubtext}>You're all caught up!</Text>
            </View>
          )}
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background || '#F3F4F6',
    padding: 20,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  tasksSection: {
    flex: 1,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  taskCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  taskImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  taskImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  taskCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});

export default WorkerHome;
