import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Salon } from '../models/salon.model';
import { SalonService } from '../services/salon.service';
import { CartService } from '../services/cart.service';
declare var bootstrap: any;

@Component({
  selector: 'app-salon',
  templateUrl: './salon.component.html',
  styleUrl: './salon.component.css'
})
export class SalonComponent implements OnInit{
  salons: Salon[] = [];
  selectedSalon: Salon | null = null;
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  selectedImage: string = ''; // Initialize selectedImage

  currentPage = 1;
  pageSize = 36;
  paginatedProducts: Salon[] = [];

  constructor(
    private salonService: SalonService,
    private cartService: CartService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadSalons();
  this.updatePaginatedProducts();
  }
  loadSalons() {
    this.salonService.getSalons().subscribe((data) => {
      this.salons = data;
      this.updatePaginatedProducts(); // Make sure to update paginated products after loading
    });
  }

  viewProductDetails(salonId: string | undefined) {
    if (salonId) {
      this.router.navigate(['/salons', salonId]);
    } else {
      console.error(
        'Salon ID is undefined. Cannot navigate to Salon details.'
      );
    }
  }

  openSalonDetailsModal(salon: Salon) {
    this.selectedSalon = salon;
    this.selectedImage = salon.images[0]; // Set the default selected image

    const salonDetailsModal = new bootstrap.Modal(
      document.getElementById('salonDetailsModal')
    );
    salonDetailsModal.show();
  }

  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }

  addToCart(salon: Salon, quantity: number) {
    // Check if the Salon and quantity are valid
    if (salon && quantity > 0 && quantity <= salon.stock) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${salon.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(salon,'salon', quantity);

      // Optionally show a success message or notification
      alert(`${quantity} ${salon.name}(s) added to the cart!`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Please enter a valid quantity greater than 0.');
    } else if (quantity > salon.stock) {
      // Handle case where the quantity exceeds the stock
      alert('The quantity entered exceeds the available stock.');
    } else {
      // Handle other invalid cases, like if the Salon object is null
      alert('An error occurred. Please try again.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'Quantity must be at least 1.';
    } else if (this.quantity > (this.selectedSalon?.stock || 0)) {
      this.quantityError = `Quantity cannot exceed stock limit of ${this.selectedSalon?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'Quantity cannot be empty.';
    }
  }

  
  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.salons.slice(startIndex, endIndex);
  }

  // Méthode pour changer de page
  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.updatePaginatedProducts();
  }

  // Obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.salons.length / this.pageSize);
  }
}

