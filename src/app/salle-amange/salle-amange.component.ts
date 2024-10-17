import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalleAManger } from '../models/salleAManger.model';
import { SalleAMangeService } from '../services/salle-amange.service';
import { CartService } from '../services/cart.service';
declare var bootstrap: any;
@Component({
  selector: 'app-salle-amange',
  templateUrl: './salle-amange.component.html',
  styleUrl: './salle-amange.component.css',
})
export class SalleAmangeComponent implements OnInit {
  salles: SalleAManger[] = [];
  selectedSalle: SalleAManger | null = null;
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  selectedImage: string = ''; // Initialize selectedImage

  currentPage = 1;
  pageSize = 36;
  paginatedProducts: SalleAManger[] = [];

  constructor(
    private salleService: SalleAMangeService,
    private cartService: CartService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadSalles();
    this.updatePaginatedProducts();
  }
  loadSalles() {
    this.salleService.getSalle().subscribe((data) => {
      this.salles = data;
      this.updatePaginatedProducts(); // Make sure to update paginated products after loading
    });
  }

  viewProductDetails(salleId: string | undefined) {
    if (salleId) {
      this.router.navigate(['/salles', salleId]);
    } else {
      console.error(
        'Salle A Manger ID is undefined. Cannot navigate to Salle A Manger details.'
      );
    }
  }

  openSalleDetailsModal(salleAManger: SalleAManger) {
    this.selectedSalle = salleAManger;
    this.selectedImage = salleAManger.images[0]; // Set the default selected image

    const salleDetailsModal = new bootstrap.Modal(
      document.getElementById('salleDetailsModal')
    );
    salleDetailsModal.show();
  }

  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }

  addToCart(salleAManger: SalleAManger, quantity: number) {
    // Check if the SalleAManger and quantity are valid
    if (salleAManger && quantity > 0 && quantity <= salleAManger.stock) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${salleAManger.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(salleAManger, 'salle', quantity);

      // Optionally show a success message or notification
      alert(`${quantity} ${salleAManger.name}(s) added to the cart!`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Please enter a valid quantity greater than 0.');
    } else if (quantity > salleAManger.stock) {
      // Handle case where the quantity exceeds the stock
      alert('The quantity entered exceeds the available stock.');
    } else {
      // Handle other invalid cases, like if the SalleAManger object is null
      alert('An error occurred. Please try again.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'Quantity must be at least 1.';
    } else if (this.quantity > (this.selectedSalle?.stock || 0)) {
      this.quantityError = `Quantity cannot exceed stock limit of ${this.selectedSalle?.stock}.`;
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
    this.paginatedProducts = this.salles.slice(startIndex, endIndex);
  }

  // Méthode pour changer de page
  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.updatePaginatedProducts();
  }

  // Obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.salles.length / this.pageSize);
  }
}
