// pack.model.ts
import { Category } from './category.model';

export interface Pack {
  packId?: string; // Identifiant du pack
  name: string; // Nom du pack
  description: string;
  price: number;
  images: string[];
  items: string[];
  colors: string[];
}
