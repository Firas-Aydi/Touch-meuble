import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  selectedImage: string = ''; // Initialize selectedImage

  quantity: number = 1; // Default quantity
  quantityError: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId'); // Get the productId from route
    this.loadProduct(productId);
  }

  loadProduct(productId: string | null) {
    if (productId) {
      this.productService.getProductById(productId).subscribe((data) => {
        this.product = data || null;
        if (this.product) {
          this.selectedImage = this.product.images[0]; // Set the default selected image
        }
      });
    }
  }

  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }
  addToCart(product: Product, quantity: number) {
    if (product && quantity > 0 && quantity <= product.stock) {
      console.log(`Added ${quantity} of ${product.name} to the cart.`);

      this.cartService.addProductToCart(product, quantity);

    } else if (quantity <= 0) {
      alert('Please enter a valid quantity greater than 0.');
    } else if (quantity > product.stock) {
      alert('The quantity entered exceeds the available stock.');
    } else {
      alert('An error occurred. Please try again.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'Quantity must be at least 1.';
    } else if (this.quantity > (this.product?.stock || 0)) {
      this.quantityError = `Quantity cannot exceed stock limit of ${this.product?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'Quantity cannot be empty.';
    }
  }
}
