import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
declare var bootstrap: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  selectedImage: string = ''; // Initialize selectedImage

  currentPage = 1;
  pageSize = 36;
  paginatedProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  this.updatePaginatedProducts();
  }


  loadProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.updatePaginatedProducts(); // Make sure to update paginated products after loading
    });
  }

  viewProductDetails(productId: string | undefined) {
    if (productId) {
      this.router.navigate(['/products', productId]);
    } else {
      console.error(
        'Product ID is undefined. Cannot navigate to product details.'
      );
    }
  }

  openProductDetailsModal(product: Product) {
    this.selectedProduct = product;
    this.selectedImage = product.images[0]; // Set the default selected image

    const productDetailsModal = new bootstrap.Modal(
      document.getElementById('productDetailsModal')
    );
    productDetailsModal.show();
  }

  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }
  
  addToCart(product: Product, quantity: number) {
    // Check if the product and quantity are valid
    if (product && quantity > 0 && quantity <= product.stock) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${product.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(product,'product', quantity);
      alert(`${quantity} ${product.name}(s) added to the cart!`);

      // Optionally show a success message or notification
      alert(`${quantity} ${product.name}(s) added to the cart!`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Please enter a valid quantity greater than 0.');
    } else if (quantity > product.stock) {
      // Handle case where the quantity exceeds the stock
      alert('The quantity entered exceeds the available stock.');
    } else {
      // Handle other invalid cases, like if the product object is null
      alert('An error occurred. Please try again.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'Quantity must be at least 1.';
    } else if (this.quantity > (this.selectedProduct?.stock || 0)) {
      this.quantityError = `Quantity cannot exceed stock limit of ${this.selectedProduct?.stock}.`;
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
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  // Méthode pour changer de page
  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.updatePaginatedProducts();
  }

  // Obtenir le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }
}
