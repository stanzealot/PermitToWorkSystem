import { UserRole } from '../models/user';

export function getRoleString(role: UserRole): string {
  switch (role) {
    case UserRole.WORKER:
      return 'Worker';
    case UserRole.SUPERVISOR:
      return 'Supervisor';
    case UserRole.SAFETY_OFFICER:
      return 'Safety Officer';
    case UserRole.ADMIN:
      return 'Administrator';
  }
}

export function formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
