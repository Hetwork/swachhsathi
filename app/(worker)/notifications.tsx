import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Notification {
  id: string;
  type: 'task_assigned' | 'task_update' | 'system' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  taskId?: string;
}

const Notifications = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  // Mock notifications - in production, fetch from Firebase
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: 'You have been assigned a new cleanup task at MG Road Junction',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      read: false,
      taskId: 'task123',
    },
    {
      id: '2',
      type: 'achievement',
      title: '10 Tasks Completed!',
      message: 'Congratulations! You\'ve completed 10 tasks this month',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
    {
      id: '3',
      type: 'task_update',
      title: 'Task Status Updated',
      message: 'Your completed task at Brigade Road has been verified',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      taskId: 'task122',
    },
    {
      id: '4',
      type: 'system',
      title: 'App Update Available',
      message: 'A new version of Swachhsathi is available. Update now for better performance',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
    {
      id: '5',
      type: 'task_assigned',
      title: 'Urgent Task Assigned',
      message: 'High priority cleanup required at Indiranagar Market',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true,
      taskId: 'task121',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return { name: 'clipboard', color: '#3B82F6' };
      case 'task_update':
        return { name: 'checkmark-circle', color: '#10B981' };
      case 'achievement':
        return { name: 'trophy', color: '#F59E0B' };
      case 'system':
        return { name: 'information-circle', color: '#8B5CF6' };
      default:
        return { name: 'notifications', color: colors.primary };
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Navigate to relevant screen
    if (notification.taskId) {
      router.push(`../task-details?id=${notification.taskId}`);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markReadButton}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={{ width: 40 }} />}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}
          >
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'unread' && styles.filterTextActive,
            ]}
          >
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              {filter === 'unread'
                ? 'You have no unread notifications'
                : 'You have no notifications yet'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => {
            const icon = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationCardUnread,
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                  <Ionicons name={icon.name as any} size={24} color={icon.color} />
                </View>
                <View style={styles.contentContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.timestamp}>{getTimeAgo(notification.timestamp)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
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
    flex: 1,
    textAlign: 'center',
  },
  markReadButton: {
    padding: 8,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.background || '#F9FAFB',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  scrollContent: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  notificationCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default Notifications;
