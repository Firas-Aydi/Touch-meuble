import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize, Observable } from 'rxjs';
import { Salon } from '../models/salon.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class SalonService {

  private salonCollection = this.firestore.collection<Salon>('salons');

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  // Méthode pour télécharger des images vers Firebase Storage
  uploadImage(file: File, salonId: string): Observable<string> {
    const filePath = `salons/${salonId}/${file.name}`; // Chemin de stockage
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
  getSalons(): Observable<Salon[]> {
    return this.salonCollection.valueChanges({ idField: 'salonId' });
  }

  // Get salon by ID
  getSalonById(salonId: string): Observable<Salon | undefined> {
    return this.salonCollection.doc(salonId).valueChanges();
  }

  // Add a new salon
  addSalon(salon: Salon): Promise<void> {
    const salonId = this.firestore.createId();  // Generate unique ID
    return this.salonCollection.doc(salonId).set({ ...salon, salonId });
  }

  // Update an existing salon
  updateSalon(salonId: string, salon: Partial<Salon>): Promise<void> {
    return this.salonCollection.doc(salonId).update(salon);
  }

  // Delete a salon
  deleteSalon(salonId: string): Promise<void> {
    return this.salonCollection.doc(salonId).delete();
  }
}
