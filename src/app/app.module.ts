import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app'; 
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; 
import { provideAuth, getAuth } from '@angular/fire/auth'; 

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Firebase Auth for compat mode
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';  // Firestore for compat mode

import { environment } from 'src/environments/environment';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';


import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ResetpasswordComponent,
    VarifyEmailComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    DividerModule,
    InputMaskModule,
    ButtonModule,
    // Use AngularFireModule for compatibility mode
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,  // Import Firebase Auth for compat
    AngularFirestoreModule  // Import Firestore for compat
    
    // Initialize Firebase App using a static environment configuration
    // provideFirebaseApp(() => initializeApp(environment.firebase)), 
    // provideFirestore(() => getFirestore()),  // Firestore for database
    // provideAuth(() => getAuth()), // Firebase Auth
  ],
  providers: [
    // importProvidersFrom(
    //   provideFirebaseApp(() => initializeApp(environment.firebase)), 
    //   provideFirestore(() => getFirestore()),  // Firestore for database
    //   provideAuth(() => getAuth()) // Firebase Auth
    // )
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// import { NgModule, importProvidersFrom } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';

// import { initializeApp, provideFirebaseApp } from '@angular/fire/app'; // Firebase core initialization
// import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // Firestore setup
// import { provideAuth, getAuth } from '@angular/fire/auth'; // Auth setup

// import { environment } from '../environments/environment'; // Firebase config

// // PrimeNG Modules
// import { InputTextModule } from 'primeng/inputtext';
// import { FloatLabelModule } from 'primeng/floatlabel';
// import { PasswordModule } from 'primeng/password';
// import { DividerModule } from 'primeng/divider';
// import { InputMaskModule } from 'primeng/inputmask';
// import { ButtonModule } from 'primeng/button';

// // Components
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
// import { VarifyEmailComponent } from './varify-email/varify-email.component';
// import { NavbarComponent } from './navbar/navbar.component';

// @NgModule({
//   declarations: [
//     AppComponent,
//     LoginComponent,
//     RegisterComponent,
//     DashboardComponent,
//     ResetpasswordComponent,
//     VarifyEmailComponent,
//     NavbarComponent,
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     ReactiveFormsModule,
//     InputTextModule,
//     FloatLabelModule,
//     PasswordModule,
//     DividerModule,
//     InputMaskModule,
//     ButtonModule,
//   ],
//   providers: [
//     // importProvidersFrom(
//     //   provideFirebaseApp(() => initializeApp(environment.firebase)),
//     //   provideFirestore(() => getFirestore()),
//     //   provideAuth(() => getAuth())
//     // ),
//   ],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}
