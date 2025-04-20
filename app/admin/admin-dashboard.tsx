import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { mockPermits, mockUsers } from '../services/mock-data';
import { PermitStatus } from '../models/permit';
// import { mockPermits, mockUsers } from '../../services/mock-data';
// import { PermitStatus } from '../../models/permit';

const Tab = createMaterialTopTabNavigator();

const AdminDashboard = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={AdminDashboardTab} />
      <Tab.Screen name="Users" component={AdminUsersTab} />
      <Tab.Screen name="Settings" component={AdminSettingsTab} />
    </Tab.Navigator>
  );
};

const AdminDashboardTab = () => {
  const stats = {
    totalPermits: mockPermits.length,
    pendingApprovals: mockPermits.filter(
      (p) => p.status === PermitStatus.PENDING
    ).length,
    activeWork: mockPermits.filter((p) => p.status === PermitStatus.IN_PROGRESS)
      .length,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>System Overview</Text>

      <View style={styles.statsRow}>
        <StatCard
          title="Total Permits"
          value={stats.totalPermits}
          color="#2196F3"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          color="#FF9800"
        />
        <StatCard
          title="Active Work"
          value={stats.activeWork}
          color="#4CAF50"
        />
      </View>

      <Text style={styles.header}>Recent Activity</Text>
      <View style={styles.activityCard}>
        {[
          'Jane approved permit PTW-001',
          'Mike rejected permit PTW-004',
          'John submitted new permit',
        ].map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Text>{activity}</Text>
            <Text style={styles.activityTime}>
              {index === 0
                ? '10 min ago'
                : index === 1
                ? '1 hour ago'
                : '3 hours ago'}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.header}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <ActionButton icon="👥" label="Add User" />
        <ActionButton icon="📊" label="Reports" />
        <ActionButton icon="💾" label="Backup" />
      </View>
      <View style={styles.actionsRow}>
        <ActionButton icon="🔄" label="Restore" />
        <ActionButton icon="🔔" label="Notify All" />
        <ActionButton icon="🔒" label="Reset Passwords" />
      </View>

      <Text style={styles.header}>Pending Approvals</Text>
      {stats.pendingApprovals > 0 ? (
        mockPermits
          .filter((p) => p.status === PermitStatus.PENDING)
          .slice(0, 3)
          .map((permit) => (
            <View key={permit.id} style={styles.permitCard}>
              <Text style={styles.permitTitle}>{permit.workTitle}</Text>
              <Text>Location: {permit.location}</Text>
            </View>
          ))
      ) : (
        <Text style={styles.noData}>No pending approvals</Text>
      )}
    </ScrollView>
  );
};

const AdminUsersTab = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>User Management</Text>
      {mockUsers.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text>{user.role}</Text>
          <View style={styles.userActions}>
            <Button title="Edit" onPress={() => {}} />
            <Button title="Delete" color="red" onPress={() => {}} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const AdminSettingsTab = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>System Settings</Text>

      <View style={styles.settingItem}>
        <Text>Enable Notifications</Text>
        <Button
          title={notificationsEnabled ? 'ON' : 'OFF'}
          onPress={() => setNotificationsEnabled(!notificationsEnabled)}
        />
      </View>

      <View style={styles.settingItem}>
        <Text>Dark Mode</Text>
        <Button
          title={darkModeEnabled ? 'ON' : 'OFF'}
          onPress={() => setDarkModeEnabled(!darkModeEnabled)}
        />
      </View>

      <View style={styles.settingItem}>
        <Text>Analytics Collection</Text>
        <Button
          title={analyticsEnabled ? 'ON' : 'OFF'}
          onPress={() => setAnalyticsEnabled(!analyticsEnabled)}
        />
      </View>

      <Text style={styles.header}>System Maintenance</Text>
      <Button title="Backup Database" onPress={() => {}} />
      <Button title="Restore Database" onPress={() => {}} />
      <Button title="Clear Cache" onPress={() => {}} />
      <Button title="Check for Updates" onPress={() => {}} />

      <Text style={[styles.header, { color: 'red' }]}>Danger Zone</Text>
      <Button title="Reset System" color="red" onPress={() => {}} />
      <Button title="Logout All Users" color="red" onPress={() => {}} />
    </ScrollView>
  );
};

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <View style={[styles.statCard, { borderColor: color }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const ActionButton = ({ icon, label }: { icon: string; label: string }) => (
  <View style={styles.actionButton}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    elevation: 1,
  },
  activityItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    width: '30%',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionLabel: {
    fontSize: 12,
  },
  permitCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
  },
  permitTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noData: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
  },
});

export default AdminDashboard;
