import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { Chambre } from '../models/chambre.model'; // Import du modèle Chambre
import { Salon } from '../models/salon.model'; // Import du modèle Salon
import { SalleAManger } from '../models/salleAManger.model'; // Import du modèle Salle à Manger
import { Product } from '../models/product.model'; // Import du modèle Product
import { Pack } from '../models/pack.model'; // Import du modèle Product
import { map } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs'; // Import Subscription
import { CommandeService } from '../services/commande.service';
import { combineLatest } from 'rxjs';
import { SearchService } from '../services/search.service'; // Importez votre service ici

interface UserData {
  role: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit{
  isSidebarOpen: boolean = true;
  isUser: boolean = false;
  userType: string = '';
  
  chambres$: Observable<Chambre[]>;
  salons$: Observable<Salon[]>;
  salles$: Observable<SalleAManger[]>;
  meubles$: Observable<Product[]>;

  // Ajouter des variables pour les types uniques
  meublesUnique$: Observable<string[]> | undefined;
  salonsUnique$: Observable<string[]> | undefined;
  chambresUnique$: Observable<string[]> | undefined;
  sallesUnique$: Observable<string[]> | undefined;

  constructor(
    private af: AngularFireAuth,
    private route: Router,
    private as: AuthService,
    private firestore: AngularFirestore,
    private searchService: SearchService,
    private commandeService: CommandeService,
    private cartService: CartService
  ) {
    this.as.user.subscribe((user) => {
      if (user) {
        this.isUser = true;
        const userId = user.uid;
        this.firestore
          .collection('users')
          .doc(userId)
          .get()
          .subscribe((doc) => {
            if (doc.exists) {
              const userData = doc.data() as UserData;
              if (userData && userData.role) {
                this.userType = userData.role;
                // console.log('User Type:', this.userType);
              } else {
                console.log('Role not found in user data');
              }
            } else {
              console.log('User data not found');
            }
          });
      } else {
        this.isUser = false;
        this.userType = '';
      }
    });
    // Récupération des chambres, salons, salles et meubles depuis Firestore
    this.chambres$ = this.firestore
      .collection<Chambre>('chambres')
      .valueChanges(); // Collection pour les chambres
    this.salons$ = this.firestore.collection<Salon>('salons').valueChanges(); // Collection pour les salons
    this.salles$ = this.firestore
      .collection<SalleAManger>('salles')
      .valueChanges(); // Collection pour les salles à manger
    this.meubles$ = this.firestore
      .collection<Product>('products')
      .valueChanges();
  }

  ngOnInit(): void {
    this.meublesUnique$ = this.meubles$.pipe(
      map((meubles) =>
        Array.from(new Set(meubles.map((meuble) => meuble.type)))
      )
    );

    this.salonsUnique$ = this.salons$.pipe(
      map((salons) => Array.from(new Set(salons.map((salon) => salon.type))))
    );

    this.chambresUnique$ = this.chambres$.pipe(
      map((chambres) =>
        Array.from(new Set(chambres.map((chambre) => chambre.type)))
      )
    );

    this.sallesUnique$ = this.salles$.pipe(
      map((salles) => Array.from(new Set(salles.map((salle) => salle.type))))
    );
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
