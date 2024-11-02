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
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Firebase Auth for compat mode
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Firestore for compat mode

import { environment } from 'src/environments/environment';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
// import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PackComponent } from './pack/pack.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { ChambreDetailsComponent } from './chambre-details/chambre-details.component';
import { SalonDetailsComponent } from './salon-details/salon-details.component';
import { SalleAmangeDetailsComponent } from './salle-amange-details/salle-amange-details.component';
import { ChambreComponent } from './chambre/chambre.component';
import { SalleAmangeComponent } from './salle-amange/salle-amange.component';
import { SalonComponent } from './salon/salon.component';
import { CommandeComponent } from './commande/commande.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorComponent } from './error/error.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ResetpasswordComponent,
    ErrorComponent,
    // VarifyEmailComponent,

    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    
    PackComponent,
    PackDetailsComponent,
    ProductComponent,
    ProductDetailsComponent,
    ChambreComponent,
    ChambreDetailsComponent,
    SalleAmangeComponent,
    SalleAmangeDetailsComponent,
    SalonComponent,
    SalonDetailsComponent,
    CartComponent,
    CommandeComponent,
    SearchResultsComponent
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
    AngularFireAuthModule, // Import Firebase Auth for compat
    AngularFirestoreModule, // Import Firestore for compat

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
