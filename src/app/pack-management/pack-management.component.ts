import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PackService } from '../services/pack.service';
import { Pack } from '../models/pack.model';
import { CommonModule } from '@angular/common';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-pack-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pack-management.component.html',
  styleUrls: ['./pack-management.component.css'],
})
export class PackManagementComponent implements OnInit {
  packForm: FormGroup;
  packs: Pack[] = [];
  isEdit: boolean = false;
  categories: Category[] = [];
  images: string[] = [];

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private categoryService: CategoryService
  ) {
    this.packForm = this.fb.group({
      packId: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      images: [[], Validators.required],
      items: [[], Validators.required],
      colors: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPacks();
    this.loadCategories();
  }
  loadCategories() {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  getCategoryById(categoryId: string): Category | undefined {
    return this.categories.find(
      (category) => category.categoryId === categoryId
    );
  }
  getSelectedCategoryNames(): string[] {
    const selectedCategoryIds = this.packForm.get('items')?.value || [];
    return selectedCategoryIds.map(
      (categoryId: string) =>
        this.categories.find((c) => c.categoryId === categoryId)?.name ||
        'Unknown category'
    );
  }
  onCategorySelect(event: any, category: Category) {
    const selectedCategories = this.packForm.get('items')?.value || [];

    if (event.target.checked) {
      // Add product to the selection
      selectedCategories.push(category.categoryId);
    } else {
      // Remove product from the selection
      const index = selectedCategories.indexOf(category.categoryId);
      if (index > -1) {
        selectedCategories.splice(index, 1);
      }
    }

    // Update the form value
    this.packForm.patchValue({ items: selectedCategories });
  }

  loadPacks() {
    this.packService.getAllPacks().subscribe((data: Pack[]) => {
      this.packs = data;
    });
  }
  addPack() {
    this.packForm.markAllAsTouched();
    if (this.packForm.valid) {
      this.packService.addPack(this.packForm.value).then(() => {
        this.packForm.reset();
        this.isEdit = false;
        this.loadPacks();
      });
    }
  }

  editPack(pack: Pack) {
    this.isEdit = true;
    this.packForm.patchValue(pack);
  }

  updatePack() {
    this.packForm.markAllAsTouched();
    if (this.packForm.valid) {
      const packId = this.packForm.value.packId;
      this.packService
        .getPackById(packId)
        .pipe(take(1))
        .subscribe((pack) => {
          if (pack) {
            this.packService
              .updatePack(packId, this.packForm.value)
              .then(() => {
                console.log('Mise à jour réussie');
                this.packForm.reset();
                this.isEdit = false;
                this.loadPacks();
              })
              .catch((error) => {
                console.error(
                  'Erreur lors de la mise à jour du pack: ',
                  error.message
                );
                alert(
                  'Une erreur est survenue lors de la mise à jour du pack: ' +
                    error.message
                );
              });
          } else {
            console.error('No product found with this packId: ', packId);
            alert("Pack introuvable. Il n'existe pas.");
          }
        });
    } else {
      console.log('erreur: formulaire non valide');
    }
  }

  deletePack(packId: string) {
    if (packId) {
      this.packService
        .deletePack(packId)
        .then(() => {
          this.loadPacks();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression du pack: ', error);
          alert('Une erreur est survenue lors de la suppression du pack.');
        });
    } else {
      console.error('pack ID is undefined. Cannot delete pack.');
    }
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
        this.packForm.patchValue({ images: imagesArray });
      };

      reader.readAsDataURL(file); // Read the image file as data URL
    }
  }

  addOrUpdatePack() {
    if (this.isEdit) {
      this.updatePack();
    } else {
      this.addPack();
    }
  }

  removeImage(image: string) {
    const imagesArray = this.packForm.get('images')?.value || [];
    const index = imagesArray.indexOf(image);
    if (index > -1) {
      imagesArray.splice(index, 1);
      this.packForm.patchValue({ images: imagesArray });
    }
  }

  addColor(event: any) {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    
    const colorsArray = this.packForm.get('colors')?.value || [];
    if (!colorsArray.includes(color)) {
      colorsArray.push(color);
      this.packForm.patchValue({ colors: colorsArray });
    }
  }

  removeColor(color: string) {
    const colorsArray = this.packForm.get('colors')?.value;
    const index = colorsArray.indexOf(color);
    if (index > -1) {
      colorsArray.splice(index, 1);
      this.packForm.patchValue({ colors: colorsArray });
    }
  }
  removeCategory(categoryName: string) {
    const currentItems = this.packForm.get('items')?.value || [];
    
    // Find the index of the category to remove based on the name
    const updatedItems = currentItems.filter((item: string) => this.getCategoryById(item)?.name !== categoryName);
  
    // Update the form with the new list
    this.packForm.get('items')?.setValue(updatedItems);
  }
  
}
