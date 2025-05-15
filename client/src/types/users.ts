// Define UserRole enum (optional, based on future needs)
export enum UserRole {
  User = "user",
  Admin = "admin",
}

// Define User interface
export interface User {
  id: string; // Assuming UUID as string
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin"; // NEW: Added for admin panel
}

// Define Auth Response type
export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Define Form Data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
