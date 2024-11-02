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
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isUser: boolean = false;
  userType: string = '';
  isNavbarOpen = false;
  isDropdownOpen: string | null = null;

  chambres$: Observable<Chambre[]>;
  salons$: Observable<Salon[]>;
  salles$: Observable<SalleAManger[]>;
  meubles$: Observable<Product[]>;

  // Ajouter des variables pour les types uniques
  meublesUnique$: Observable<string[]> | undefined;
  salonsUnique$: Observable<string[]> | undefined;
  chambresUnique$: Observable<string[]> | undefined;
  sallesUnique$: Observable<string[]> | undefined;

  // Ajouter des Observables pour les résultats de recherche
  searchResultsChambres$: Observable<Chambre[]> | undefined;
  searchResultsSalons$: Observable<Salon[]> | undefined;
  searchResultsSalles$: Observable<SalleAManger[]> | undefined;
  searchResultsMeubles$: Observable<Product[]> | undefined;
  searchResultsPacks$: Observable<Pack[]> | undefined;
  allResults: (Product | Chambre | Salon | SalleAManger | Pack)[] = [];
  searchTerm: string = '';

  cartItemCount: number = 0;
  private cartSubscription: Subscription | undefined; // Pour gérer l'abonnement

  commandeItemCount: number = 0;
  private pendingCommandeSubscription: Subscription | undefined;

  
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
    this.toggleNavbar();
  }
  toggleNavbar() {
    const navbarCollapse = document.getElementById('navbarSmall');

    // Toggle the navbar open/close state
    this.isNavbarOpen = !this.isNavbarOpen;
    if (navbarCollapse?.classList.contains('show')) {
      navbarCollapse.classList.remove('show'); // Collapse it
    } else {
      navbarCollapse?.classList.add('show'); // Open it if not already open
    }
  }
  toggleDropdown(dropdown: string): void {
    this.isDropdownOpen = this.isDropdownOpen === dropdown ? null : dropdown;
  }

  onSearch() {
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower) {
      combineLatest([
        this.firestore.collection<Product>('products').snapshotChanges(),
        this.firestore.collection<Chambre>('chambres').snapshotChanges(),
        this.firestore.collection<Salon>('salons').snapshotChanges(),
        this.firestore.collection<SalleAManger>('salles').snapshotChanges(),
        this.firestore.collection<Pack>('packs').snapshotChanges(),
      ])
        .pipe(
          map(([products, chambres, salons, salles, packs]) => {
            const extractDataWithId = (collection: any[]) =>
              collection.map((doc) => ({
                id: doc.payload.doc.id, // Ajout de l'id
                ...doc.payload.doc.data(),
              }));

            const filteredProducts = extractDataWithId(products).filter(
              (product) =>
                product.name.toLowerCase().includes(searchTermLower) ||
                product.type.toLowerCase().includes(searchTermLower)
            );
            const filteredChambres = extractDataWithId(chambres).filter(
              (chambre) =>
                chambre.name.toLowerCase().includes(searchTermLower) ||
                chambre.type.toLowerCase().includes(searchTermLower)
            );
            const filteredSalons = extractDataWithId(salons).filter(
              (salon) =>
                salon.name.toLowerCase().includes(searchTermLower) ||
                salon.type.toLowerCase().includes(searchTermLower)
            );
            const filteredSalles = extractDataWithId(salles).filter(
              (salle) =>
                salle.name.toLowerCase().includes(searchTermLower) ||
                salle.type.toLowerCase().includes(searchTermLower)
            );
            const filteredPacks = extractDataWithId(packs).filter((pack) =>
              pack.name.toLowerCase().includes(searchTermLower)
            );

            return [
              ...filteredProducts,
              ...filteredChambres,
              ...filteredSalons,
              ...filteredSalles,
              ...filteredPacks,
            ];
          })
        )
        .subscribe((results) => {
          console.log('Tous les résultats trouvés:', results);
          this.allResults = results;
          this.searchService.setResults(this.allResults);
          if (this.allResults.length > 0) {
            this.route.navigate(['/search-results']);
          } else {
            console.warn('Aucun résultat trouvé pour la recherche.');
          }
        });
    }
  }

}
