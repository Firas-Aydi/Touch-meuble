// category.model.ts
export interface Category {
  categoryId?: string; // Identifiant de la catégorie
  name: string;
  price: number;
  description: string;
  images: string[];
  items: string[]; // Liste des produits dans cette catégorie
  colors: string[];
  type:string
}
