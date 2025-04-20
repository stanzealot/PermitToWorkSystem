import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
// import { mockPermits, currentUser } from '../../services/mock-data';
// import { StatusChip } from '../../components/StatusChip';
import { useRouter } from 'expo-router';
import { PermitStatus } from '../models/permit';
import { currentUser, mockPermits } from '../services/mock-data';
// import { PermitStatus } from '../../models/permit';

const ApprovalQueueScreen = () => {
  const router = useRouter();
  const [pendingPermits, setPendingPermits] = useState(
    mockPermits.filter((p) => p.status === PermitStatus.PENDING)
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPendingPermits(
        mockPermits.filter((p) => p.status === PermitStatus.PENDING)
      );
      setIsLoading(false);
    }, 1000);
  };

  const handleApprove = (permit: any) => {
    Alert.prompt(
      'Approve Permit',
      'Add comments (optional)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: (comment) => {
            permit.status = PermitStatus.APPROVED;
            permit.approvedBy = currentUser.name;
            permit.approvedDate = new Date();
            if (comment) permit.comments = comment;
            setPendingPermits((prev) => prev.filter((p) => p.id !== permit.id));
            Alert.alert('Success', 'Permit approved successfully');
          },
        },
      ],
      'plain-text',
      ''
    );
  };

  const handleReject = (permit: any) => {
    Alert.prompt(
      'Reject Permit',
      'Provide reason for rejection',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: (reason) => {
            if (!reason) {
              Alert.alert('Error', 'Please provide a reason for rejection');
              return;
            }
            permit.status = PermitStatus.REJECTED;
            permit.comments = reason;
            setPendingPermits((prev) => prev.filter((p) => p.id !== permit.id));
            Alert.alert('Success', 'Permit rejected');
          },
        },
      ],
      'plain-text',
      ''
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (pendingPermits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No pending approvals</Text>
        <Text style={styles.emptyText}>
          All permit requests have been processed
        </Text>
        <Button title="Refresh" onPress={handleRefresh} />
      </View>
    );
  }

  return (
    <FlatList
      data={pendingPermits}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.workTitle}</Text>
          <Text>ID: {item.id}</Text>
          <Text>Location: {item.location}</Text>
          <Text>
            Date: {formatDate(item.startDate)} - {formatDate(item.endDate)}
          </Text>

          <Text style={styles.description}>
            Description: {item.description}
          </Text>
          <Text style={styles.hazards}>Hazards: {item.hazards.join(', ')}</Text>

          <View style={styles.buttonRow}>
            <Button
              title="Details"
              onPress={() =>
                router.push(`/permits/permit-detail?id=${item.id}`)
              }
            />
            <Button
              title="Approve"
              onPress={() => handleApprove(item)}
              color="green"
            />
            <Button
              title="Reject"
              onPress={() => handleReject(item)}
              color="red"
            />
          </View>
        </View>
      )}
    />
  );
};

const formatDate = (date: Date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    marginTop: 10,
    marginBottom: 5,
  },
  hazards: {
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ApprovalQueueScreen;
