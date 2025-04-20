import { PermitStatus } from '@/app/models/permit';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusChipProps {
  status: PermitStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  let chipColor: string;
  let statusText: string;

  switch (status) {
    case PermitStatus.PENDING:
      chipColor = '#FF9800'; // Orange
      statusText = 'Pending';
      break;
    case PermitStatus.APPROVED:
      chipColor = '#2196F3'; // Blue
      statusText = 'Approved';
      break;
    case PermitStatus.IN_PROGRESS:
      chipColor = '#9C27B0'; // Purple
      statusText = 'In Progress';
      break;
    case PermitStatus.COMPLETED:
      chipColor = '#4CAF50'; // Green
      statusText = 'Completed';
      break;
    case PermitStatus.REJECTED:
      chipColor = '#F44336'; // Red
      statusText = 'Rejected';
      break;
  }

  return (
    <View style={[styles.chip, { backgroundColor: chipColor }]}>
      <Text style={styles.chipText}>{statusText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  chipText: {
    color: 'white',
    fontSize: 14,
  },
});
