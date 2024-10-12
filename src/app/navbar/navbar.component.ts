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
  userType: string = ''; // Ajoutez une propriété pour stocker le type d'utilisateur

  chambres$: Observable<Chambre[]>;
  salons$: Observable<Salon[]>;
  salles$: Observable<SalleAManger[]>;
  meubles$: Observable<Product[]>;

  products: Product[] = [];

  constructor(
    private af: AngularFireAuth,
    private route: Router,
    private as: AuthService,
    private firestore: AngularFirestore,
    private productService: ProductService
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
  this.chambres$ = this.firestore.collection<Chambre>('chambres').valueChanges(); // Collection pour les chambres
  this.salons$ = this.firestore.collection<Salon>('salons').valueChanges(); // Collection pour les salons
  this.salles$ = this.firestore.collection<SalleAManger>('salles').valueChanges(); // Collection pour les salles à manger
  this.meubles$ = this.firestore.collection<Product>('products').valueChanges(); // Collection pour les meubles

  this.chambres$.subscribe(data => console.log('Chambres:', data));
this.salons$.subscribe(data => console.log('Salons:', data));
this.salles$.subscribe(data => console.log('Salles à manger:', data));
this.meubles$.subscribe(data => console.log('Meubles:', data));

}

  ngOnInit(): void {
    this.loadProducts()
    console.log('User Type:', this.userType);

  }
  loadProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      console.log('products: ',this.products)
    });
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
  }
}
