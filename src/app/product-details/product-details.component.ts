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
  showDetails: boolean = false;

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
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }
  addToCart(product: Product, quantity: number) {
    // Vérifier si le produit et la quantité sont valides
    if (product && quantity > 0 && quantity <= product.stock) {
      // Logique pour ajouter l'article au panier
      console.log(`Ajouté ${quantity} de ${product.name} au panier.`);

      // En supposant que vous avez un CartService pour gérer le panier :
      this.cartService.addToCart(product, 'product', quantity);

      // Optionnellement afficher un message de succès ou une notification
      alert(`${quantity} ${product.name}(s) ajouté(s) au panier !`);
    } else if (quantity <= 0) {
      // Gérer le cas où la quantité est invalide (par exemple, inférieure à 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > product.stock) {
      // Gérer le cas où la quantité dépasse le stock disponible
      alert('La quantité entrée dépasse le stock disponible.');
    } else {
      // Gérer les autres cas invalides, comme si l'objet produit est nul
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Réinitialiser le message d'erreur

    if (this.quantity < 1) {
      this.quantityError = "La quantité doit être d'au moins 1.";
    } else if (this.quantity > (this.product?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.product?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'La quantité ne peut pas être vide.';
    }
  }
}
