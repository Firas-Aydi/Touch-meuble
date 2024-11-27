import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Chambre } from '../models/chambre.model';
import { Pack } from '../models/pack.model';
import { Product } from '../models/product.model';
import { SalleAManger } from '../models/salleAManger.model';
import { Salon } from '../models/salon.model';
import { Router } from '@angular/router';
import { PackService } from '../services/pack.service'; // Assuming you have a PackService for fetching packs
import { SalonService } from '../services/salon.service';
import { SalleAMangeService } from '../services/salle-amange.service';
import { ChambreService } from '../services/chambre.service';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
declare var bootstrap: any;

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  results: (Product | Chambre | Salon | SalleAManger | Pack)[] = [];
  // chambres: any[] = [];
  // salon: any[] = [];
  // salles: any[] = [];
  testimonials: any[] = [];

  // products: Product[] = [];
  // packs: Pack[] = [];
  quantity: number = 1;
  quantityError: string | null = null;

  selectedPack: Pack | null = null;
  selectedChambre: Chambre | null = null;
  selectedSalle: SalleAManger | null = null;
  selectedSalon: Salon | null = null;
  selectedProduct: Product | null = null;

  selectedImage: string = '';
  selectedChambreName: string | null = null;
  selectedSalleName: string | null = null;
  selectedSalonName: string | null = null;

  constructor(
    private searchService: SearchService,
    private productService: ProductService,
    private packService: PackService,
    private chambreService: ChambreService,
    private salleService: SalleAMangeService,
    private salonService: SalonService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Abonnez-vous aux résultats du service
    this.searchService.results$.subscribe((results) => {
      console.log('search-results: ', results);
      this.results = results;
      if (this.results.length === 0) {
        console.error('No results found for the search term.');
      }
    });
    // this.loadPacks();
    // this.loadChambres();
    // this.loadSalles();
    // this.loadSalon();
    // this.loadProducts();
  }

  getItemId(item: any): string {
    console.log('item:', item);
    if (item.chambreId) {
      this.viewChambreDetails(item.chambreId);
    } else if (item.salonId) {
      this.viewSalonDetails(item.salonId);
    } else if (item.salleId) {
      this.viewSalleDetails(item.salleId);
    } else if (item.productId) {
      this.viewProductDetails(item.productId);
    } else if (item.packId) {
      this.viewPackDetails(item.packId);
    }
    return (
      item.chambreId ||
      item.salonId ||
      item.salleId ||
      item.packId ||
      item.productId ||
      'ID non trouvé'
    );
  }
  // Load packs from the pack service
  // loadPacks(): void {
  //   this.packService.getAllPacks().subscribe((data: any[]) => {
  //     this.packs = data;
  //   });
  // }

  // loadChambres(): void {
  //   this.chambreService.getChambre().subscribe((data: any[]) => {
  //     this.chambres = data;
  //   });
  // }
  // loadSalles(): void {
  //   this.salleService.getSalle().subscribe((data: any[]) => {
  //     this.salles = data;
  //   });
  // }
  // loadSalon(): void {
  //   this.salonService.getSalons().subscribe((data: any[]) => {
  //     this.salon = data;
  //   });
  // }
  // loadProducts(): void {
  //   this.productService.getAllProducts().subscribe((data: any[]) => {
  //     this.products = data;
  //   });
  // }

  viewProductDetails(productId: string | undefined) {
    if (productId) {
      this.router.navigate(['/products', productId]);
    } else {
      console.error(
        'Product ID is undefined. Cannot navigate to product details.'
      );
    }
  }
  viewPackDetails(packId: string | undefined) {
    if (packId) {
      this.router.navigate(['/packs', packId]);
    } else {
      console.error('Pack ID is undefined. Cannot navigate to pack details.');
    }
  }
  viewChambreDetails(chambreId: string | undefined) {
    if (chambreId) {
      this.router.navigate(['/chambres', chambreId]);
    } else {
      console.error('Pack ID is undefined. Cannot navigate to pack details.');
    }
  }
  viewSalonDetails(salonId: string | undefined) {
    if (salonId) {
      this.router.navigate(['/salons', salonId]);
    } else {
      console.error('Pack ID is undefined. Cannot navigate to pack details.');
    }
  }
  viewSalleDetails(salleId: string | undefined) {
    if (salleId) {
      this.router.navigate(['/salles', salleId]);
    } else {
      console.error('Pack ID is undefined. Cannot navigate to pack details.');
    }
  }

  loadItemDetails(chambreId: string, salleId: string, salonId: string) {
    // Charger le nom de la chambre
    if (chambreId) {
      this.chambreService.getChambreById(chambreId).subscribe((chambre) => {
        this.selectedChambreName = chambre ? chambre.name : 'Chambre inconnue';
      });
    }

    // Charger le nom de la salle
    if (salleId) {
      this.salleService.getSalleById(salleId).subscribe((salle) => {
        this.selectedSalleName = salle ? salle.name : 'Salle inconnue';
      });
    }

    // Charger le nom du salon
    if (salonId) {
      this.salonService.getSalonById(salonId).subscribe((salon) => {
        this.selectedSalonName = salon ? salon.name : 'Salon inconnu';
      });
    }
  }

  openItemDetailsModal(item: any): string {
    console.log('item:', item);
    if (item.chambreId) {
      this.openChambreDetailsModal(item);
    } else if (item.salonId) {
      this.openChambreDetailsModal(item);
    } else if (item.salleId) {
      this.openChambreDetailsModal(item);
    } else if (item.productId) {
      this.openProductDetailsModal(item);
    } else if (item.packId) {
      this.openPackDetailsModal(item);
    }
    return (
      item.chambreId ||
      item.salonId ||
      item.salleId ||
      item.packId ||
      item.productId ||
      'ID non trouvé'
    );
  }

  openProductDetailsModal(product: Product) {
    this.selectedProduct = product;
    this.selectedImage = product.images[0];

    const productDetailsModal = new bootstrap.Modal(
      document.getElementById('productDetailsModal')
    );
    productDetailsModal.show();
  }
  openChambreDetailsModal(chambre: any) {
    console.log('chambre', chambre);
    this.selectedPack = chambre;
    console.log('selectedchambre', this.selectedPack);
    this.selectedImage = chambre.images[0];
    const chambreDetailsModal = new bootstrap.Modal(
      document.getElementById('chambreDetailsModal')
    );
    chambreDetailsModal.show();
  }
  openPackDetailsModal(pack: Pack) {
    console.log('pack', pack);
    this.selectedPack = pack;
    console.log('selectedPack', this.selectedPack);
    this.selectedImage = pack.images[0]; // Set the default selected image

    const selectedChambre = (pack as any)['selectedChambre'];
    const selectedSalle = (pack as any)['selectedSalle'];
    const selectedSalon = (pack as any)['selectedSalon'];

    this.loadItemDetails(selectedChambre, selectedSalle, selectedSalon);
    const packDetailsModal = new bootstrap.Modal(
      document.getElementById('packDetailsModal')
    );
    packDetailsModal.show();
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  addPackToCart(pack: Pack, quantity: number) {
    // Vérifier si le produit et la quantité sont valides
    if (pack && quantity > 0) {
      // Logique pour ajouter l'article au panier
      console.log(`Ajouté ${quantity} de ${pack.name} au panier.`);

      // En supposant que vous avez un CartService pour gérer le panier :
      this.cartService.addToCart(pack, 'pack', quantity);
      alert(`${quantity} ${pack.name}(s) ajouté(s) au panier !`);

      // Optionnellement afficher un message ou une notification de succès
      // alert(`${quantity} ${product.name}(s) ajouté(s) au panier !`);
    } else if (quantity <= 0) {
      // Gérer le cas où la quantité est invalide (par exemple, inférieure à 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else {
      // Gérer d'autres cas invalides, comme si l'objet produit est nul
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  addToCart(product: Product, quantity: number) {
    // Vérifier si le produit et la quantité sont valides
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
    this.quantityError = null; // Réinitialiser le message d'erreur

    if (this.quantity < 1) {
      this.quantityError = "La quantité doit être d'au moins 1.";
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'La quantité ne peut pas être vide.';
    }
  }
}
