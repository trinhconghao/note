export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
} 