import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChambreService } from '../services/chambre.service';
import { Chambre } from '../models/chambre.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-chambre-details',
  templateUrl: './chambre-details.component.html',
  styleUrls: ['./chambre-details.component.css'],
})
export class ChambreDetailsComponent implements OnInit {
  chambre: Chambre | null = null; // Pour stocker les détails de la chambre
  selectedImage: string = ''; // Initialize selectedImage

  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private chambreService: ChambreService,
    private cartService: CartService

  ) {}

  ngOnInit(): void {
    const chambreId = this.route.snapshot.paramMap.get('chambreId');
    this.loadChambreDetails(chambreId);
    console.log('chambreId: ',chambreId)
  }

  // Charger les détails de la chambre en utilisant l'ID
  loadChambreDetails(chambreId: string | null) {
    if (chambreId) {
      this.chambreService.getChambreById(chambreId).subscribe((data) => {
        this.chambre = data || null;
        if (this.chambre) {
          this.selectedImage = this.chambre.images[0]; // Set the default selected image
        }
      });
    }
  }
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }
  addToCart(chambre: Chambre, quantity: number) {
    // Check if the chambre and quantity are valid
    if (chambre && quantity > 0) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${chambre.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(chambre, 'chambre', quantity);

      // Optionally show a success message or notification
      alert(`${quantity} ${chambre.name}(s) added to the cart!`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Please enter a valid quantity greater than 0.');
    } else if (quantity > chambre.stock) {
      // Handle case where the quantity exceeds the stock
      alert('The quantity entered exceeds the available stock.');
    } else {
      // Handle other invalid cases, like if the chambre object is null
      alert('An error occurred. Please try again.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'Quantity must be at least 1.';
    } else if (this.quantity > (this.chambre?.stock || 0)) {
      this.quantityError = `Quantity cannot exceed stock limit of ${this.chambre?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'Quantity cannot be empty.';
    }
  }
}
