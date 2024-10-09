import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private firestore: AngularFirestore) { }

  // Ajouter un produit
  addProduct(product: Product) {
    const productId = this.firestore.createId(); // Générez l'ID ici
    product.productId = productId; // Assignez-le à productId
    return this.firestore.collection('products').doc(productId).set(product); // Utilisez set au lieu de add
  }

  // Modifier un produit
  updateProduct(productId: string, product: Partial<Product>) {
    return this.firestore.collection('products').doc(productId).update(product);
  }

  // Supprimer un produit
  deleteProduct(productId: string) {
    return this.firestore.collection('products').doc(productId).delete();
  }

  // Obtenir tous les produits
  getAllProducts() {
    return this.firestore.collection<Product>('products').valueChanges();
  }

  // Obtenir un produit par ID
  getProductById(productId: string) {
    return this.firestore.collection('products').doc(productId).valueChanges({ idField: 'id' });
  }
}
