import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { Firestore, collection,doc, setDoc } from '@angular/fire/firestore';
// import { inject } from '@angular/core';
// import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  // registerForm!: FormGroup;
  // constructor(private sa: AuthService, private fs: AngularFirestore, private route: Router) {}
  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {}
  // userType: string = 'client';

  // onUserTypeChange(userType: string) {
  //   this.userType = userType;
  // }

  register(form: any) {
    let data = form.value;
    this.authService
      .signUp(data.email, data.password)
      .then((userCredential) => {
        if (userCredential && userCredential.user) {
          localStorage.setItem('userConnect', userCredential.user.uid);
          const userData: {
            uid: string;
            flName: string;
            telephone: number;
            email: string;
            password: string;
            role: string;
          } = {
            uid: userCredential.user.uid,
            flName: data.flName,
            telephone: data.telephone,
            email: data.email,
            password: data.password,
            role: 'client',
          };
          // Use the collection and doc methods from the modular API
  //         const userCollection = collection(this.firestore, 'users');
  //         const userDoc = doc(userCollection, userCredential.user.uid);

  //         setDoc(userDoc, userData)
  //           .then(() => {
  //             this.router.navigate(['/']);
  //           })
  //           .catch((error) => {
  //             console.error('Error adding document: ', error);
  //           });
  //       } else {
  //         console.log('User or userCredential.user is null.');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error signing up: ', error);
  //     });
  // }

          this.firestore
            .collection('users')
            .doc(userCredential.user.uid)
            .set(userData)
            .then(() => {
              this.router.navigate(['/']);
            })
            .catch((error) => {
              console.error('Error adding document: ', error);
            });
        } else {
          console.log('User or userCredential.user is null.');
        }
      })
      .catch((error) => {
        console.error('Error signing up: ', error);
      });
  }
}
