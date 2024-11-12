import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Commande } from '../models/commande.model';
import { CommandeService } from '../services/commande.service';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css'],
})
export class CommandeComponent implements OnInit {
  // Liste des villes avec leurs prix de livraison
  cities = [
    { name: 'Sfax', price: 30 },
    { name: 'Mahras', price: 100 },
    { name: 'Hencha', price: 100 },
    { name: 'Jbeniyana', price: 100 },
    { name: 'Agareb', price: 100 },
    { name: 'Skhira', price: 100 },
    { name: 'Chebba', price: 100 },
    { name: 'Grand Tunis', price: 30 },
    { name: 'Sousse', price: 50 },
    { name: 'Monastir', price: 50 },
    { name: 'Mahdia', price: 100 },
    { name: 'Hammamet', price: 50 },
    { name: 'Nabeul', price: 100 },
    { name: 'Béja', price: 100 },
    { name: 'Bizerte', price: 50 },
    { name: 'Kef', price: 100 },
    { name: 'Kairouan', price: 100 },
    { name: 'Gafsa', price: 150 },
    { name: 'Gabes', price: 100 },
    { name: 'Tozeur', price: 150 },
    { name: 'Djerba', price: 200 },
    { name: 'Jandouba', price: 100 },
    { name: 'Seliana', price: 100 },
    { name: 'Kasserine', price: 150 },
    { name: 'Mednine', price: 150 },
    { name: 'Gbeli', price: 150 },
    { name: 'Sidi Bouzid', price: 100 },
    { name: 'Tataouine', price: 200 },
    { name: 'Zaghouan', price: 100 }
  ];
  commande: Commande = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    region: '',
    codePostal: '',
    email: '',
    phone: '',
    notes: '',
    etat: 'en attente' // État par défaut
  };

  cartItems: any[] = []; // Pour stocker les articles du panier
  totalPrice: number = 0; // Pour calculer le total
  deliveryPrice: number = 0;

  constructor(
    private cartService: CartService,
    private commandeService: CommandeService, // Inject CommandeService
    // private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  updateDeliveryPrice(cityName: string) {
    const selectedCity = this.cities.find(city => city.name === cityName);
    this.deliveryPrice = selectedCity ? selectedCity.price : 0;
    this.calculateTotalPrice(); // Recalcule le total incluant la livraison
  }

  // Calcule le total des articles du panier avec le prix de livraison
  calculateTotalPrice() {
    const cartTotal = this.cartItems.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );
    this.totalPrice = cartTotal + this.deliveryPrice;
  }

  onSubmit() {
    this.commandeService
      .saveOrder(this.commande, this.cartItems, this.totalPrice)
      .then(() => {
        window.alert('Commande envoyée avec succès!');
        // this.router.navigate(['/confirmation']); 
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'enregistrement de la commande :",
          error
        );
      });
    // console.log('Commande soumise:', this.commande);
    // console.log('Détails du panier:', this.cartItems);
  }
}
