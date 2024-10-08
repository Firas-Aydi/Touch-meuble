/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// import { enableProdMode, importProvidersFrom } from '@angular/core';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideRouter } from '@angular/router';
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';
// import { environment } from './environments/environment';
// import { routes } from './app/app-routing.module';

// if (environment.production) {
//   enableProdMode();
// }

// bootstrapApplication(AppComponent, {
//   providers: [
//     importProvidersFrom(
//       provideFirebaseApp(() => initializeApp(environment.firebase)),
//       provideAuth(() => getAuth()),
//       provideFirestore(() => getFirestore())
//     ),
//     provideRouter(routes)
//   ]
// })
//   .catch(err => console.error(err));
