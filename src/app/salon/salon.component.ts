import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Salon } from '../models/salon.model';
import { SalonService } from '../services/salon.service';
import { CartService } from '../services/cart.service';
declare var bootstrap: any;
import { ActivatedRoute } from '@angular/router';

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

  filteredSalons: Salon[] = [];
  currentType: string | null = null;

  imageIntervals: { [key: string]: any } = {}; 

  constructor(
    private salonService: SalonService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
 
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentType = params.get('type');
      console.log('currentType: ', this.currentType);
      this.loadSalons(); // Charger les produits
    });
  }
  ngOnDestroy(): void {
    for (const salonId in this.imageIntervals) {
      if (this.imageIntervals.hasOwnProperty(salonId)) {
        clearInterval(this.imageIntervals[salonId]);
      }
    }
    this.imageIntervals = {};
  }
  loadSalons() {
    this.salonService.getSalons().subscribe((data) => {
      this.salons = data;
      if (this.currentType) {
        this.filteredSalons = this.salons.filter(
          (salon) => salon.type === this.currentType
        );
        console.log('filteredSalons: ', this.filteredSalons);
      } else {
        this.filteredSalons = this.salons;
      }
      this.updatePaginatedProducts(); // Mettre à jour la pagination après le filtrage
    });
  }
  startImageRotation(salonId: string): void {
    if (this.imageIntervals[salonId]) {
      return;
    }
    
    const salon = this.paginatedProducts.find(
      (c) => c.salonId === salonId
    );
    if (salon) {
      let currentIndex = 0;
      this.imageIntervals[salonId] = setInterval(() => {
        currentIndex = (currentIndex + 1) % salon.images.length;
        const imgElement = document.getElementById(
          'image-' + salonId
        ) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = salon.images[currentIndex];
        }
      }, 2000);
    }
  }

  stopImageRotation(salonId: string): void {
    if (!salonId) {
      return;
    }
  
    if (this.imageIntervals[salonId]) {
      clearInterval(this.imageIntervals[salonId]);
      delete this.imageIntervals[salonId];
    }
  }
  viewProductDetails(salonId: string | undefined) {
    if (salonId) {
      this.stopImageRotation(salonId);
      this.router.navigate(['/salons', salonId]);
    } else {
      console.error(
        'Salon ID is undefined. Cannot navigate to Salon details.'
      );
    }
  }

  openSalonDetailsModal(salon: Salon) {
    if (salon.salonId) {
      this.stopImageRotation(salon.salonId); // Arrête toute rotation active
    }
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
    // Vérifier si le salon et la quantité sont valides
    if (salon && quantity > 0 && quantity <= salon.stock) {
      // Logique pour ajouter l'article au panier
      console.log(`Ajouté ${quantity} de ${salon.name} au panier.`);

      // En supposant que vous avez un CartService pour gérer le panier :
      this.cartService.addToCart(salon, 'salon', quantity);

      // Optionnellement afficher un message de succès ou une notification
      alert(`${quantity} ${salon.name}(s) ajouté(s) au panier !`);
    } else if (quantity <= 0) {
      // Gérer le cas où la quantité est invalide (par exemple, inférieure à 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > salon.stock) {
      // Gérer le cas où la quantité dépasse le stock
      alert('La quantité entrée dépasse le stock disponible.');
    } else {
      // Gérer d'autres cas invalides, comme si l'objet salon est nul
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Réinitialiser le message d'erreur

    if (this.quantity < 1) {
      this.quantityError = 'La quantité doit être d\'au moins 1.';
    } else if (this.quantity > (this.selectedSalon?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.selectedSalon?.stock}.`;
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
    this.paginatedProducts = this.filteredSalons.slice(startIndex, endIndex);
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

