import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
// import { mockPermits, currentUser } from '../../services/mock-data';
// import { PermitStatus } from '../../models/permit';
import { StatusChip } from '../../components/StatusChip';
import { PermitStatus } from '../models/permit';
import { currentUser, mockPermits } from '../services/mock-data';
import { formatDate } from '../utils/helpers';
// import { formatDate } from '../../utils/helpers';

const PermitDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [comment, setComment] = useState('');

  const permit = mockPermits.find((p) => p.id === id);
  if (!permit) {
    return (
      <View style={styles.container}>
        <Text>Permit not found</Text>
      </View>
    );
  }

  const handleApprove = () => {
    permit.status = PermitStatus.APPROVED;
    permit.approvedBy = currentUser.name;
    permit.approvedDate = new Date();
    if (comment) permit.comments = comment;
    Alert.alert('Success', 'Permit approved successfully');
    router.back();
  };

  const handleReject = () => {
    if (!comment) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    permit.status = PermitStatus.REJECTED;
    permit.comments = comment;
    Alert.alert('Success', 'Permit rejected');
    router.back();
  };

  const handleComplete = () => {
    permit.status = PermitStatus.COMPLETED;
    if (comment) permit.comments = comment;
    Alert.alert('Success', 'Work completed successfully');
    router.back();
  };

  const showApprovalDialog = () => {
    Alert.prompt(
      'Approve Permit',
      'Add comments (optional)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: (text) => {
            setComment(text || '');
            handleApprove();
          },
        },
      ],
      'plain-text',
      ''
    );
  };

  const showRejectionDialog = () => {
    Alert.prompt(
      'Reject Permit',
      'Provide reason for rejection',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: (text) => {
            if (!text) {
              Alert.alert('Error', 'Please provide a reason for rejection');
              return;
            }
            setComment(text);
            handleReject();
          },
        },
      ],
      'plain-text',
      ''
    );
  };

  const showCompletionDialog = () => {
    Alert.prompt(
      'Complete Work',
      'Add completion notes',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: (text) => {
            setComment(text || '');
            handleComplete();
          },
        },
      ],
      'plain-text',
      ''
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusSection}>
        <View style={styles.statusItem}>
          <Text style={styles.label}>Current Status</Text>
          <StatusChip status={permit.status} />
        </View>
        {permit.approvedBy && (
          <View style={styles.statusItem}>
            <Text style={styles.label}>Approved By</Text>
            <Text style={styles.value}>{permit.approvedBy}</Text>
            {permit.approvedDate && (
              <Text style={styles.value}>
                {formatDate(permit.approvedDate)}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permit Details</Text>
        <DetailRow label="Work Title" value={permit.workTitle} />
        <DetailRow label="Location" value={permit.location} />
        <DetailRow label="Start Date" value={formatDate(permit.startDate)} />
        <DetailRow label="End Date" value={formatDate(permit.endDate)} />

        <Text style={styles.subSectionTitle}>Description</Text>
        <Text style={styles.description}>{permit.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hazards Identified</Text>
        {permit.hazards.map((hazard) => (
          <View key={hazard} style={styles.listItem}>
            <Text>• {hazard}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Precautions</Text>
        {permit.precautions.map((precaution) => (
          <View key={precaution} style={styles.listItem}>
            <Text>• {precaution}</Text>
          </View>
        ))}
      </View>

      {permit.comments && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <Text>{permit.comments}</Text>
        </View>
      )}

      <View style={styles.actions}>
        {permit.status === PermitStatus.PENDING && (
          <>
            {(currentUser.role === 'supervisor' ||
              currentUser.role === 'safetyOfficer' ||
              currentUser.role === 'admin') && (
              <>
                <Button
                  title="Approve"
                  onPress={showApprovalDialog}
                  color="green"
                />
                <Button
                  title="Reject"
                  onPress={showRejectionDialog}
                  color="red"
                />
              </>
            )}
            {currentUser.role === 'worker' &&
              permit.requesterId === currentUser.id && (
                <>
                  <Button
                    title="Edit"
                    onPress={() => Alert.alert('Edit would open here')}
                  />
                  <Button
                    title="Withdraw"
                    onPress={() => Alert.alert('Withdraw would happen here')}
                    color="red"
                  />
                </>
              )}
          </>
        )}
        {permit.status === PermitStatus.APPROVED &&
          currentUser.role === 'worker' &&
          permit.requesterId === currentUser.id && (
            <Button
              title="Start Work"
              onPress={() => {
                permit.status = PermitStatus.IN_PROGRESS;
                Alert.alert('Work started');
                router.back();
              }}
            />
          )}
        {permit.status === PermitStatus.IN_PROGRESS &&
          currentUser.role === 'worker' &&
          permit.requesterId === currentUser.id && (
            <Button title="Complete Work" onPress={showCompletionDialog} />
          )}
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusItem: {
    flex: 1,
  },
  label: {
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subSectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    lineHeight: 22,
  },
  listItem: {
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  detailValue: {
    flex: 1,
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PermitDetailScreen;
