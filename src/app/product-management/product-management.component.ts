import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
  images: string[] = [];
  isEdit: boolean = false;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      productId: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
      dimensions: ['', Validators.required],
      material: ['', Validators.required],
      images: [[], Validators.required], // Images array
      colors: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
    });
  }

  // Method to handle file changes
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    const imagesArray: string[] = [];

    // Loop through selected files and read them as DataURLs
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        imagesArray.push(e.target?.result as string); // Convert image to base64
        this.productForm.patchValue({ images: imagesArray });
      };

      reader.readAsDataURL(file); // Read the image file as data URL
    }
  }

  addOrUpdateProduct() {
    if (this.isEdit) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }
  addColor(event: Event) {
    const input = event.target as HTMLInputElement; // Cast du type
    const color = input.value; // Récupération de la couleur

    const colorsArray = this.productForm.get('colors')?.value || []; // Vérification pour éviter le null
    if (!colorsArray.includes(color)) {
        colorsArray.push(color);
        this.productForm.patchValue({ colors: colorsArray });
    }
}

removeImage(image: string) {
  const imagesArray = this.productForm.get('images')?.value || [];
  const index = imagesArray.indexOf(image);
  if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'image du tableau
      this.productForm.patchValue({ images: imagesArray }); // Met à jour le FormGroup
  }
}

  removeColor(color: string) {
    const colorsArray = this.productForm.get('colors')?.value;
    const index = colorsArray.indexOf(color);
    if (index > -1) {
      colorsArray.splice(index, 1);
      this.productForm.patchValue({ colors: colorsArray });
    }
  }

  // Add product logic
  addProduct() {
    this.productForm.markAllAsTouched(); // Marque tous les champs comme touchés

    if (this.productForm.valid) {
      const newProduct: Product = {
        ...this.productForm.value,
      };
      this.productService
        .addProduct(newProduct)
        .then(() => {
          console.log('addProduct ', newProduct);
          this.productForm.reset();
          this.isEdit = false;
          this.loadProducts();
        })
        .catch((error) => {
          console.error('Error adding product: ', error);
        });
    }
  }

  // Edit product logic
  editProduct(product: Product) {
    this.isEdit = true;
    this.productForm.patchValue(product);
  }

  // Update product logic
  updateProduct() {
    this.productForm.markAllAsTouched();
    if (this.productForm.valid) {
      const productId = this.productForm.value.productId;

      // Log the form value to see what is being sent to Firestore
      console.log('Form value for update: ', this.productForm.value);

      this.productService
        .getProductById(productId)
        .pipe(take(1))
        .subscribe((product) => {
          if (product) {
            this.productService
              .updateProduct(productId, this.productForm.value)
              .then(() => {
                console.log('Mise à jour réussie');
                this.productForm.reset();
                this.isEdit = false;
                this.loadProducts();
              })
              .catch((error) => {
                console.error(
                  'Erreur lors de la mise à jour du produit: ',
                  error.message
                );
                alert(
                  'Une erreur est survenue lors de la mise à jour du produit: ' +
                    error.message
                );
              });
          } else {
            console.error('No product found with this productId: ', productId);
            alert("Produit introuvable. Il n'existe pas.");
          }
        });
    } else {
      console.log('erreur: formulaire non valide');
    }
  }

  // Delete product logic
  deleteProduct(productId: string) {
    if (productId) {
      this.productService
        .deleteProduct(productId)
        .then(() => {
          this.loadProducts();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression du produit: ', error);
          alert('Une erreur est survenue lors de la suppression du produit.');
        });
    } else {
      console.error('Product ID is undefined. Cannot delete product.');
    }
  }
}
