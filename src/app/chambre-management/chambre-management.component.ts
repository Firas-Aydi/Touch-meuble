import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { ChambreService } from '../services/chambre.service';
import { Chambre } from '../models/chambre.model';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-chambre-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chambre-management.component.html',
  styleUrl: './chambre-management.component.css',
})
export class ChambreManagementComponent implements OnInit {
  chambreForm: FormGroup;
  chambres: Chambre[] = [];
  images: string[] = [];
  details: string[] = [];
  isEdit: boolean = false;
  // products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private chambreservice: ChambreService
  ) // private productService: ProductService
  {
    this.chambreForm = this.fb.group({
      chambreId: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      // dimensions: ['', Validators.required],
      // material: ['', Validators.required],
      colors: [[], Validators.required],
      images: [[], Validators.required],
      details: [[]],
      type: [[], Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadChambre();
    // this.loadProducts();
  }
  loadChambre() {
    this.chambreservice.getChambre().subscribe((data) => {
      this.chambres = data;
    });
  }
  // loadProducts() {
  //   // Assuming you have a ProductService to fetch products
  //   this.productService.getAllProducts().subscribe((data: Product[]) => {
  //     this.products = data; // Assign available products
  //     console.log('Products: ', this.products);
  //   });
  // }
  // getProductById(productId: string): Product | undefined {
  //   return this.products.find((product) => product.productId === productId);
  // }
  // getSelectedProductNames(): string[] {
  //   const selectedProductIds = this.chambreForm.get('items')?.value || [];
  //   return selectedProductIds.map(
  //     (productId: string) =>
  //       this.products.find((p) => p.productId === productId)?.name ||
  //       'Unknown Product'
  //   );
  // }
  onProductSelect(event: any, product: Product) {
    const selectedProducts = this.chambreForm.get('items')?.value || [];

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
    this.chambreForm.patchValue({ items: selectedProducts });
  }

  addChambre() {
    this.chambreForm.markAllAsTouched();
    if (this.chambreForm.valid) {
      this.chambreservice.addChambre(this.chambreForm.value).then(() => {
        this.chambreForm.reset();
        this.isEdit = false;
        this.loadChambre();
      });
    }
  }

  updateChambre() {
    this.chambreForm.markAllAsTouched();

    if (this.chambreForm.valid) {
      const chambreId = this.chambreForm.value.chambreId;
      this.chambreservice
        .getChambreById(chambreId)
        .pipe(take(1))
        .subscribe((chambre) => {
          if (chambre) {
            this.chambreservice
              .updateChambre(chambreId, this.chambreForm.value)
              .then(() => {
                console.log('Mise à jour réussie');
                this.chambreForm.reset();
                this.isEdit = false;
                this.loadChambre();
              })
              .catch((error) => {
                console.error(
                  'Erreur lors de la mise à jour du chambre: ',
                  error.message
                );
                alert(
                  'Une erreur est survenue lors de la mise à jour du chambre: ' +
                    error.message
                );
              });
          } else {
            console.error('No product found with this chambreId: ', chambreId);
            alert("chambre introuvable. Il n'existe pas.");
          }
        });
    } else {
      console.log('erreur: formulaire non valide');
    }
  }

  deleteChambre(chambreId: string) {
    if (chambreId) {
      this.chambreservice
        .deleteChambre(chambreId)
        .then(() => {
          this.loadChambre();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression du chambre: ', error);
          alert('Une erreur est survenue lors de la suppression du chambre.');
        });
    } else {
      console.error('chambre ID is undefined. Cannot delete chambre.');
    }
  }

  editChambre(chambre: Chambre) {
    this.isEdit = true;
    this.chambreForm.patchValue(chambre);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    const chambreId =
      this.chambreForm.value.chambreId || this.generateUniqueId(); // Utiliser un ID unique

    const imagesArray: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Téléchargement de l'image dans Firebase Storage
      this.chambreservice
        .uploadImage(file, chambreId)
        .subscribe((imageUrl: string) => {
          imagesArray.push(imageUrl); // Ajoute l'URL de l'image après le téléchargement
          this.chambreForm.patchValue({ images: imagesArray }); // Met à jour le formulaire avec les URLs
        });
    }
  }

  onFileDetailsChange(event: any) {
    const files: FileList = event.target.files;
    const chambreId =
      this.chambreForm.value.chambreId || this.generateUniqueId();

    const detailsArray: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      this.chambreservice
        .uploadImage(file, chambreId)
        .subscribe((imageUrl: string) => {
          detailsArray.push(imageUrl);
          this.chambreForm.patchValue({ details: detailsArray });
        });
    }
  }

  // Méthode pour générer un ID unique pour les chambres
  generateUniqueId(): string {
    return this.firestore.createId();
  }

  addOrUpdateProduct() {
    if (this.isEdit) {
      this.updateChambre();
    } else {
      this.addChambre();
    }
  }

  addColor(event: Event) {
    const input = event.target as HTMLInputElement; // Cast du type
    const color = input.value; // Récupération de la couleur

    const colorsArray = this.chambreForm.get('colors')?.value || []; // Vérification pour éviter le null
    if (!colorsArray.includes(color)) {
      colorsArray.push(color);
      this.chambreForm.patchValue({ colors: colorsArray });
    }
  }

  removeColor(color: string) {
    const colorsArray = this.chambreForm.get('colors')?.value;
    const index = colorsArray.indexOf(color);
    if (index > -1) {
      colorsArray.splice(index, 1);
      this.chambreForm.patchValue({ colors: colorsArray });
    }
  }
  removeImage(image: string) {
    const imagesArray = this.chambreForm.get('images')?.value || [];
    const index = imagesArray.indexOf(image);
    if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'image du tableau
      this.chambreForm.patchValue({ images: imagesArray }); // Met à jour le FormGroup
    }
  }
  removeDetails(image: string) {
    const imagesArray = this.chambreForm.get('details')?.value || [];
    const index = imagesArray.indexOf(image);
    if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'image du tableau
      this.chambreForm.patchValue({ details: imagesArray }); // Met à jour le FormGroup
    }
  }
  // removeProduct(categoryName: string) {
  //   const currentItems = this.chambreForm.get('items')?.value || [];

  //   // Find the index of the category to remove based on the name
  //   const updatedItems = currentItems.filter(
  //     (item: string) => this.getProductById(item)?.name !== categoryName
  //   );

  //   // Update the form with the new list
  //   this.chambreForm.get('items')?.setValue(updatedItems);
  // }
}
