// category.model.ts
import { Product } from './product.model';

export interface Category {
    categoryId: string; // Identifiant de la catégorie
    name: string;       // Nom de la catégorie
    image: string;
    items: Product[];   // Liste des produits dans cette catégorie
}
