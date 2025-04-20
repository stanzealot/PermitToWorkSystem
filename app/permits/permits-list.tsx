import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockPermits } from '../services/mock-data';
import { PermitStatus } from '../models/permit';

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

const StatusBadge = ({ status }: any) => {
  let backgroundColor, textColor, icon;

  switch (status) {
    case PermitStatus.PENDING:
      backgroundColor = '#fff8e1';
      textColor = '#f39c12';
      icon = 'time-outline';
      break;
    case PermitStatus.APPROVED:
      backgroundColor = '#e1f5fe';
      textColor = '#3498db';
      icon = 'checkmark-circle-outline';
      break;
    case PermitStatus.IN_PROGRESS:
      backgroundColor = '#e0f2f1';
      textColor = '#16a085';
      icon = 'construct-outline';
      break;
    case PermitStatus.COMPLETED:
      backgroundColor = '#e8f5e9';
      textColor = '#27ae60';
      icon = 'checkmark-done-circle-outline';
      break;
    case PermitStatus.REJECTED:
      backgroundColor = '#ffebee';
      textColor = '#e74c3c';
      icon = 'close-circle-outline';
      break;
    default:
      backgroundColor = '#ecf0f1';
      textColor = '#7f8c8d';
      icon = 'alert-circle-outline';
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Ionicons name={icon} size={14} color={textColor} />
      <Text style={[styles.badgeText, { color: textColor }]}>
        {status.replace(/_/g, ' ')}
      </Text>
    </View>
  );
};

const PermitsListScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarIndicatorStyle: {
          backgroundColor: '#3498db',
          height: 3,
          borderRadius: 3,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'none',
        },
      }}
    >
      <Tab.Screen
        name="Pending"
        component={() => <PermitList status={PermitStatus.PENDING} />}
      />
      <Tab.Screen
        name="Approved"
        component={() => <PermitList status={PermitStatus.APPROVED} />}
      />
      <Tab.Screen
        name="In Progress"
        component={() => <PermitList status={PermitStatus.IN_PROGRESS} />}
      />
      <Tab.Screen
        name="Completed"
        component={() => <PermitList status={PermitStatus.COMPLETED} />}
      />
    </Tab.Navigator>
  );
};

const PermitList = ({ status }: any) => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredPermits = mockPermits.filter((p) => p.status === status);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getStatusIcon = (status: any) => {
    switch (status) {
      case PermitStatus.PENDING:
        return 'time-outline';
      case PermitStatus.APPROVED:
        return 'checkmark-circle-outline';
      case PermitStatus.IN_PROGRESS:
        return 'construct-outline';
      case PermitStatus.COMPLETED:
        return 'checkmark-done-circle-outline';
      case PermitStatus.REJECTED:
        return 'close-circle-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading permits...</Text>
      </View>
    );
  }

  if (filteredPermits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name={getStatusIcon(status)} size={60} color="#bdc3c7" />
        <Text style={styles.emptyText}>
          No {status.replace(/_/g, ' ').toLowerCase()} permits found
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={onRefresh}>
          <Text style={styles.emptyButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (date: string | number | Date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <FlatList
      data={filteredPermits}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/permits/permit-detail?id=${item.id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.permitId}>{item.id}</Text>
              <StatusBadge status={item.status} />
            </View>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() =>
                router.push(`/permits/permit-detail?id=${item.id}`)
              }
            >
              <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{item.workTitle}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color="#7f8c8d" />
              <Text style={styles.infoText}>{item.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
              <Text style={styles.infoText}>
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </Text>
            </View>
          </View>

          {item.hazards && item.hazards.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.hazards.slice(0, 3).map((hazard, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{hazard}</Text>
                </View>
              ))}
              {item.hazards.length > 3 && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>+{item.hazards.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptyButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 72,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permitId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
    marginRight: 10,
  },
  moreButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#7f8c8d',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f3f4',
    borderRadius: 30,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 30,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default PermitsListScreen;
