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
