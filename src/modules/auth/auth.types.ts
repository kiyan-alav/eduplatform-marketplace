import { UserRole } from "../../generated/prisma/enums";

export interface RegisterData {
  email: string;
  phone: string;
  fullName: string;
  password: string;
  avatar?: string;
}

export interface LoginData {
  identifier: string;
  password: string;
}

export interface CreateNewUserData {
  email: string;
  phone: string;
  fullName: string;
  passwordHash: string;
  roles: UserRole[];
  avatar: string | null;
}