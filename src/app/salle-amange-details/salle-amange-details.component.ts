import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalleAMangeService } from '../services/salle-amange.service';
import { SalleAManger } from '../models/salleAManger.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-salle-amange-details',
  templateUrl: './salle-amange-details.component.html',
  styleUrl: './salle-amange-details.component.css'
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
    console.log('salleId: ',salleId)
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
  // Check if the salle and quantity are valid
  if (salle && quantity > 0) {
    // Logic to add the item to the cart
    console.log(`Added ${quantity} of ${salle.name} to the cart.`);

    // Assuming you have a CartService to manage the cart:
    this.cartService.addToCart(salle, 'salle', quantity);
    alert(`${quantity} ${salle.name}(s) added to the cart!`);

    // Optionally show a success message or notification
    // alert(`${quantity} ${salle.name}(s) added to the cart!`);
  } else if (quantity <= 0) {
    // Handle case where the quantity is invalid (e.g., less than 1)
    alert('Please enter a valid quantity greater than 0.');
  } else if (quantity > salle.stock) {
    // Handle case where the quantity exceeds the stock
    alert('The quantity entered exceeds the available stock.');
  } else {
    // Handle other invalid cases, like if the salle object is null
    alert('An error occurred. Please try again.');
  }
}

validateQuantity() {
  this.quantityError = null; // Reset error message

  if (this.quantity < 1) {
    this.quantityError = 'Quantity must be at least 1.';
  } else if (this.quantity > (this.salle?.stock || 0)) {
    this.quantityError = `Quantity cannot exceed stock limit of ${this.salle?.stock}.`;
  } else if (
    this.quantity === null ||
    this.quantity === undefined ||
    this.quantity === 0
  ) {
    this.quantityError = 'Quantity cannot be empty.';
  }
}
}

