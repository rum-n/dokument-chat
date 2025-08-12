export interface User {
  id: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}
