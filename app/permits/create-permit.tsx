import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { currentUser, mockPermits } from '../services/mock-data';
import { Permit, PermitStatus } from '../models/permit';
import { usePermits } from '../context/PermitsContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CreatePermitScreen = () => {
  const { addPermit } = usePermits();
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [workTitle, setWorkTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000)); // +1 day
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [selectedPrecautions, setSelectedPrecautions] = useState<string[]>([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showHazardModal, setShowHazardModal] = useState(false);
  const [showPrecautionModal, setShowPrecautionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Calculate form progress
    let progress = 0;
    if (workTitle) progress += 0.25;
    if (location) progress += 0.25;
    if (description) progress += 0.25;
    if (selectedHazards.length > 0 && selectedPrecautions.length > 0)
      progress += 0.25;
    setFormProgress(progress);
  }, [workTitle, location, description, selectedHazards, selectedPrecautions]);

  const availableHazards: string[] = [
    'Electrical',
    'Fire',
    'Chemical',
    'Height work',
    'Confined space',
    'Hot work',
    'Machinery',
    'Toxic materials',
    'Heavy lifting',
    'Slips and trips',
  ];

  const availablePrecautions: string[] = [
    'PPE required',
    'Area isolation',
    'Fire extinguisher',
    'First aid kit',
    'Lockout/Tagout',
    'Ventilation',
    'Safety harness',
    'Gas detection',
    'Training required',
    'Supervision required',
    'Emergency response plan',
  ];

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    if (!workTitle || !location || !description) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }

    if (selectedHazards.length === 0) {
      Alert.alert('Missing Hazards', 'Please identify at least one hazard');
      return;
    }

    if (selectedPrecautions.length === 0) {
      Alert.alert(
        'Missing Precautions',
        'Please select at least one safety precaution'
      );
      return;
    }

    animateButton();
    setIsSubmitting(true);

    setTimeout(() => {
      const newPermit = {
        id: `PTW-${Date.now()}`.padStart(7, '0'),
        workTitle,
        location,
        requesterId: currentUser.id,
        description,
        startDate,
        endDate,
        hazards: selectedHazards,
        precautions: selectedPrecautions,
        status: PermitStatus.PENDING,
        createdAt: new Date(),
      };

      addPermit(newPermit);
      setIsSubmitting(false);

      Alert.alert('Success', 'Permit request submitted successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  const toggleHazard = (hazard: string) => {
    setSelectedHazards((prev) =>
      prev.includes(hazard)
        ? prev.filter((h) => h !== hazard)
        : [...prev, hazard]
    );
  };

  const togglePrecaution = (precaution: string) => {
    setSelectedPrecautions((prev) =>
      prev.includes(precaution)
        ? prev.filter((p) => p !== precaution)
        : [...prev, precaution]
    );
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const renderCheckboxItem = (
    item: string,
    selectedItems: string[],
    toggleFunction: (item: string) => void,
    key: string
  ) => {
    const isSelected = selectedItems.includes(item);

    return (
      <TouchableOpacity
        key={key}
        style={styles.checkboxItem}
        onPress={() => toggleFunction(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
        <Text style={styles.checkboxLabel}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const formValid =
    workTitle &&
    location &&
    description &&
    selectedHazards.length > 0 &&
    selectedPrecautions.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Permit</Text>
        <View style={styles.emptySpace} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${formProgress * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(formProgress * 100)}% completed
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Details</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Work Title <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter work title"
                  value={workTitle}
                  onChangeText={setWorkTitle}
                  maxLength={100}
                  placeholderTextColor="#95a5a6"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Location <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#3498db"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Enter work location"
                  value={location}
                  onChangeText={setLocation}
                  maxLength={100}
                  placeholderTextColor="#95a5a6"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Description <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputContainer, styles.textareaContainer]}>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Provide a detailed description of the work to be performed"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  numberOfLines={6}
                  placeholderTextColor="#95a5a6"
                />
              </View>
              <Text style={styles.helperText}>
                Describe the scope, methods and equipment needed
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Period</Text>

            <View style={styles.dateContainer}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#3498db" />
                  <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                  <Ionicons name="chevron-down" size={16} color="#95a5a6" />
                </TouchableOpacity>
              </View>

              <View style={styles.dateInputContainer}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#3498db" />
                  <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                  <Ionicons name="chevron-down" size={16} color="#95a5a6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hazards & Safety</Text>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  Hazards Identified <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.counterText}>
                  {selectedHazards.length} selected
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.selectionButton,
                  selectedHazards.length > 0 && styles.selectionButtonActive,
                ]}
                onPress={() => setShowHazardModal(true)}
              >
                {selectedHazards.length === 0 ? (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="warning-outline"
                      size={20}
                      color="#e74c3c"
                      style={styles.selectionIcon}
                    />
                    <Text style={styles.placeholderText}>Select hazards</Text>
                  </View>
                ) : (
                  <View style={styles.selectedItemsContainer}>
                    {selectedHazards.map((hazard, index) => (
                      <View key={index} style={styles.chip}>
                        <Text style={styles.chipText}>{hazard}</Text>
                        <TouchableOpacity
                          style={styles.chipRemove}
                          onPress={() => toggleHazard(hazard)}
                        >
                          <Ionicons name="close" size={14} color="#7f8c8d" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <Ionicons name="chevron-down" size={20} color="#95a5a6" />
              </TouchableOpacity>
              <Text style={styles.helperText}>Select all relevant hazards</Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  Safety Precautions <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.counterText}>
                  {selectedPrecautions.length} selected
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.selectionButton,
                  selectedPrecautions.length > 0 &&
                    styles.selectionButtonActive,
                ]}
                onPress={() => setShowPrecautionModal(true)}
              >
                {selectedPrecautions.length === 0 ? (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={20}
                      color="#27ae60"
                      style={styles.selectionIcon}
                    />
                    <Text style={styles.placeholderText}>
                      Select precautions
                    </Text>
                  </View>
                ) : (
                  <View style={styles.selectedItemsContainer}>
                    {selectedPrecautions.map((precaution, index) => (
                      <View key={index} style={styles.chip}>
                        <Text style={styles.chipText}>{precaution}</Text>
                        <TouchableOpacity
                          style={styles.chipRemove}
                          onPress={() => togglePrecaution(precaution)}
                        >
                          <Ionicons name="close" size={14} color="#7f8c8d" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <Ionicons name="chevron-down" size={20} color="#95a5a6" />
              </TouchableOpacity>
              <Text style={styles.helperText}>
                Select all safety measures required
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <AnimatedTouchable
          style={[
            styles.submitButton,
            !formValid && styles.submitButtonDisabled,
            {
              transform: [{ scale: buttonAnim }],
            },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !formValid}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Permit Request</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </AnimatedTouchable>
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) {
              setStartDate(date);
              if (date > endDate) {
                setEndDate(new Date(date.getTime() + 86400000));
              }
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          minimumDate={startDate}
          display="default"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Hazard Selection Modal */}
      <Modal
        visible={showHazardModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHazardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Hazards</Text>
              <TouchableOpacity onPress={() => setShowHazardModal(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {availableHazards.map((hazard) =>
                renderCheckboxItem(
                  hazard,
                  selectedHazards,
                  toggleHazard,
                  hazard
                )
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowHazardModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={() => setShowHazardModal(false)}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Precaution Selection Modal */}
      <Modal
        visible={showPrecautionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPrecautionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Safety Precautions</Text>
              <TouchableOpacity onPress={() => setShowPrecautionModal(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {availablePrecautions.map((precaution) =>
                renderCheckboxItem(
                  precaution,
                  selectedPrecautions,
                  togglePrecaution,
                  precaution
                )
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPrecautionModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={() => setShowPrecautionModal(false)}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100, // Extra space for the fixed button at bottom
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  emptySpace: {
    width: 40,
  },
  content: {
    padding: 4,
  },
  progressContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2c3e50',
  },
  formGroup: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34495e',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  counterText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  textareaContainer: {
    height: 120,
    paddingTop: 8,
    paddingBottom: 8,
  },
  textarea: {
    height: 120,
  },
  helperText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 6,
    marginLeft: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    width: '48%',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 8,
  },
  placeholderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionIcon: {
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#95a5a6',
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 50,
  },
  selectionButtonActive: {
    borderColor: '#3498db',
  },
  selectedItemsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#2c3e50',
    marginRight: 4,
  },
  chipRemove: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#dcdde1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#dcdde1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    marginRight: 8,
  },
  modalCancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '500',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    marginLeft: 8,
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreatePermitScreen;
