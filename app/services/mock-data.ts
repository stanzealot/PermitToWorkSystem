import { User, UserRole } from '../models/user';
import { Permit, PermitStatus } from '../models/permit';

// Mock Users Data
export const mockUsers: User[] = [
  { id: 'user1', name: 'John Doe', role: UserRole.WORKER },
  { id: 'user2', name: 'Jane Smith', role: UserRole.SUPERVISOR },
  { id: 'user3', name: 'Mike Johnson', role: UserRole.SAFETY_OFFICER },
  { id: 'user4', name: 'Sarah Williams', role: UserRole.ADMIN },
];

// Current User (will be set during login)
export let currentUser = mockUsers[0];

// Mock Permits Data
export const mockPermits: Permit[] = [
  {
    id: 'PTW-001',
    workTitle: 'Electrical Panel Maintenance',
    location: 'Building A, Floor 2',
    requesterId: 'user1',
    description: 'Replacing circuit breakers in main electrical panel',
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000), // +1 day
    hazards: ['Electrical shock', 'Short circuit'],
    precautions: [
      'Isolate power',
      'Use safety equipment',
      'Follow lockout procedures',
    ],
    status: PermitStatus.PENDING,
  },
  // Add other mock permits...
];

export function setCurrentUser(user: User) {
  currentUser = user;
}
