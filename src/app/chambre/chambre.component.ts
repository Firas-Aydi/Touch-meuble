import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chambre } from '../models/chambre.model';
import { ChambreService } from '../services/chambre.service';
import { CartService } from '../services/cart.service';
declare var bootstrap: any;

@Component({
  selector: 'app-chambre',
  templateUrl: './chambre.component.html',
  styleUrl: './chambre.component.css'
})
export class ChambreComponent implements OnInit{
  chambres: Chambre[] = [];
  selectedChambre: Chambre | null = null;
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  selectedImage: string = ''; // Initialize selectedImage

  currentPage = 1;
  pageSize = 36;
  paginatedProducts: Chambre[] = [];

  constructor(
    private chambreService: ChambreService,
    private cartService: CartService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadChambres();
  this.updatePaginatedProducts();
  }
  loadChambres() {
    this.chambreService.getChambre().subscribe((data) => {
      this.chambres = data;
      this.updatePaginatedProducts(); // Make sure to update paginated products after loading
    });
  }

  viewProductDetails(chambreId: string | undefined) {
    if (chambreId) {
      this.router.navigate(['/chambres', chambreId]);
    } else {
      console.error(
        'Chambre ID is undefined. Cannot navigate to chambre details.'
      );
    }
  }

  openChambreDetailsModal(chambre: Chambre) {
    this.selectedChambre = chambre;
    this.selectedImage = chambre.images[0]; // Set the default selected image

    const chambreDetailsModal = new bootstrap.Modal(
      document.getElementById('chambreDetailsModal')
    );
    chambreDetailsModal.show();
  }

  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }

  addToCart(chambre: Chambre, quantity: number) {
    // Check if the chambre and quantity are valid
    if (chambre && quantity > 0 && quantity <= chambre.stock) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${chambre.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(chambre,'chambre', quantity);

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
    } else if (this.quantity > (this.selectedChambre?.stock || 0)) {
      this.quantityError = `Quantity cannot exceed stock limit of ${this.selectedChambre?.stock}.`;
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
    this.paginatedProducts = this.chambres.slice(startIndex, endIndex);
  }

  // Méthode pour changer de page
  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.updatePaginatedProducts();
  }

  // Obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.chambres.length / this.pageSize);
  }
}
