import { UserRole } from "./enums";


export interface User {
  id: number;
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: UserRole;
}

export type NewUser = Omit<User, "id">;

export type UpdateUser = Omit<User, "id" | "password"> & { password?: string };
