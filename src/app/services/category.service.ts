// category.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: AngularFirestore) { }

  // Ajouter une catégorie
  addCategory(category: Category) {
    const categoryId = this.firestore.createId(); // Générez l'ID ici
    category.categoryId = categoryId; 
    return this.firestore.collection('categories').doc(categoryId).set(category);
  }

  // Modifier une catégorie
  updateCategory(categoryId: string, category: Category) {
    return this.firestore.collection('categories').doc(categoryId).update(category);
  }

  // Supprimer une catégorie
  deleteCategory(categoryId: string) {
    return this.firestore.collection('categories').doc(categoryId).delete();
  }

  // Obtenir toutes les catégories
  getAllCategories() {
    return this.firestore.collection<Category>('categories').valueChanges();
  }

  // Obtenir une catégorie par ID
  getCategoryById(categoryId: string) {
    return this.firestore.collection('categories').doc<Category>(categoryId).valueChanges();
  }
}
