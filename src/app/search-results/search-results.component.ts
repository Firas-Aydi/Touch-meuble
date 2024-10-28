import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { Chambre } from '../models/chambre.model';
import { Pack } from '../models/pack.model';
import { Product } from '../models/product.model';
import { SalleAManger } from '../models/salleAManger.model';
import { Salon } from '../models/salon.model';
import { PackService } from '../services/pack.service';
import { CategoryService } from '../services/category.service';
import { SalonService } from '../services/salon.service';
import { SalleAMangeService } from '../services/salle-amange.service';
import { ChambreService } from '../services/chambre.service';
import { CartService } from '../services/cart.service';

declare var bootstrap: any;

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  results: (Product | Chambre | Salon | SalleAManger | Pack)[] = [];
  selectedItem: any = null;
  selectedImage: string = '';
  quantity: number = 1;
  quantityError: string | null = null;

  constructor(
    private searchService: SearchService,
    private packService: PackService,
    private categoryService: CategoryService,
    private chambreService: ChambreService,
    private salleService: SalleAMangeService,
    private salonService: SalonService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.results$.subscribe((results) => {
      this.results = results;
    });
  }

  viewDetails(item: any): void {
    const itemId = this.getItemId(item);
    const itemType = encodeURIComponent(item.type);
    console.log('itemType:',itemType)
    this.router.navigate([`/${itemType}`, itemId]);
}


  openDetailsModal(item: any): void {
    this.selectedItem = item;
    this.selectedImage = item.images[0];
    const modalId = item.type === 'pack' ? 'packDetailsModal' : 'chambreDetailsModal';
    const detailsModal = new bootstrap.Modal(document.getElementById(modalId));
    detailsModal.show();
  }

  getItemId(item: any): string {
    return item.chambreId || item.salonId || item.salleId || item.packId || 'ID non trouvé';
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  addPackToCart(pack: Pack, quantity: number) {
    if (pack && quantity > 0) {
      this.cartService.addToCart(pack, 'pack', quantity);
      alert(`${quantity} ${pack.name}(s) ajoutés au panier !`);
    } else {
      alert('Veuillez entrer une quantité valide supérieure à 0.');
    }
  }

  validateQuantity() {
    this.quantityError = this.quantity < 1 ? 'La quantité doit être au moins 1.' : null;
  }
}
