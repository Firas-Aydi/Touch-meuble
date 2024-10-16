import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Pour accéder à l'ID dans l'URL
import { Pack } from '../models/pack.model'; // Le modèle Pack
import { PackService } from '../services/pack.service'; // Le service pour récupérer les packs
import { CartService } from '../services/cart.service';
import { ChambreService } from '../services/chambre.service';
import { SalleAMangeService } from '../services/salle-amange.service';
import { SalonService } from '../services/salon.service';

@Component({
  selector: 'app-pack-details',
  templateUrl: './pack-details.component.html',
  styleUrls: ['./pack-details.component.css'],
})
export class PackDetailsComponent implements OnInit {
  pack: Pack | null = null;
  selectedImage: string = ''; // Initialize selectedImage

  quantity: number = 1; // Default quantity
  quantityError: string | null = null;

  selectedChambreName: string | null = null;
  selectedSalleName: string | null = null;
  selectedSalonName: string | null = null;
    //  des IDs des pièces
    selectedChambreId: string | null = null;
    selectedSalleId: string | null = null;
    selectedSalonId: string | null = null;
  constructor(
    private route: ActivatedRoute, // Pour obtenir l'ID du pack dans l'URL
    private packService: PackService,
    private chambreService: ChambreService,
    private salleService: SalleAMangeService,
    private salonService: SalonService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const packId = this.route.snapshot.paramMap.get('packId'); // Get the PackId from route
    this.loadPack(packId);
  }
  loadPack(PackId: string | null) {
    if (PackId) {
      this.packService.getPackById(PackId).subscribe((data) => {
        this.pack = data || null;
        console.log('pack: ', this.pack);
        if (this.pack) {
          this.selectedImage = this.pack.images[0];
          const selectedChambre = (this.pack as any)['selectedChambre'];
          const selectedSalle = (this.pack as any)['selectedSalle'];
          const selectedSalon = (this.pack as any)['selectedSalon'];

          // Sauvegarder les IDs des pièces
          this.selectedChambreId = selectedChambre;
          this.selectedSalleId = selectedSalle;
          this.selectedSalonId = selectedSalon;
          
          this.loadItemDetails(selectedChambre, selectedSalle, selectedSalon);
        }
      });
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
  selectImage(image: string) {
    this.selectedImage = image; // Set the selected image when clicked
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
}
