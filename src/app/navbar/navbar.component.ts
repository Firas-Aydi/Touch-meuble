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
import { ProductService } from '../services/product.service';
import { map } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs'; // Import Subscription
import { CommandeService } from '../services/commande.service';

interface UserData {
  role: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
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

  // products: Product[] = [];
  cartItemCount: number = 0;
  searchTerm: string = '';
  private cartSubscription: Subscription | undefined; // Pour gérer l'abonnement

  commandeItemCount: number = 0;
  private pendingCommandeSubscription: Subscription | undefined;

  constructor(
    private af: AngularFireAuth,
    private route: Router,
    private as: AuthService,
    private firestore: AngularFirestore,
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
            // console.log('doc:', doc);
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
      .valueChanges(); // Collection pour les meubles

    // this.chambres$.subscribe((data) => console.log('Chambres:', data));
    // this.salons$.subscribe((data) => console.log('Salons:', data));
    // this.salles$.subscribe((data) => console.log('Salles à manger:', data));
    // this.meubles$.subscribe((data) => console.log('Meubles:', data));
  }

  ngOnInit(): void {
    // Abonnez-vous au nombre de commandes en attente
    this.pendingCommandeSubscription = this.commandeService
      .getPendingCommandesCount()
      .subscribe((count) => {
        this.commandeItemCount = count;
      });
    // Charger le compteur du panier depuis localStorage
    const savedCartCount = localStorage.getItem('cartItemCount');
    this.cartItemCount = savedCartCount ? +savedCartCount : 0;

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
    // S'abonner aux changements du panier
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(
      (count) => {
        this.cartItemCount = count;
        // localStorage.setItem('cartItemCount', count.toString());
      }
    );
  }

  ngOnDestroy(): void {
    // Se désabonner lorsque le composant est détruit pour éviter les fuites de mémoire
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    // Désabonnement lors de la destruction du composant pour éviter les fuites de mémoire
    if (this.pendingCommandeSubscription) {
      this.pendingCommandeSubscription.unsubscribe();
    }
  }
  // loadProducts() {
  //   this.productService.getAllProducts().subscribe((data) => {
  //     this.products = data;
  //     // console.log('products: ', this.products);
  //   });
  // }

  // onSearch() {
  //   if (this.searchTerm) {
  //     const term = this.searchTerm.toLowerCase();  // Convertir la recherche en minuscule pour éviter les problèmes de casse
  //     this.products = this.products.filter(product =>
  //       product.name.toLowerCase().includes(term) ||
  //       product.type.toLowerCase().includes(term)
  //     );
  //   } else {
  //     // Si le champ de recherche est vide, charger à nouveau tous les produits
  //     // this.loadProducts();
  //   }
  // }
  logout() {
    this.af
      .signOut()
      .then(() => {
        localStorage.removeItem('userConnect');

        this.route.navigate(['/']);
      })
      .catch(() => {
        console.log('error');
      });
  }
}
