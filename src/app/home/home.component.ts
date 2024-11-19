import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { CartService } from '../services/cart.service'; // Assuming you have a CartService for managing the cart
import { PackService } from '../services/pack.service'; // Assuming you have a PackService for fetching packs
// import { CategoryService } from '../services/category.service'; // Assuming you have a CategoryService
import { SalonService } from '../services/salon.service';
import { SalleAMangeService } from '../services/salle-amange.service';
import { ChambreService } from '../services/chambre.service';
import { Pack } from '../models/pack.model';
import { CartService } from '../services/cart.service';
import { Chambre } from '../models/chambre.model';
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // packs: any[] = [];
  // categories: any[] = [];
  chambres: any[] = [];
  salon: any[] = [];
  salles: any[] = [];
  testimonials: any[] = [];

  packs: Pack[] = [];
  quantity: number = 1;
  quantityError: string | null = null;

  selectedPack: Pack | null = null;
  selectedChambre: Chambre | null = null;
  selectedImage: string = '';
  selectedChambreName: string | null = null;
  selectedSalleName: string | null = null;
  selectedSalonName: string | null = null;

  imageIntervals: { [key: string]: any } = {};
  // rotationDuration = 1000;
  
  constructor(
    // private cartService: CartService,
    private packService: PackService,
    // private categoryService: CategoryService,
    private chambreService: ChambreService,
    private salleService: SalleAMangeService,
    private salonService: SalonService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPacks();
    // this.loadCategories();
    this.loadChambres();
    this.loadSalles();
    this.loadSalon();
    this.loadTestimonials();
  }
  ngOnDestroy(): void {
    for (const packId in this.imageIntervals) {
      if (this.imageIntervals.hasOwnProperty(packId)) {
        clearInterval(this.imageIntervals[packId]);
      }
    }
    this.imageIntervals = {};
    console.info("Tous les intervalles ont été arrêtés.");
  }
  
  // Load packs from the pack service
  loadPacks(): void {
    this.packService.getAllPacks().subscribe((data: any[]) => {
      this.packs = data;
    });
  }

  loadChambres(): void {
    this.chambreService.getChambre().subscribe((data: any[]) => {
      this.chambres = data;
    });
  }
  loadSalles(): void {
    this.salleService.getSalle().subscribe((data: any[]) => {
      this.salles = data;
    });
  }
  loadSalon(): void {
    this.salonService.getSalons().subscribe((data: any[]) => {
      this.salon = data;
    });
  }

  // Load testimonials (hardcoded for now, could be from a service in the future)
  loadTestimonials(): void {
    this.testimonials = [
      {
        name: 'John Doe',
        text: 'Superbe qualité et très bon service client. Le pack Karina est magnifique dans mon salon!',
        pack: 'Pack Karina',
      },
      {
        name: 'Sarah Belhadj',
        text: 'Je suis très satisfaite de mon achat! Le meuble de chambre est encore plus beau en vrai.',
        pack: 'Pack Chambre',
      },
      {
        name: 'Ahmed Ben Salah',
        text: 'Livraison rapide et produits de qualité, je recommande vivement Touch Meuble!',
        pack: 'Pack Salon',
      },
    ];
  }
  startImageRotation(packId: string): void {
    if (this.imageIntervals[packId]) {
      console.warn(`Rotation déjà active pour packId = ${packId}`);
      return;
    }
    
    const pack = this.packs.find(
      (c) => c.packId === packId
    );
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
      console.warn("stopImageRotation: Aucun packId fourni !");
      return;
    }
  
    if (this.imageIntervals[packId]) {
      try {
        clearInterval(this.imageIntervals[packId]); // Arrête l'intervalle
        delete this.imageIntervals[packId]; // Supprime la référence
        console.info(`stopImageRotation: Rotation arrêtée pour packId = ${packId}`);
      } catch (error) {
        console.error(`Erreur lors de l'arrêt de la rotation pour packId = ${packId}`, error);
      }
    } else {
      console.warn(`stopImageRotation: Aucun intervalle actif pour packId = ${packId}`);
    }
  }
  
  // Navigate to pack details
  viewPackDetails(packId: string | undefined) {
    if (packId) {
      this.stopImageRotation(packId)
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
  openChambreDetailsModal(chambre: Chambre) {
    console.log('chambre', chambre);
    this.selectedChambre = chambre;
    console.log('selectedchambre', this.selectedChambre);
    this.selectedImage = chambre.images[0]; // Set the default selected image

    // const selectedChambre = (pack as any)['selectedChambre'];
    // const selectedSalle = (pack as any)['selectedSalle'];
    // const selectedSalon = (pack as any)['selectedSalon'];

    // this.loadItemDetails(selectedChambre, selectedSalle, selectedSalon);
    const chambreDetailsModal = new bootstrap.Modal(
      document.getElementById('chambreDetailsModal')
    );
    chambreDetailsModal.show();
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
    // Check if the product and quantity are valid
    if (pack && quantity > 0) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${pack.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(pack, 'pack', quantity);
      alert(`${quantity} ${pack.name}(s) added to the cart!`);

      // Optionally show a success message or notification
      // alert(`${quantity} ${product.name}(s) added to the cart!`);
    } else if (quantity <= 0) {
      // Handle case where the quantity is invalid (e.g., less than 1)
      alert('Please enter a valid quantity greater than 0.');
    } else {
      // Handle other invalid cases, like if the product object is null
      alert('An error occurred. Please try again.');
    }
  }
  addChambreToCart(chambre: Chambre, quantity: number) {
    // Check if the product and quantity are valid
    if (chambre && quantity > 0) {
      // Logic to add the item to the cart
      console.log(`Added ${quantity} of ${chambre.name} to the cart.`);

      // Assuming you have a CartService to manage the cart:
      this.cartService.addToCart(chambre, 'chambre', quantity);
      alert(`${quantity} ${chambre.name}(s) added to the cart!`);

      // Optionally show a success message or notification
      // alert(`${quantity} ${product.name}(s) added to the cart!`);
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
