import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockUsers, setCurrentUser } from '../services/mock-data';
import { getRoleString } from '../utils/helpers';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(mockUsers[0].id);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const dropdownAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: isDropdownOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDropdownOpen]);

  const dropdownHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, mockUsers.length * 60],
  });

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const selectedUser =
        mockUsers.find((user) => user.id === selectedUserId) || mockUsers[0];
      setCurrentUser(selectedUser);
      setIsLoading(false);
      router.replace('/dashboard/dashboard');
    }, 1000);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectUser = (userId: React.SetStateAction<string>) => {
    setSelectedUserId(userId);
    setIsDropdownOpen(false);
  };

  const selectedUser = mockUsers.find((user) => user.id === selectedUserId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="shield-checkmark" size={50} color="#3498db" />
            </View>
            <Text style={styles.title}>Permit to Work</Text>
            <Text style={styles.subtitle}>Safety Management System</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>USER ROLE</Text>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={toggleDropdown}
              activeOpacity={0.7}
            >
              <Text style={styles.selectedText}>
                {selectedUser
                  ? `${selectedUser.name} (${getRoleString(selectedUser.role)})`
                  : 'Select a role'}
              </Text>
              <Ionicons
                name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#34495e"
              />
            </TouchableOpacity>

            <Animated.View
              style={[styles.dropdownList, { height: dropdownHeight }]}
            >
              {mockUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.dropdownItem,
                    selectedUserId === user.id && styles.dropdownItemSelected,
                  ]}
                  onPress={() => selectUser(user.id)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedUserId === user.id &&
                        styles.dropdownItemTextSelected,
                    ]}
                  >
                    {user.name} ({getRoleString(user.role)})
                  </Text>
                  {selectedUserId === user.id && (
                    <Ionicons name="checkmark" size={22} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>

            <Text style={styles.label}>USERNAME</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#95a5a6"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#95a5a6"
              />
            </View>

            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#95a5a6"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor="#95a5a6"
              />
              <TouchableOpacity
                style={styles.visibilityToggle}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#3498db"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
                (!username || !password) && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading || !username || !password}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loginButtonText}>Logging in</Text>
                  <View style={styles.loadingDots}>
                    <View style={[styles.loadingDot, styles.loadingDot1]} />
                    <View style={[styles.loadingDot, styles.loadingDot2]} />
                    <View style={[styles.loadingDot, styles.loadingDot3]} />
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <Ionicons name="arrow-forward" size={22} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() =>
                Alert.alert('Forgot Password', 'Feature coming soon')
              }
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Text style={styles.versionText}>v1.0.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  dropdownSelector: {
    backgroundColor: '#f5f7fa',
    borderWidth: 1,
    borderColor: '#e6e9ed',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedText: {
    fontSize: 16,
    color: '#34495e',
  },
  dropdownList: {
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f5f7fa',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e9ed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  dropdownItemSelected: {
    backgroundColor: '#3498db',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#34495e',
  },
  dropdownItemTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderWidth: 1,
    borderColor: '#e6e9ed',
    borderRadius: 12,
    marginBottom: 20,
    height: 58,
    position: 'relative',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  visibilityToggle: {
    padding: 12,
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginHorizontal: 2,
    opacity: 0.7,
  },
  loadingDot1: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationIterationCount: 'infinite',
  },
  loadingDot2: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0.2s',
    animationIterationCount: 'infinite',
  },
  loadingDot3: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0.4s',
    animationIterationCount: 'infinite',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 8,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 15,
    fontWeight: '500',
  },
  versionText: {
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 12,
  },
});

export default LoginScreen;
