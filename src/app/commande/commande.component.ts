import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Commande } from '../models/commande.model'; // Assurez-vous que le chemin est correct
import { CommandeService } from '../services/commande.service'; // Import the CommandeService
import { Router } from '@angular/router';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css'],
})
export class CommandeComponent implements OnInit {
  commande: Commande = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    notes: '',
    etat: 'en attente' // État par défaut
  };

  cartItems: any[] = []; // Pour stocker les articles du panier
  totalPrice: number = 0; // Pour calculer le total

  constructor(
    private cartService: CartService,
    private commandeService: CommandeService, // Inject CommandeService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );
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
