import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { currentUser } from '../services/mock-data';
import CreatePermitScreen from '../permits/create-permit';
import PermitsListScreen from '../permits/permits-list';
import ApprovalQueueScreen from '../permits/approval-queue';
import ProfileScreen from '../profile/profile';
import AdminDashboard from '../admin/admin-dashboard';

const Tab = createBottomTabNavigator();

const DashboardScreen = () => {
  const router = useRouter();

  const getTabIcon = (routeName: string, focused: boolean) => {
    let iconName;

    switch (routeName) {
      case 'permits':
        iconName = focused ? 'document-text' : 'document-text-outline';
        break;
      case 'create-permit':
        iconName = focused ? 'add-circle' : 'add-circle-outline';
        break;
      case 'approvals':
        iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
        break;
      case 'profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      case 'admin':
        iconName = focused ? 'settings' : 'settings-outline';
        break;
      default:
        iconName = 'alert-circle-outline';
    }

    return iconName;
  };

  const renderHeaderRight = () => {
    return (
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace('/auth/login')}
      >
        <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerRight: renderHeaderRight,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 5,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="permits"
        component={PermitsListScreen}
        options={{
          title: 'My Permits',
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Ionicons name="shield-checkmark" size={24} color="#3498db" />
              <Text style={styles.headerTitle}>PTW System</Text>
            </View>
          ),
        }}
      />

      {currentUser.role === 'worker' && (
        <Tab.Screen
          name="create-permit"
          component={CreatePermitScreen}
          options={{ title: 'New Permit' }}
        />
      )}

      {(currentUser.role === 'supervisor' ||
        currentUser.role === 'safetyOfficer') && (
        <Tab.Screen
          name="approvals"
          component={ApprovalQueueScreen}
          options={{ title: 'Approvals' }}
        />
      )}

      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />

      {currentUser.role === 'admin' && (
        <Tab.Screen
          name="admin"
          component={AdminDashboard}
          options={{ title: 'Admin' }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#fff0f0',
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default DashboardScreen;
