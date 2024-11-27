import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalleAManger } from '../models/salleAManger.model';
import { SalleAMangeService } from '../services/salle-amange.service';
import { CartService } from '../services/cart.service';
declare var bootstrap: any;
import { ActivatedRoute } from '@angular/router';

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

  filteredSalles: SalleAManger[] = [];
  currentType: string | null = null;

  imageIntervals: { [key: string]: any } = {}; 

  constructor(
    private salleService: SalleAMangeService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentType = params.get('type');
      console.log('currentType: ', this.currentType);
      this.loadSalles(); // Charger les produits
    });
  }
  ngOnDestroy(): void {
    for (const salleId in this.imageIntervals) {
      if (this.imageIntervals.hasOwnProperty(salleId)) {
        clearInterval(this.imageIntervals[salleId]);
      }
    }
    this.imageIntervals = {};
  }
  loadSalles() {
    this.salleService.getSalle().subscribe((data) => {
      this.salles = data;
      if (this.currentType) {
        this.filteredSalles = this.salles.filter(
          (salle) => salle.type === this.currentType
        );
        console.log('filteredSalles: ', this.filteredSalles);
      } else {
        this.filteredSalles = this.salles;
      }
      this.updatePaginatedProducts(); // Mettre à jour la pagination après le filtrage
    });
  }

  viewProductDetails(salleId: string | undefined) {
    if (salleId) {
      this.stopImageRotation(salleId);
      this.router.navigate(['/salles', salleId]);
    } else {
      console.error(
        'Salle A Manger ID is undefined. Cannot navigate to Salle A Manger details.'
      );
    }
  }

  openSalleDetailsModal(salleAManger: SalleAManger) {
    if (salleAManger.salleId) {
      this.stopImageRotation(salleAManger.salleId); // Arrête toute rotation active
    }
        
    this.selectedSalle = salleAManger;
    this.selectedImage = salleAManger.images[0]; // Set the default selected image

    const salleDetailsModal = new bootstrap.Modal(
      document.getElementById('salleDetailsModal')
    );
    salleDetailsModal.show();
  }
  startImageRotation(salleId: string): void {
    if (this.imageIntervals[salleId]) {
      return;
    }
    
    const salle = this.paginatedProducts.find((c) => c.salleId === salleId);
    if (salle) {
      let currentIndex = 0;
      this.imageIntervals[salleId] = setInterval(() => {
        currentIndex = (currentIndex + 1) % salle.images.length;
        const imgElement = document.getElementById(
          'image-' + salleId
        ) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = salle.images[currentIndex];
        }
      }, 2000);
    }
  }

  stopImageRotation(salleId: string): void {
    if (!salleId) {
      return;
    }
  
    if (this.imageIntervals[salleId]) {
      clearInterval(this.imageIntervals[salleId]);
      delete this.imageIntervals[salleId];
    }
  }
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }

  addToCart(salleAManger: SalleAManger, quantity: number) {
    // Vérifier si la SalleAManger et la quantité sont valides
    if (salleAManger && quantity > 0 && quantity <= salleAManger.stock) {
      // Logique pour ajouter l'article au panier
      console.log(`Ajouté ${quantity} de ${salleAManger.name} au panier.`);

      // En supposant que vous avez un CartService pour gérer le panier :
      this.cartService.addToCart(salleAManger, 'salle', quantity);

      // Optionnellement afficher un message de succès ou une notification
      alert(`${quantity} ${salleAManger.name}(s) ajouté(s) au panier !`);
    } else if (quantity <= 0) {
      // Gérer le cas où la quantité est invalide (par exemple, inférieure à 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > salleAManger.stock) {
      // Gérer le cas où la quantité dépasse le stock disponible
      alert('La quantité entrée dépasse le stock disponible.');
    } else {
      // Gérer les autres cas invalides, comme si l'objet SalleAManger est nul
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Réinitialiser le message d'erreur

    if (this.quantity < 1) {
      this.quantityError = 'La quantité doit être d\'au moins 1.';
    } else if (this.quantity > (this.selectedSalle?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.selectedSalle?.stock}.`;
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
    this.paginatedProducts = this.filteredSalles.slice(startIndex, endIndex);
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
