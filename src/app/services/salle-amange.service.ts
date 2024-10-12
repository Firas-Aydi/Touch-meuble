import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { SalleAManger } from '../models/salleAManger.model';
@Injectable({
  providedIn: 'root'
})
export class SalleAMangeService {
  private salleCollection = this.firestore.collection<SalleAManger>('salles');

  constructor(private firestore: AngularFirestore) { }

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

