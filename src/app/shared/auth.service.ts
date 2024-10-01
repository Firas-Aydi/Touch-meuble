import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { error } from 'console';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}

  //login
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['dashboard']);
      },
      (error) => {
        alert('Something went wrong');
        this.router.navigate(['/login']);
      }
    );
  }

  //regiter
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      () => {
        alert('Registration Successful');
        this.router.navigate(['login']);
      },
      (error) => {
        alert(error.message);
        this.router.navigate(['/register']);
      }
    );
  }

  //logout
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (error) => {
        alert(error.message);
      }
    );
  }
}
