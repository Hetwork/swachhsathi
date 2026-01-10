import Container from "@/component/Container";
import { useAuthUser } from "@/firebase/hooks/useAuth";
import { useUserReports } from "@/firebase/hooks/useReport";
import { colors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const Reports = () => {
  const { data: authUser } = useAuthUser();
  const { data: reports, isLoading } = useUserReports(authUser?.uid);
  const [filter, setFilter] = useState<
    "all" | "pending" | "assigned" | "in-progress" | "resolved"
  >("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#FEF3C7", text: "#F59E0B", icon: "time-outline" };
      case "assigned":
        return { bg: "#DBEAFE", text: "#3B82F6", icon: "person-outline" };
      case "in-progress":
        return { bg: "#E0E7FF", text: "#6366F1", icon: "sync-outline" };
      case "resolved":
        return {
          bg: "#D1FAE5",
          text: "#10B981",
          icon: "checkmark-circle-outline",
        };
      default:
        return { bg: "#F3F4F6", text: "#6B7280", icon: "help-outline" };
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const seconds = Math.floor((Date.now() - timestamp.toMillis()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredReports =
    reports?.filter((report) =>
      filter === "all" ? true : report.status === filter
    ) || [];

  const FilterChip = ({ label, value }: any) => (
      <TouchableOpacity
        style={[styles.filterChip, filter === value && styles.filterChipActive]}
        onPress={() => setFilter(value)}
      >
        <Text
          style={[
            styles.filterChipText,
            filter === value && styles.filterChipTextActive,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </TouchableOpacity>
  );

  const ReportItem = ({ item }: any) => {
    const statusColors = getStatusColor(item.status);
    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => router.push(`/(user)/report-details?id=${item.id}`)}
      >
        <View style={styles.reportHeader}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.reportImage} />
          ) : (
            <View style={styles.reportImagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={40}
                color={colors.textSecondary}
              />
            </View>
          )}
          <View style={styles.reportHeaderInfo}>
            <Text style={styles.reportCategory}>{item.category || 'General Report'}</Text>
            <View style={styles.userRow}>
              <Ionicons
                name="person-outline"
                size={12}
                color={colors.textSecondary}
              />
              <Text style={styles.userName}>{item.userName}</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.reportLocation} numberOfLines={1}>
                {item.location?.address || 'Unknown location'}
              </Text>
            </View>
            <Text style={styles.reportTime}>{getTimeAgo(item.updatedAt || item.createdAt)}</Text>
          </View>
        </View>

        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description || 'No description provided'}
        </Text>

        <View style={styles.reportFooter}>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
          >
            <Ionicons
              name={statusColors.icon as any}
              size={14}
              color={statusColors.text}
            />
            <Text style={[styles.statusText, { color: statusColors.text }]} numberOfLines={1}>
              {item.status.charAt(0).toUpperCase() +
                item.status.slice(1).replace(/-/g, " ")}
            </Text>
          </View>
          {item.severity && (
            <View style={styles.severityBadge}>
              <Ionicons
                name={
                  item.severity === "High"
                    ? "alert-circle"
                    : item.severity === "Medium"
                    ? "warning"
                    : "information-circle"
                }
                size={14}
                color={
                  item.severity === "High"
                    ? "#EF4444"
                    : item.severity === "Medium"
                    ? "#F59E0B"
                    : "#10B981"
                }
              />
              <Text style={styles.severityText}>{item.severity}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {reports?.length || 0} Total Reports
          </Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersContainer}
      >
        <FilterChip label="All" value="all" />
        <FilterChip label="Pending" value="pending" />
        <FilterChip label="Assigned" value="assigned" />
        <FilterChip label="In Progress" value="in-progress" />
        <FilterChip label="Resolved" value="resolved" />
      </ScrollView>

      <View style={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading reports...</Text>
          </View>
        ) : filteredReports.length > 0 ? (
          <FlatList
            data={filteredReports}
            renderItem={({ item }) => <ReportItem item={item} />}
            keyExtractor={(item) => item.id!}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>
              {filter === "all" ? "No reports yet" : `No ${filter} reports`}
            </Text>
            <Text style={styles.emptySubtext}>
              {filter === "all"
                ? "Create your first report to get started"
                : "Try selecting a different filter"}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(user)/new-report')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contentContainer: {
    flex: 1,
  },
  filtersScrollView: {
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContainer: {
    padding: 20,
  },
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reportImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  reportImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  reportHeaderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  reportCategory: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  userName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reportLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  reportTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    flexShrink: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Reports;
