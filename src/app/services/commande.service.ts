import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Commande } from '../models/commande.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private commandeCollection = this.firestore.collection<Commande>('commandes');

  constructor(private firestore: AngularFirestore) {}

  // Sauvegarder une commande avec l'état initial "en attente"
  saveOrder(commande: Commande, cartItems: any[], totalPrice: number): Promise<void> {
    const commandeId = this.firestore.createId();  // Générer un identifiant unique pour la commande

    const commandeData: Commande & { cartItems: any[], totalPrice: number, timestamp: Date, commandeId: string } = {
      ...commande,
      commandeId: commandeId,
      cartItems: cartItems,
      totalPrice: totalPrice + 70, // Ajouter les frais de livraison
      etat: 'en attente',  // État par défaut
      timestamp: new Date(),
    };

    // Sauvegarder la commande dans Firebase
    return this.commandeCollection.doc(commandeId).set(commandeData);
  }

  // Récupérer toutes les commandes
  getAllCommandes(): Observable<Commande[]> {
    return this.commandeCollection.valueChanges();
  }

  // Mettre à jour l'état d'une commande
  updateCommandeStatus(commandeId: string, newStatus: string): Promise<void> {
    return this.commandeCollection.doc(commandeId).update({ etat: newStatus });
  }
}
