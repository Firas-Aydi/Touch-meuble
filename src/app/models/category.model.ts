// category.model.ts
import { Product } from './product.model';

export interface Category {
  categoryId?: string; // Identifiant de la catégorie
  name: string;
  price: number;
  description: string;
  images: string[];
  items: string[]; // Liste des produits dans cette catégorie
  colors: string[];
}
