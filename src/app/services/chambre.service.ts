import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Chambre } from '../models/chambre.model';
@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private chambreCollection = this.firestore.collection<Chambre>('chambres');

  constructor(private firestore: AngularFirestore) { }

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

