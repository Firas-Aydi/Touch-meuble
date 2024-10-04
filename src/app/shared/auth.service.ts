import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import {GoogleAuthProvider} from '@angular/fire/auth'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<firebase.User | null>;

  constructor(private fireauth: AngularFireAuth, private router: Router) {
    this.user = this.fireauth.user;

  }

  //login
  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.fireauth.signInWithEmailAndPassword(email, password)
    // .catch((error) => {
    //     // console.log(error.message)
    //     // alert(error.message);
    //     // this.router.navigate(['/login']);
    //     return Promise.reject(this.getErrorMessage(error.code));
    //   }
    // );
  }
  // private getErrorMessage(code: string): string {
  //   switch (code) {
  //     case 'auth/user-not-found':
  //       return 'Aucun compte trouvé avec cet email.';
  //     case 'auth/wrong-password':
  //       return 'Mot de passe incorrect. Veuillez réessayer.';
  //     case 'auth/invalid-email':
  //       return 'Email invalide. Veuillez entrer un email valide.';
  //     case 'auth/user-disabled':
  //       return 'Ce compte a été désactivé.';
  //     default:
  //       return 'Une erreur est survenue. Veuillez réessayer.';
  //   }
  // }
  //regiter
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        alert('Registration Successful');
        this.router.navigate(['login']);
        // this.sendEmailForVarification(res.user)
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
  
  //forgot password
  // resetPassword(email:string) {
  //   this.fireauth.sendPasswordResetEmail(email).then(()=>{
  //     this.router.navigate(['/varify-email'])
  //   },(error)=>{
  //     alert(error.message)
  //   })
  // }
  resetPassword(email: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().sendPasswordResetEmail(email).then(
          () => {
            resolve(true)
            alert("Link has sent on your registered email. Please varify it.")
          },
          (error) => {
            reject(error);
          }
        );

      }
    );
  }
  //email varification
  // sendEmailForVarification(user:any){
  //   user.sendEmailVerification().then((res:any)=>{
  //     this.router.navigate(['/varify-email'])
  //   },(err:any)=>{
  //     alert('Something went wrong. Not able to send mail to your email')
  //   })
  // }
  //signIn Google
  googleSignIn(){
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then((res)=>{
      this.router.navigate(['dashboard'])
      localStorage.setItem('token',JSON.stringify(res.user?.uid))
    },err=>{
      alert(err.message)
    })
  }


  signUp(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.fireauth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.fireauth.signInWithEmailAndPassword(email, password);
  }
}
