import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize, Observable } from 'rxjs';
import { Chambre } from '../models/chambre.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';  // Import du service Storage

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private chambreCollection = this.firestore.collection<Chambre>('chambres');

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  // Méthode pour télécharger des images vers Firebase Storage
  uploadImage(file: File, chambreId: string): Observable<string> {
    const filePath = `chambres/${chambreId}/${file.name}`; // Chemin de stockage
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
  
  // Get all salons
  getChambre(): Observable<Chambre[]> {
    return this.chambreCollection.valueChanges({ idField: 'chambreId' });
  }

  // Get chambre by ID
  getChambreById(chambreId: string): Observable<Chambre | undefined> {
    return this.chambreCollection.doc(chambreId).valueChanges();
  }

  // Add a new chambre
  addChambre(chambre: Chambre): Promise<void> {
    const chambreId = this.firestore.createId();  // Generate unique ID
    return this.chambreCollection.doc(chambreId).set({ ...chambre, chambreId });
  }

  // Update an existing chambre
  updateChambre(chambreId: string, chambre: Partial<Chambre>): Promise<void> {
    return this.chambreCollection.doc(chambreId).update(chambre);
  }

  // Delete a chambre
  deleteChambre(chambreId: string): Promise<void> {
    return this.chambreCollection.doc(chambreId).delete();
  }
}

