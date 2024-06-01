export interface Order {
  id?: string;
  receipt_date: string;
  completed: boolean;
  state:
    | "En proceso"
    | "Entregado"
    | "No entregado"
    | "Cancelado"
    | "Por recoger"
    | "En reparto"
    | "Por enviar";
  user?: string;
  subtotal: number;
  total: number;
  products: string[];
  type: "Para llevar" | "Para recoger";
  comments?: string;
  address?: string;
  discount?: number;
}
