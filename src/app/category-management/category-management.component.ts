// category-management.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
})
export class CategoryManagementComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[] = [];
  images: string[] = [];
  isEdit: boolean = false;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.categoryForm = this.fb.group({
      categoryId: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      items: [[], Validators.required], // List of selected products
      colors: [[], Validators.required],
      images: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts(); // Fetch available products
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  loadProducts() {
    // Assuming you have a ProductService to fetch products
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data; // Assign available products
      console.log('tProducts: ', this.products);
    });
  }
  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product.productId === productId);
  }

  getSelectedProductNames(): string[] {
    const selectedProductIds = this.categoryForm.get('items')?.value || [];
    return selectedProductIds.map(
      (productId: string) =>
        this.products.find((p) => p.productId === productId)?.name ||
        'Unknown Product'
    );
  }

  onProductSelect(event: any, product: Product) {
    const selectedProducts = this.categoryForm.get('items')?.value || [];

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
    this.categoryForm.patchValue({ items: selectedProducts });
  }

  addCategory() {
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.valid) {
      this.categoryService.addCategory(this.categoryForm.value).then(() => {
        this.categoryForm.reset();
        this.isEdit = false;
        this.loadCategories();
      });
    }
  }

  updateCategory() {
    this.categoryForm.markAllAsTouched();

    if (this.categoryForm.valid) {
      const categoryId = this.categoryForm.value.categoryId;
      this.categoryService
        .getCategoryById(categoryId)
        .pipe(take(1))
        .subscribe((category) => {
          if (category) {
            this.categoryService
              .updateCategory(categoryId, this.categoryForm.value)
              .then(() => {
                console.log('Mise à jour réussie');
                this.categoryForm.reset();
                this.isEdit = false;
                this.loadCategories();
              })
              .catch((error) => {
                console.error(
                  'Erreur lors de la mise à jour du category: ',
                  error.message
                );
                alert(
                  'Une erreur est survenue lors de la mise à jour du category: ' +
                    error.message
                );
              });
          } else {
            console.error('No product found with this categoryId: ', categoryId);
            alert("category introuvable. Il n'existe pas.");
          }
        });
    } else {
      console.log('erreur: formulaire non valide');
    }
  }

  deleteCategory(categoryId: string) {
    if (categoryId) {
      this.categoryService
        .deleteCategory(categoryId)
        .then(() => {
          this.loadCategories();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression du category: ', error);
          alert('Une erreur est survenue lors de la suppression du category.');
        });
    } else {
      console.error('category ID is undefined. Cannot delete category.');
    }
  }

  editCategory(category: Category) {
    this.isEdit = true;
    this.categoryForm.patchValue(category);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    const imagesArray: string[] = [];

    // Loop through selected files and read them as DataURLs
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        imagesArray.push(e.target?.result as string); // Convert image to base64
        this.categoryForm.patchValue({ images: imagesArray });
      };

      reader.readAsDataURL(file); // Read the image file as data URL
    }
  }
  addOrUpdateProduct() {
    if (this.isEdit) {
      this.updateCategory();
    } else {
      this.addCategory();
    }
  }
  addColor(event: Event) {
    const input = event.target as HTMLInputElement; // Cast du type
    const color = input.value; // Récupération de la couleur

    const colorsArray = this.categoryForm.get('colors')?.value || []; // Vérification pour éviter le null
    if (!colorsArray.includes(color)) {
      colorsArray.push(color);
      this.categoryForm.patchValue({ colors: colorsArray });
    }
  }

  removeColor(color: string) {
    const colorsArray = this.categoryForm.get('colors')?.value;
    const index = colorsArray.indexOf(color);
    if (index > -1) {
      colorsArray.splice(index, 1);
      this.categoryForm.patchValue({ colors: colorsArray });
    }
  }
  removeImage(image: string) {
    const imagesArray = this.categoryForm.get('images')?.value || [];
    const index = imagesArray.indexOf(image);
    if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'image du tableau
      this.categoryForm.patchValue({ images: imagesArray }); // Met à jour le FormGroup
    }
  }
  removeProduct(categoryName: string) {
    const currentItems = this.categoryForm.get('items')?.value || [];
    
    // Find the index of the category to remove based on the name
    const updatedItems = currentItems.filter((item: string) => this.getProductById(item)?.name !== categoryName);
  
    // Update the form with the new list
    this.categoryForm.get('items')?.setValue(updatedItems);
  }
}
