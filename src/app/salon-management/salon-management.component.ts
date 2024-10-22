import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { SalonService } from '../services/salon.service';
import { Salon } from '../models/salon.model';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { ProductService } from '../services/product.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-salon',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salon-management.component.html',
  styleUrl: './salon-management.component.css',
})
export class SalonManagementComponent implements OnInit {
  salonForm: FormGroup;
  salons: Salon[] = [];
  images: string[] = [];
  isEdit: boolean = false;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private salonService: SalonService,
    private productService: ProductService
  ) {
    this.salonForm = this.fb.group({
      salonId: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      dimensions: ['', Validators.required],
      material: ['', Validators.required],
      items: [[]], // List of selected products
      colors: [[], Validators.required],
      images: [[], Validators.required],
      type: [[], Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadSalon();
    this.loadProducts(); // Fetch available products
  }
  loadSalon() {
    this.salonService.getSalons().subscribe((data) => {
      this.salons = data;
    });
  }
  loadProducts() {
    // Assuming you have a ProductService to fetch products
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data; // Assign available products
      console.log('Products: ', this.products);
    });
  }
  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product.productId === productId);
  }
  getSelectedProductNames(): string[] {
    const selectedProductIds = this.salonForm.get('items')?.value || [];
    return selectedProductIds.map(
      (productId: string) =>
        this.products.find((p) => p.productId === productId)?.name ||
        'Unknown Product'
    );
  }
  onProductSelect(event: any, product: Product) {
    const selectedProducts = this.salonForm.get('items')?.value || [];

    if (event.target.checked) {
      // Add product to the selection
      selectedProducts.push(product.productId);
    } else {
      // Remove product from the selection
      const index = selectedProducts.indexOf(product.productId);
      if (index > -1) {
        selectedProducts.splice(index, 1);
      }
    }

    // Update the form value
    this.salonForm.patchValue({ items: selectedProducts });
  }
  addSalon() {
    this.salonForm.markAllAsTouched();
    if (this.salonForm.valid) {
      this.salonService.addSalon(this.salonForm.value).then(() => {
        this.salonForm.reset();
        this.isEdit = false;
        this.loadSalon();
      });
    }
  }

  updateSalon() {
    this.salonForm.markAllAsTouched();

    if (this.salonForm.valid) {
      const salonId = this.salonForm.value.salonId;
      this.salonService
        .getSalonById(salonId)
        .pipe(take(1))
        .subscribe((salon) => {
          if (salon) {
            this.salonService
              .updateSalon(salonId, this.salonForm.value)
              .then(() => {
                console.log('Mise à jour réussie');
                this.salonForm.reset();
                this.isEdit = false;
                this.loadSalon();
              })
              .catch((error) => {
                console.error(
                  'Erreur lors de la mise à jour du salon: ',
                  error.message
                );
                alert(
                  'Une erreur est survenue lors de la mise à jour du salon: ' +
                    error.message
                );
              });
          } else {
            console.error('No product found with this salonId: ', salonId);
            alert("salon introuvable. Il n'existe pas.");
          }
        });
    } else {
      console.log('erreur: formulaire non valide');
    }
  }

  deleteSalon(salonId: string) {
    if (salonId) {
      this.salonService
        .deleteSalon(salonId)
        .then(() => {
          this.loadSalon();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression du salon: ', error);
          alert('Une erreur est survenue lors de la suppression du salon.');
        });
    } else {
      console.error('salon ID is undefined. Cannot delete salon.');
    }
  }

  editSalon(salon: Salon) {
    this.isEdit = true;
    this.salonForm.patchValue(salon);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    const salonId = this.salonForm.value.salonId || this.generateUniqueId(); // Utiliser un ID unique
    const imagesArray: string[] = [];

    // Loop through selected files and read them as DataURLs
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Téléchargement de l'image dans Firebase Storage
      this.salonService
        .uploadImage(file, salonId)
        .subscribe((imageUrl: string) => {
          imagesArray.push(imageUrl); // Ajoute l'URL de l'image après le téléchargement
          this.salonForm.patchValue({ images: imagesArray }); // Met à jour le formulaire avec les URLs
        });
    }
  }

  // Méthode pour générer un ID unique pour les chambres
  generateUniqueId(): string {
    return this.firestore.createId();
  }
  addOrUpdateProduct() {
    if (this.isEdit) {
      this.updateSalon();
    } else {
      this.addSalon();
    }
  }

  addColor(event: Event) {
    const input = event.target as HTMLInputElement; // Cast du type
    const color = input.value; // Récupération de la couleur

    const colorsArray = this.salonForm.get('colors')?.value || []; // Vérification pour éviter le null
    if (!colorsArray.includes(color)) {
      colorsArray.push(color);
      this.salonForm.patchValue({ colors: colorsArray });
    }
  }

  removeColor(color: string) {
    const colorsArray = this.salonForm.get('colors')?.value;
    const index = colorsArray.indexOf(color);
    if (index > -1) {
      colorsArray.splice(index, 1);
      this.salonForm.patchValue({ colors: colorsArray });
    }
  }
  removeImage(image: string) {
    const imagesArray = this.salonForm.get('images')?.value || [];
    const index = imagesArray.indexOf(image);
    if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'image du tableau
      this.salonForm.patchValue({ images: imagesArray }); // Met à jour le FormGroup
    }
  }
  removeProduct(categoryName: string) {
    const currentItems = this.salonForm.get('items')?.value || [];

    // Find the index of the category to remove based on the name
    const updatedItems = currentItems.filter(
      (item: string) => this.getProductById(item)?.name !== categoryName
    );

    // Update the form with the new list
    this.salonForm.get('items')?.setValue(updatedItems);
  }
}
