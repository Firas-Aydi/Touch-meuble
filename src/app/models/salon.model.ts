// salon.model.ts
export interface Salon {
  salonId?: string; // Identifiant de la catégorie
  name: string;
  price: number;
  // description: string;
  stock: number;
  dimensions: string;
  material: string;
  images: string[];
  details: string[];
  colors: string[];
  type: string;
}
