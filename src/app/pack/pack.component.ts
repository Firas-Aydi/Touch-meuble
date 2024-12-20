import { Component, OnInit } from '@angular/core';
import { PackService } from '../services/pack.service';
import { Pack } from '../models/pack.model';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ChambreService } from '../services/chambre.service';
import { SalleAMangeService } from '../services/salle-amange.service';
import { SalonService } from '../services/salon.service';
declare var bootstrap: any;

@Component({
  selector: 'app-pack',
  templateUrl: './pack.component.html',
  styleUrl: './pack.component.css',
})
export class PackComponent implements OnInit {
  packs: Pack[] = [];
  selectedPack: Pack | null = null;
  quantity: number = 1; // Default quantity
  quantityError: string | null = null;
  selectedImage: string = ''; // Initialize selectedImage

  currentPage = 1;
  pageSize = 36;
  paginatedPacks: Pack[] = [];

  selectedChambreName: string | null = null;
  selectedSalleName: string | null = null;
  selectedSalonName: string | null = null;

  imageIntervals: { [key: string]: any } = {};

  constructor(
    private packService: PackService,
    private chambreService: ChambreService,
    private salleService: SalleAMangeService,
    private salonService: SalonService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPacks();
    this.updatePaginatedPacks();
  }
  ngOnDestroy(): void {
    for (const packId in this.imageIntervals) {
      if (this.imageIntervals.hasOwnProperty(packId)) {
        clearInterval(this.imageIntervals[packId]);
      }
    }
    this.imageIntervals = {};
  }
  loadPacks() {
    this.packService.getAllPacks().subscribe((data) => {
      this.packs = data;
      this.updatePaginatedPacks();
    });
  }

  viewPackDetails(packId: string | undefined) {
    if (packId) {
      this.stopImageRotation(packId);
      this.router.navigate(['/packs', packId]);
    } else {
      console.error('Pack ID is undefined. Cannot navigate to pack details.');
    }
  }
  startImageRotation(packId: string): void {
    if (this.imageIntervals[packId]) {
      return;
    }

    const pack = this.paginatedPacks.find((c) => c.packId === packId);
    if (pack) {
      let currentIndex = 0;
      this.imageIntervals[packId] = setInterval(() => {
        currentIndex = (currentIndex + 1) % pack.images.length;
        const imgElement = document.getElementById(
          'image-' + packId
        ) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = pack.images[currentIndex];
        }
      }, 2000);
    }
  }

  stopImageRotation(packId: string): void {
    if (!packId) {
      return;
    }

    if (this.imageIntervals[packId]) {
      clearInterval(this.imageIntervals[packId]);
      delete this.imageIntervals[packId];
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
  openPackDetailsModal(pack: Pack) {
    if (pack.packId) {
      this.stopImageRotation(pack.packId); // Arrête toute rotation active
    }

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

      // Supposons que vous avez un CartService pour gérer le panier :
      this.cartService.addToCart(pack, 'pack', quantity);

      // Optionnellement, afficher un message de succès ou une notification
      alert(`${quantity} ${pack.name}(s) ajouté(s) au panier !`);
    } else if (quantity <= 0) {
      // Gérer le cas où la quantité est invalide (par exemple, inférieure à 1)
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    } else {
      // Gérer d'autres cas invalides, comme si l'objet produit est null
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

  updatePaginatedPacks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPacks = this.packs.slice(startIndex, endIndex);
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.updatePaginatedPacks();
  }

  get totalPages(): number {
    return Math.ceil(this.packs.length / this.pageSize);
  }
}
