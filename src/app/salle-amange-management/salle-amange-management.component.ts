import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { SalleAMangeService } from '../services/salle-amange.service';
import { SalleAManger } from '../models/salleAManger.model';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { ProductService } from '../services/product.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-salle-amange-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salle-amange-management.component.html',
  styleUrl: './salle-amange-management.component.css'
})
export class SalleAMangeManagementComponent implements OnInit{
  salleForm: FormGroup;
  salles: SalleAManger[] = [];
  images: string[] = [];
  isEdit: boolean = false;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private salleAMangeService: SalleAMangeService,
    private productService: ProductService
  ) {
    this.salleForm = this.fb.group({
      salleId: [''],
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
    this.loadSalle();
    this.loadProducts(); // Fetch available products
  }
  loadSalle() {
    this.salleAMangeService.getSalle().subscribe((data) => {
      this.salles = data;
    });
  }
  loadProducts() {
    // Assuming you have a ProductService to fetch products
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data; // Assign available products
      // console.log('Products: ', this.products);
    });
  }
  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product.productId === productId);
  }
  getSelectedProductNames(): string[] {
    const selectedProductIds = this.salleForm.get('items')?.value || [];
    return selectedProductIds.map(
      (productId: string) =>
        this.products.find((p) => p.productId === productId)?.name ||
        'Unknown Product'
    );
  }
  onProductSelect(event: any, product: Product) {
    const selectedProducts = this.salleForm.get('items')?.value || [];

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
    this.salleForm.patchValue({ items: selectedProducts });
  }

  addSalle() {
    this.salleForm.markAllAsTouched();
    if (this.salleForm.valid) {
      this.salleAMangeService.addSalle(this.salleForm.value).then(() => {
        this.salleForm.reset();
        this.isEdit = false;
        this.loadSalle();
      });
    }
  }

  updateSalle() {
    this.salleForm.markAllAsTouched();

    if (this.salleForm.valid) {
      const salleId = this.salleForm.value.salleId;
      this.salleAMangeService
        .getSalleById(salleId)
        .pipe(take(1))
        .subscribe((salle) => {
          if (salle) {
            this.salleAMangeService
              .updateSalle(salleId, this.salleForm.value)
              .then(() => {
                console.log('Mise à jour réussie');
                this.salleForm.reset();
                this.isEdit = false;
                this.loadSalle();
              })
              .catch((error) => {
                console.error(
                  'Erreur lors de la mise à jour du salle: ',
                  error.message
                );
                alert(
                  'Une erreur est survenue lors de la mise à jour du salle: ' +
                    error.message
                );
              });
          } else {
            console.error('No product found with this salleId: ', salleId);
            alert("salle introuvable. Il n'existe pas.");
          }
        });
    } else {
      console.log('erreur: formulaire non valide');
    }
  }

  deleteSalle(salleId: string) {
    if (salleId) {
      this.salleAMangeService
        .deleteSalle(salleId)
        .then(() => {
          this.loadSalle();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression du salle: ', error);
          alert('Une erreur est survenue lors de la suppression du salle.');
        });
    } else {
      console.error('salle ID is undefined. Cannot delete salle.');
    }
  }

  editSalle(salle: SalleAManger) {
    this.isEdit = true;
    this.salleForm.patchValue(salle);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    const salleId = this.salleForm.value.salleId || this.generateUniqueId();  // Utiliser un ID unique
  
    const imagesArray: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      // Téléchargement de l'image dans Firebase Storage
      this.salleAMangeService.uploadImage(file, salleId).subscribe((imageUrl: string) => {
        imagesArray.push(imageUrl); // Ajoute l'URL de l'image après le téléchargement
        this.salleForm.patchValue({ images: imagesArray });  // Met à jour le formulaire avec les URLs
      });
    }
  }
  // Méthode pour générer un ID unique pour les chambres
generateUniqueId(): string {
  return this.firestore.createId();
}

  addOrUpdateProduct() {
    if (this.isEdit) {
      this.updateSalle();
    } else {
      this.addSalle();
    }
  }

  addColor(event: Event) {
    const input = event.target as HTMLInputElement; // Cast du type
    const color = input.value; // Récupération de la couleur

    const colorsArray = this.salleForm.get('colors')?.value || []; // Vérification pour éviter le null
    if (!colorsArray.includes(color)) {
      colorsArray.push(color);
      this.salleForm.patchValue({ colors: colorsArray });
    }
  }

  removeColor(color: string) {
    const colorsArray = this.salleForm.get('colors')?.value;
    const index = colorsArray.indexOf(color);
    if (index > -1) {
      colorsArray.splice(index, 1);
      this.salleForm.patchValue({ colors: colorsArray });
    }
  }
  removeImage(image: string) {
    const imagesArray = this.salleForm.get('images')?.value || [];
    const index = imagesArray.indexOf(image);
    if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'image du tableau
      this.salleForm.patchValue({ images: imagesArray }); // Met à jour le FormGroup
    }
  }
  removeProduct(categoryName: string) {
    const currentItems = this.salleForm.get('items')?.value || [];
    
    // Find the index of the category to remove based on the name
    const updatedItems = currentItems.filter((item: string) => this.getProductById(item)?.name !== categoryName);
  
    // Update the form with the new list
    this.salleForm.get('items')?.setValue(updatedItems);
  }
}

