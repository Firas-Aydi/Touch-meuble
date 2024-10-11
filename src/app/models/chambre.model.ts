// chambre.model.ts
export interface Chambre {
    chambreId?: string; // Identifiant de la catégorie
    name: string;
    price: number;
    description: string;
    stock: number;
    dimensions: string;
    material: string;
    images: string[];
    items: string[]; // Liste des produits dans cette catégorie
    colors: string[];
    type: string;
  }
  