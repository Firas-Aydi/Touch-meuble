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

  loadPacks() {
    this.packService.getAllPacks().subscribe((data) => {
      this.packs = data;
      this.updatePaginatedPacks(); // Make sure to update paginated products after loading
    });
  }

  viewPackDetails(packId: string | undefined) {
    if (packId) {
      this.router.navigate(['/packs', packId]);
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
    // Check if the product and quantity are valid
    if (pack && quantity > 0) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${pack.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(pack, 'pack', quantity);
      alert(`${quantity} ${pack.name}(s) added to the cart!`);

      // Optionally show a success message or notification
      alert(`${quantity} ${pack.name}(s) added to the cart!`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Please enter a valid quantity greater than 0.');
    } else {
      // Handle other invalid cases, like if the product object is null
      alert('An error occurred. Please try again.');
    }
  }

  validateQuantity() {
    this.quantityError = null; // Reset error message

    if (this.quantity < 1) {
      this.quantityError = 'Quantity must be at least 1.';
    } else if (
      this.quantity === null ||
      this.quantity === undefined ||
      this.quantity === 0
    ) {
      this.quantityError = 'Quantity cannot be empty.';
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
