// pack.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Pack } from '../models/pack.model';

@Injectable({
  providedIn: 'root',
})
export class PackService {
  constructor(private firestore: AngularFirestore) {}

  // Ajouter un pack
  addPack(pack: Pack) {
    const packId = this.firestore.createId(); // Générez l'ID ici
    pack.packId = packId;
    return this.firestore.collection('categories').doc(packId).set(packId);
  }

  // Modifier un pack
  updatePack(packId: string, pack: Pack) {
    return this.firestore.collection('packs').doc(packId).update(pack);
  }

  // Supprimer un pack
  deletePack(packId: string) {
    return this.firestore.collection('packs').doc(packId).delete();
  }

  // Obtenir tous les packs
  getAllPacks() {
    return this.firestore.collection<Pack>('packs').valueChanges();
  }

  // Obtenir un pack par ID
  getPackById(packId: string) {
    return this.firestore.collection('packs').doc<Pack>(packId).valueChanges();
  }
}
