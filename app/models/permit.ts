export enum PermitStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export interface Permit {
  id: string;
  workTitle: string;
  location: string;
  requesterId: string;
  description: string;
  startDate: Date;
  endDate: Date;
  hazards: string[];
  precautions: string[];
  status: PermitStatus;
  approvedBy?: string;
  approvedDate?: Date;
  comments?: string;
}
