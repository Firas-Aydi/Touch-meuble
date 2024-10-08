// pack.model.ts
import { Category } from "./category.model";

export interface Pack {
    packId: string;      // Identifiant du pack
    name: string;        // Nom du pack
    description: string; // Description du pack
    price: number;       // Prix du pack
    image: string;
    items: Category[];   // Liste des catégories dans le pack
}
