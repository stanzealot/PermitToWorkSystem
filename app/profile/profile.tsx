import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
// import { currentUser, mockPermits } from '../../services/mock-data';
// import { getRoleString } from '../../utils/helpers';
import { useRouter } from 'expo-router';
import { currentUser, mockPermits } from '../services/mock-data';
import { getRoleString } from '../utils/helpers';

const ProfileScreen = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const stats = {
    pending: mockPermits.filter(
      (p) => p.status === 'pending' && p.requesterId === currentUser.id
    ).length,
    active: mockPermits.filter(
      (p) =>
        (p.status === 'approved' || p.status === 'inProgress') &&
        p.requesterId === currentUser.id
    ).length,
    completed: mockPermits.filter(
      (p) => p.status === 'completed' && p.requesterId === currentUser.id
    ).length,
    approvalsPending: ['supervisor', 'safetyOfficer', 'admin'].includes(
      currentUser.role
    )
      ? mockPermits.filter((p) => p.status === 'pending').length
      : null,
  };

  const handleLogout = () => {
    router.replace('/auth/login');
  };

  const handleChangePassword = () => {
    Alert.prompt(
      'Change Password',
      'Enter new password',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: (password) => {
            if (password && password.length >= 6) {
              Alert.alert('Success', 'Password changed successfully');
            } else {
              Alert.alert('Error', 'Password must be at least 6 characters');
            }
          },
        },
      ],
      'secure-text'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.role}>{getRoleString(currentUser.role)}</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <StatItem label="Pending" value={stats.pending} color="#FF9800" />
          <StatItem label="Active" value={stats.active} color="#2196F3" />
          <StatItem label="Completed" value={stats.completed} color="#4CAF50" />
          {stats.approvalsPending !== null && (
            <StatItem
              label="Approvals"
              value={stats.approvalsPending}
              color="#9C27B0"
            />
          )}
        </View>
      </View>

      <View style={styles.preferencesCard}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceItem}>
          <Text>Notifications</Text>
          <Button
            title={notificationsEnabled ? 'ON' : 'OFF'}
            onPress={() => {
              setNotificationsEnabled(!notificationsEnabled);
              Alert.alert(
                `Notifications ${
                  !notificationsEnabled ? 'enabled' : 'disabled'
                }`
              );
            }}
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text>Dark Mode</Text>
          <Button
            title={darkModeEnabled ? 'ON' : 'OFF'}
            onPress={() => {
              setDarkModeEnabled(!darkModeEnabled);
              Alert.alert('App restart required for theme change');
            }}
          />
        </View>
        <Button title="Change Password" onPress={handleChangePassword} />
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>

      {['supervisor', 'safetyOfficer', 'admin'].includes(currentUser.role) && (
        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {currentUser.role === 'admin' && (
              <QuickAction
                icon="👥"
                label="Manage Users"
                onPress={() => router.push('/admin/admin-dashboard')}
              />
            )}
            {['supervisor', 'safetyOfficer', 'admin'].includes(
              currentUser.role
            ) && (
              <QuickAction
                icon="✅"
                label="Approvals"
                onPress={() => router.push('/permits/approval-queue')}
              />
            )}
          </View>
          <View style={styles.actionsRow}>
            {currentUser.role === 'admin' && (
              <QuickAction
                icon="⚙️"
                label="Settings"
                onPress={() => router.push('/admin/admin-dashboard')}
              />
            )}
            <QuickAction
              icon="❓"
              label="Help"
              onPress={() => Alert.alert('Help center would open here')}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const StatItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <View style={styles.statItem}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const QuickAction = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => (
  <View style={styles.quickAction}>
    <Button title={`${icon} ${label}`} onPress={onPress} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    color: 'white',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  role: {
    color: '#666',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  preferencesCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    elevation: 1,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  quickActionsCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    elevation: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quickAction: {
    width: '48%',
  },
});

export default ProfileScreen;
