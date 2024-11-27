import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalleAMangeService } from '../services/salle-amange.service';
import { SalleAManger } from '../models/salleAManger.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-salle-amange-details',
  templateUrl: './salle-amange-details.component.html',
  styleUrl: './salle-amange-details.component.css',
})
export class SalleAmangeDetailsComponent {
  salle: SalleAManger | null = null; // Pour stocker les détails de la salle
  selectedImage: string = ''; // Initialize selectedImage
  showDetails: boolean = false;

  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private salleService: SalleAMangeService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const salleId = this.route.snapshot.paramMap.get('salleId');
    this.loadSalleDetails(salleId);
    console.log('salleId: ', salleId);
  }
  // Charger les détails de la salle en utilisant l'ID
  loadSalleDetails(salleId: string | null) {
    if (salleId) {
      this.salleService.getSalleById(salleId).subscribe((data) => {
        this.salle = data || null;
        if (this.salle) {
          this.selectedImage = this.salle.images[0]; // Set the default selected image
        }
      });
    }
  }
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }
  addToCart(salle: SalleAManger, quantity: number) {
    // Vérifier si la salle et la quantité sont valides
    if (salle && quantity > 0) {
      // Logique pour ajouter l'article au panier
      console.log(`Ajouté ${quantity} de ${salle.name} au panier.`);

      // En supposant que vous avez un CartService pour gérer le panier :
      this.cartService.addToCart(salle, 'salle', quantity);
      alert(`${quantity} ${salle.name}(s) ajouté(s) au panier !`);

      // Optionnellement afficher un message de succès ou une notification
      // alert(`${quantity} ${salle.name}(s) ajouté(s) au panier !`);
    } else if (quantity <= 0) {
      // Gérer le cas où la quantité est invalide (par exemple, inférieure à 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > salle.stock) {
      // Gérer le cas où la quantité dépasse le stock
      alert('La quantité entrée dépasse le stock disponible.');
    } else {
      // Gérer d'autres cas invalides, comme si l'objet salle est nul
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Réinitialiser le message d'erreur

    if (this.quantity < 1) {
      this.quantityError = "La quantité doit être d'au moins 1.";
    } else if (this.quantity > (this.salle?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.salle?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'La quantité ne peut pas être vide.';
    }
  }
}
