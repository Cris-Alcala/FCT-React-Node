export interface Product {
  name: string;
  ingredients: string;
  description: string;
  section: string;
  price: number;
  size?: string;
  available: boolean;
  image?: string;
  id?: string;
  updated_at?: string;
}
