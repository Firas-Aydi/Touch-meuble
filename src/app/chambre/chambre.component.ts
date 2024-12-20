import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chambre } from '../models/chambre.model';
import { ChambreService } from '../services/chambre.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-chambre',
  templateUrl: './chambre.component.html',
  styleUrl: './chambre.component.css',
})
export class ChambreComponent implements OnInit {
  chambres: Chambre[] = [];
  selectedChambre: Chambre | null = null;
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  selectedImage: string = ''; // Initialize selectedImage

  currentPage = 1;
  pageSize = 36;
  paginatedProducts: Chambre[] = [];

  filteredChambres: Chambre[] = [];
  currentType: string | null = null;

  imageIntervals: { [key: string]: any } = {}; // Utiliser un dictionnaire pour stocker les intervalles par chambreId

  constructor(
    private chambreService: ChambreService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentType = params.get('type');
      console.log('currentType: ', this.currentType);
      this.loadChambres(); // Charger les produits
    });
  }
  ngOnDestroy(): void {
    for (const chambreId in this.imageIntervals) {
      if (this.imageIntervals.hasOwnProperty(chambreId)) {
        clearInterval(this.imageIntervals[chambreId]);
      }
    }
    this.imageIntervals = {};
  }
  loadChambres() {
    this.chambreService.getChambre().subscribe((data) => {
      this.chambres = data;

      if (this.currentType) {
        this.filteredChambres = this.chambres.filter(
          (chambre) => chambre.type === this.currentType
        );
        console.log('filteredChambres: ', this.filteredChambres);
      } else {
        this.filteredChambres = this.chambres;
      }
      this.updatePaginatedProducts(); // Mettre à jour la pagination après le filtrage
    });
  }

  viewProductDetails(chambreId: string | undefined) {
    if (chambreId) {
      this.stopImageRotation(chambreId);
      this.router.navigate(['/chambres', chambreId]);
    } else {
      console.error(
        'Chambre ID is undefined. Cannot navigate to chambre details.'
      );
    }
  }

  openChambreDetailsModal(chambre: Chambre) {
    if (chambre.chambreId) {
      this.stopImageRotation(chambre.chambreId); // Arrête toute rotation active
    }
    this.selectedChambre = chambre;
    this.selectedImage = chambre.images[0]; // Set the default selected image

    const chambreDetailsModal = new bootstrap.Modal(
      document.getElementById('chambreDetailsModal')
    );
    chambreDetailsModal.show();
  }

  startImageRotation(chambreId: string): void {
    if (this.imageIntervals[chambreId]) {
      return;
    }

    const chambre = this.paginatedProducts.find(
      (c) => c.chambreId === chambreId
    );
    if (chambre) {
      let currentIndex = 0;
      this.imageIntervals[chambreId] = setInterval(() => {
        currentIndex = (currentIndex + 1) % chambre.images.length;
        const imgElement = document.getElementById(
          'image-' + chambreId
        ) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = chambre.images[currentIndex];
        }
      }, 2000);
    }
  }

  stopImageRotation(chambreId: string): void {
    if (!chambreId) {
      return;
    }

    if (this.imageIntervals[chambreId]) {
      clearInterval(this.imageIntervals[chambreId]);
      delete this.imageIntervals[chambreId];
    }
  }
  // startImageRotation(chambreId: string): void {
  //   const chambre = this.paginatedProducts.find(c => c.chambreId === chambreId);
  //   if (chambre) {
  //       let currentIndex = 0;
  //       const progressBar = document.getElementById('progress-bar-' + chambreId) as HTMLDivElement;

  //       // Fonction pour réinitialiser et redémarrer la barre de progression
  //       const resetProgressBar = () => {
  //           if (progressBar) {
  //               progressBar.style.transition = 'none';
  //               progressBar.style.width = '0%';
  //               setTimeout(() => {
  //                   progressBar.style.transition = `width ${this.rotationDuration}ms linear`;
  //                   progressBar.style.width = '100%';
  //               }, 10);
  //           }
  //       };

  //       resetProgressBar();

  //       // Définir l'intervalle pour changer les images et redémarrer la barre de progression
  //       this.imageIntervals[chambreId] = setInterval(() => {
  //           currentIndex = (currentIndex + 1) % chambre.images.length;
  //           const imgElement = document.getElementById('image-' + chambreId) as HTMLImageElement;
  //           if (imgElement) {
  //               imgElement.src = chambre.images[currentIndex];
  //           }
  //           resetProgressBar();
  //       }, this.rotationDuration);
  //   }
  // }

  // stopImageRotation(chambreId: string): void {
  //   if (this.imageIntervals[chambreId]) {
  //       clearInterval(this.imageIntervals[chambreId]);
  //       delete this.imageIntervals[chambreId];

  //       // Réinitialiser la barre de progression immédiatement
  //       const progressBar = document.getElementById('progress-bar-' + chambreId) as HTMLDivElement;
  //       if (progressBar) {
  //           progressBar.style.transition = 'none'; // Annule l'animation
  //           progressBar.style.width = '0%'; // Réinitialise la largeur
  //       }
  //   }
  // }
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
  }

  addToCart(chambre: Chambre, quantity: number) {
    // Check if the chambre and quantity are valid
    if (chambre && quantity > 0 && quantity <= chambre.stock) {
      // Logic to add the item to the cart
      console.log(`Ajouté ${quantity} ${chambre.name}(s) au panier.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(chambre, 'chambre', quantity);

      alert('${quantity} ${chambre.name}(s) ajoutée(s) au panier !');
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else if (quantity > chambre.stock) {
      // Handle case where the quantity exceeds the stock
      alert('La quantité saisie dépasse le stock disponible.');
    } else {
      // Handle other invalid cases, like if the chambre object is null
      alert('Une erreur s\'est produite. Veuillez réessayer.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'La quantité doit être au moins de 1.';
    } else if (this.quantity > (this.selectedChambre?.stock || 0)) {
      this.quantityError = `La quantité ne peut pas dépasser la limite de stock de ${this.selectedChambre?.stock}.`;
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
    this.paginatedProducts = this.filteredChambres.slice(startIndex, endIndex);
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.updatePaginatedProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.chambres.length / this.pageSize);
  }

  // updatePaginatedProducts() {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.paginatedProducts = this.filteredChambres.slice(startIndex, endIndex);
  // }

  // changePage(pageNumber: number) {
  //   if (pageNumber >= 1 && pageNumber <= this.totalPages) {
  //     this.currentPage = pageNumber;
  //     this.updatePaginatedProducts();
  //   }
  // }

  // get totalPages(): number {
  //   return Math.ceil(this.filteredChambres.length / this.pageSize);
  // }

  // getPagesArray(): number[] {
  //   return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  // }
}
