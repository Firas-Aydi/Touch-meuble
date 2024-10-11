import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { CartService } from '../services/cart.service'; // Assuming you have a CartService for managing the cart
import { PackService } from '../services/pack.service'; // Assuming you have a PackService for fetching packs
import { CategoryService } from '../services/category.service'; // Assuming you have a CategoryService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  packs: any[] = [];
  categories: any[] = [];
  testimonials: any[] = [];

  constructor(
    // private cartService: CartService,
    private packService: PackService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPacks();
    this.loadCategories();
    this.loadTestimonials();
  }

  // Load packs from the pack service
  loadPacks(): void {
    this.packService.getAllPacks().subscribe((data: any[]) => {
      this.packs = data;
    });
  }

  // Load categories from the category service
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data: any[]) => {
      this.categories = data;
    });
  }

  // Load testimonials (hardcoded for now, could be from a service in the future)
  loadTestimonials(): void {
    this.testimonials = [
      {
        name: 'John Doe',
        text: 'Superbe qualité et très bon service client. Le pack Karina est magnifique dans mon salon!',
        pack: 'Pack Karina'
      },
      {
        name: 'Sarah Belhadj',
        text: 'Je suis très satisfaite de mon achat! Le meuble de chambre est encore plus beau en vrai.',
        pack: 'Pack Chambre'
      },
      {
        name: 'Ahmed Ben Salah',
        text: 'Livraison rapide et produits de qualité, je recommande vivement Touch Meuble!',
        pack: 'Pack Salon'
      }
    ];
  }

  // Add pack to cart
  // addToCart(pack: any): void {
  //   this.cartService.addToCart(pack);
  //   alert(`${pack.name} a été ajouté au panier.`);
  // }

  // Navigate to pack details
  viewPackDetails(packId: string): void {
    this.router.navigate([`/packs/${packId}`]);
  }

}
