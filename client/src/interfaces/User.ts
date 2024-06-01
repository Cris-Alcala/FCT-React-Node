export interface User {
  name?: string;
  surname?: string;
  address?: string;
  phone?: string;
  userName?: string;
  email: string;
  password?: string;
  id?: string;
  position?: "Chef" | "Delivery" | "Recepcionist" | "";
  created_at?: string;
  updated_at?: string;
  admin?: boolean;
  dni?: string;
}
