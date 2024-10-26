import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface UserData {
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          this.router.navigate(['/login']);  // Rediriger si non authentifié
          return of(false);  // Retourner un Observable contenant false
        } else {
          const userId = user.uid;
          return this.firestore.collection('users').doc(userId).get().pipe(
            map(doc => {
              const data = doc.data() as UserData;
              if (data && data['role'] === 'admin') {
                return true;  // Si l'utilisateur est admin
              } else {
                this.router.navigate(['/error']);  // Rediriger si non admin
                return false;
              }
            })
          );
        }
      })
    );
  }
}
