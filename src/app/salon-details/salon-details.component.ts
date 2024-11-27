import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalonService } from '../services/salon.service';
import { Salon } from '../models/salon.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-salon-details',
  templateUrl: './salon-details.component.html',
  styleUrl: './salon-details.component.css',
})
export class SalonDetailsComponent implements OnInit {
  salon: Salon | null = null; // Pour stocker les détails de la salon
  selectedImage: string = ''; // Initialize selectedImage
  showDetails: boolean = false;

  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private salonService: SalonService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const salonId = this.route.snapshot.paramMap.get('salonId');
    this.loadSalonDetails(salonId);
    console.log('salonId: ', salonId);
  }

  // Charger les détails de la salon en utilisant l'ID
  loadSalonDetails(salonId: string | null) {
    if (salonId) {
      this.salonService.getSalonById(salonId).subscribe((data) => {
        this.salon = data || null;
        if (this.salon) {
          this.selectedImage = this.salon.images[0]; // Set the default selected image
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
  addToCart(salon: Salon, quantity: number) {
    // Vérifier si le salon et la quantité sont valides
    if (salon && quantity > 0) {
      // Logique pour ajouter l'article au panier
      console.log(`Ajouté ${quantity} de ${salon.name} au panier.`);

      // En supposant que vous avez un CartService pour gérer le panier :
      this.cartService.addToCart(salon, 'salon', quantity);

      // Optionnellement afficher un message de succès ou une notification
      alert(`${quantity} ${salon.name}(s) ajouté(s) au panier !`);
    } else if (quantity <= 0) {
      // Gérer le cas où la quantité est invalide (par exemple, inférieure à 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > salon.stock) {
      // Gérer le cas où la quantité dépasse le stock
      alert('La quantité entrée dépasse le stock disponible.');
    } else {
      // Gérer d'autres cas invalides, comme si l'objet salon est nul
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Réinitialiser le message d'erreur

    if (this.quantity < 1) {
      this.quantityError = "La quantité doit être d'au moins 1.";
    } else if (this.quantity > (this.salon?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.salon?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'La quantité ne peut pas être vide.';
    }
  }
}
