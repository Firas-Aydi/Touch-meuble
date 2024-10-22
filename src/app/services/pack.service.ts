// pack.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Pack } from '../models/pack.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PackService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  // Méthode pour télécharger des images vers Firebase Storage
  uploadImage(file: File, packId: string): Observable<string> {
    const filePath = `packs/${packId}/${file.name}`; // Chemin de stockage
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            observer.next(url);  // Renvoie l'URL après téléchargement
            observer.complete();
          });
        })
      ).subscribe();
    });
  }
  // Ajouter un pack
  addPack(pack: Pack) {
    console.log('pack: ',pack)
    const packId = this.firestore.createId(); // Générez l'ID ici
    pack.packId = packId;
    return this.firestore.collection('packs').doc(packId).set(pack);
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
