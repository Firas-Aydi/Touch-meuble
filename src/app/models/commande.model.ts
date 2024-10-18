// models/order.model.ts
export interface Commande {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    region: string;
    email: string;
    phone: string;
    notes?: string; // facultatif
  }
  