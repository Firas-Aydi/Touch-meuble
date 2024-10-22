import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize, Observable } from 'rxjs';
import { SalleAManger } from '../models/salleAManger.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Injectable({
  providedIn: 'root'
})
export class SalleAMangeService {
  private salleCollection = this.firestore.collection<SalleAManger>('salles');

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  // Méthode pour télécharger des images vers Firebase Storage
  uploadImage(file: File, salleId: string): Observable<string> {
    const filePath = `salles/${salleId}/${file.name}`; // Chemin de stockage
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
  getSalle(): Observable<SalleAManger[]> {
    return this.salleCollection.valueChanges({ idField: 'salleId' });
  }

  // Get salle by ID
  getSalleById(salleId: string): Observable<SalleAManger | undefined> {
    return this.salleCollection.doc(salleId).valueChanges();
  }

  // Add a new salle
  addSalle(salle: SalleAManger): Promise<void> {
    const salleId = this.firestore.createId();  // Generate unique ID
    return this.salleCollection.doc(salleId).set({ ...salle, salleId });
  }

  // Update an existing salle
  updateSalle(salleId: string, salle: Partial<SalleAManger>): Promise<void> {
    return this.salleCollection.doc(salleId).update(salle);
  }

  // Delete a salle
  deleteSalle(salleId: string): Promise<void> {
    return this.salleCollection.doc(salleId).delete();
  }
}

