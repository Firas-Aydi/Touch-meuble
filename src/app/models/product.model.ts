export interface Product {
  productId?: string; // Optionnel si généré par Firestore
  name: string;
  price: number;
  // description: string;
  stock: number;
  dimensions: string;
  material: string;
  images: string[]; // Un tableau d'URL d'images
  details: string[];
  colors: string[];
  type: string;
}
