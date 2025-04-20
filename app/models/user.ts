export enum UserRole {
  WORKER = 'worker',
  SUPERVISOR = 'supervisor',
  SAFETY_OFFICER = 'safetyOfficer',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
