import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ActivatedRoute } from '@angular/router';
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

  filteredProducts: Product[] = [];
  currentType: string | null = null; // Ajouter une propriété pour stocker le type de produit
  sortOrder: 'asc' | 'desc' | null = null;

  imageIntervals: { [key: string]: any } = {}; 

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute // Injecter ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentType = params.get('type');
      // console.log('currentType: ', this.currentType);
      this.loadProducts(); // Charger les produits
    });
  }
  ngOnDestroy(): void {
    for (const productId in this.imageIntervals) {
      if (this.imageIntervals.hasOwnProperty(productId)) {
        clearInterval(this.imageIntervals[productId]);
      }
    }
    this.imageIntervals = {};
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;

      // Filtrer les produits par type, si un type est sélectionné
      if (this.currentType) {
        this.filteredProducts = this.products.filter(
          (product) => product.type === this.currentType
        );
        console.log('filteredProducts: ', this.filteredProducts);
      } else {
        this.filteredProducts = this.products;
      }
      this.updatePaginatedProducts(); // Mettre à jour la pagination après le filtrage
    });
  }
  sortProductsByPrice() {
    this.filteredProducts.sort((a, b) => {
      return this.sortOrder === 'asc'
        ? a.price - b.price
        : b.price - a.price;
    });
    this.updatePaginatedProducts();
  }
  setSortOrder(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.sortProductsByPrice();
  }
  

  viewProductDetails(productId: string | undefined) {
    if (productId) {
      this.stopImageRotation(productId)
      this.router.navigate(['/products', productId]);
    } else {
      console.error(
        'Product ID is undefined. Cannot navigate to product details.'
      );
    }
  }

  openProductDetailsModal(product: Product) {
    if (product.productId) {
      this.stopImageRotation(product.productId); 
    }
    this.selectedProduct = product;
    this.selectedImage = product.images[0];

    const productDetailsModal = new bootstrap.Modal(
      document.getElementById('productDetailsModal')
    );
    productDetailsModal.show();
  }
  startImageRotation(productId: string): void {
    if (this.imageIntervals[productId]) {
      return;
    }
    
    const product = this.paginatedProducts.find(
      (c) => c.productId === productId
    );
    if (product) {
      let currentIndex = 0;
      this.imageIntervals[productId] = setInterval(() => {
        currentIndex = (currentIndex + 1) % product.images.length;
        const imgElement = document.getElementById(
          'image-' + productId
        ) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = product.images[currentIndex];
        }
      }, 2000);
    }
  }

  stopImageRotation(productId: string): void {
    if (!productId) {
      return;
    }
  
    if (this.imageIntervals[productId]) {
      clearInterval(this.imageIntervals[productId]);
      delete this.imageIntervals[productId];
    }
  }
  selectImage(image: string) {
    this.selectedImage = image;
  }

  addToCart(product: Product, quantity: number) { 
    if (product && quantity > 0 && quantity <= product.stock) {
      console.log(`Ajouté ${quantity} de ${product.name} au panier.`);
      this.cartService.addToCart(product, 'product', quantity);
      alert(`${quantity} ${product.name}(s) ajouté(s) au panier !`);
    } else if (quantity <= 0) {
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > product.stock) {
      alert('La quantité entrée dépasse le stock disponible.');
    } else {
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  validateQuantity() {
    this.quantityError = null;
    if (this.quantity < 1) {
      this.quantityError = 'La quantité doit être d\'au moins 1.';
    } else if (this.quantity > (this.selectedProduct?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.selectedProduct?.stock}.`;
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'La quantité ne peut pas être vide.';
    }
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.updatePaginatedProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }
}
