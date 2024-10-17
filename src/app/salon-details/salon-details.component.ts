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
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }
  addToCart(salon: Salon, quantity: number) {
    // Check if the salon and quantity are valid
    if (salon && quantity > 0) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${salon.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(salon, 'salon', quantity);

      // Optionally show a success message or notification
      alert(`${quantity} ${salon.name}(s) added to the cart!`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Please enter a valid quantity greater than 0.');
    } else if (quantity > salon.stock) {
      // Handle case where the quantity exceeds the stock
      alert('The quantity entered exceeds the available stock.');
    } else {
      // Handle other invalid cases, like if the salon object is null
      alert('An error occurred. Please try again.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'Quantity must be at least 1.';
    } else if (this.quantity > (this.salon?.stock || 0)) {
      this.quantityError = `Quantity cannot exceed stock limit of ${this.salon?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'Quantity cannot be empty.';
    }
  }
}
