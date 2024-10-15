import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PackService } from '../services/pack.service';
import { Pack } from '../models/pack.model';
import { CommonModule } from '@angular/common';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { ChambreService } from '../services/chambre.service';
import { Chambre } from '../models/chambre.model';
import { SalleAMangeService } from '../services/salle-amange.service';
import { SalleAManger } from '../models/salleAManger.model';
import { SalonService } from '../services/salon.service';
import { Salon } from '../models/salon.model';
import { catchError, forkJoin, of, take, tap } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Importer FormsModule ici

@Component({
  selector: 'app-pack-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule, FormsModule],
  templateUrl: './pack-management.component.html',
  styleUrls: ['./pack-management.component.css'],
})
export class PackManagementComponent implements OnInit {
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any> | null =
    null;

  packForm: FormGroup;
  packs: Pack[] = [];
  isEdit: boolean = false;
  packToDeleteId: string | null = null;
  images: string[] = [];
  // categories: any[] = [];
  chambres: Chambre[] = [];
  salles: SalleAManger[] = [];
  salons: Salon[] = [];
  selectedChambre: string | null = null;
  selectedSalle: string | null = null;
  selectedSalon: string | null = null;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private packService: PackService,
    // private categoryService: CategoryService,
    private chambreservice: ChambreService,
    private salleAMangeService: SalleAMangeService,
    private salonService: SalonService
  ) {
    this.packForm = this.fb.group({
      packId: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      images: [[], Validators.required],
      items: [[]],
      colors: [[], Validators.required],
      selectedChambre: [''],
      selectedSalle: [''], // Pour la salle à manger
      selectedSalon: [''], // Pour le salon
    });
  }

  ngOnInit(): void {
    this.loadPacks();
    // this.loadCategories();
    this.loadChambre();
    this.loadSalle();
    this.loadSalon();
    // this.loadAllCategories();
  }
  //   loadAllCategories() {
  //     console.log('Début du chargement des catégories');

  //     this.chambreservice.getChambre().pipe(
  //         tap(data => console.log('Chambres:', data)),
  //         catchError(error => {
  //             console.error('Erreur lors du chargement des chambres', error);
  //             return of([]); // Renvoie un tableau vide en cas d'erreur
  //         })
  //     ).subscribe(chambres => {
  //         this.chambres = chambres;

  //         this.salleAMangeService.getSalle().pipe(
  //             tap(data => console.log('Salles:', data)),
  //             catchError(error => {
  //                 console.error('Erreur lors du chargement des salles', error);
  //                 return of([]);
  //             })
  //         ).subscribe(salles => {
  //             this.salles = salles;

  //             this.salonService.getSalons().pipe(
  //                 tap(data => console.log('Salons:', data)),
  //                 catchError(error => {
  //                     console.error('Erreur lors du chargement des salons', error);
  //                     return of([]);
  //                 })
  //             ).subscribe(salons => {
  //                 this.salons = salons;

  //                 // Fusionner les données dans categories
  //                 this.categories = [...this.chambres, ...this.salles, ...this.salons];
  //                 console.log('Toutes les catégories:', this.categories);
  //             });
  //         });
  //     });
  // }

  // loadCategories() {
  //   this.categoryService.getAllCategories().subscribe((data) => {
  //     this.categories = data;
  //   });
  // }
  loadChambre() {
    this.chambreservice.getChambre().subscribe((data) => {
      this.chambres = data;
      // console.log(this.chambres);
    });
  }
  loadSalle() {
    this.salleAMangeService.getSalle().subscribe((data) => {
      this.salles = data;
      // console.log(this.salles);
    });
  }
  loadSalon() {
    this.salonService.getSalons().subscribe((data) => {
      this.salons = data;
      // console.log(this.salons);
    });
  }
  // loadChambre() {
  //   console.log('Chargement des chambres...');
  //   this.chambreservice.getChambre().subscribe(
  //     (data) => {
  //       console.log('Chambres reçues: ', data);
  //       this.categories = data;
  //     },
  //     (error) => {
  //       console.error('Erreur lors du chargement des chambres: ', error);
  //     }
  //   );
  // }

  // getCategoryById(categoryId: string): Category | undefined {
  //   return this.categories.find(
  //     (category) => category.categoryId === categoryId
  //   );
  // }
  // getSelectedCategoryNames(): string[] {
  //   const selectedCategoryIds = this.packForm.get('items')?.value || [];
  //   return selectedCategoryIds.map(
  //     (categoryId: string) =>
  //       this.categories.find((c) => c.categoryId === categoryId)?.name ||
  //       'Unknown category'
  //   );
  // }
  // onCategorySelect(event: any, category: Category) {
  //   const selectedCategories = this.packForm.get('items')?.value || [];

  //   if (event.target.checked) {
  //     // Add product to the selection
  //     selectedCategories.push(category.categoryId);
  //   } else {
  //     // Remove product from the selection
  //     const index = selectedCategories.indexOf(category.categoryId);
  //     if (index > -1) {
  //       selectedCategories.splice(index, 1);
  //     }
  //   }

  //   // Update the form value
  //   this.packForm.patchValue({ items: selectedCategories });
  // }

  // getChambreById(chambreId: string): Chambre | undefined {
  //   return this.chambres.find((chambre) => chambre.chambreId === chambreId);
  // }

  getItemById(itemId: string): { name: string, price: number } | undefined {
    const chambre = this.chambres.find((ch) => ch.chambreId === itemId);
    if (chambre) return { name: chambre.name, price: chambre.price };
  
    const salle = this.salles.find((s) => s.salleId === itemId);
    if (salle) return { name: salle.name, price: salle.price };
  
    const salon = this.salons.find((s) => s.salonId === itemId);
    if (salon) return { name: salon.name, price: salon.price };
  
    return undefined; // If no match is found
  }

  
  getSelectedItemsNames(itemId: string): string {
    const selectedItemsId = this.packForm.get('items')?.value || [];
    // console.log('Chambre sélectionnée:', selectedItemsId);

    // return selectedItemsId.map((itemId: string) => {
      const chambre = this.chambres.find((c) => c.chambreId === itemId);
      const salle = this.salles.find((s) => s.salleId === itemId);
      const salon = this.salons.find((s) => s.salonId === itemId);

      if (chambre) return chambre.name;
      if (salle) return salle.name;
      if (salon) return salon.name;
      return 'Unknown item';
    // });
  }
  // onChambreSelect(event: any, chambre: Chambre) {
  //   const selectedChambres = this.packForm.get('items')?.value || [];

  //   if (event.target.checked) {
  //     // Add product to the selection
  //     selectedChambres.push(chambre.chambreId);
  //   } else {
  //     // Remove product from the selection
  //     const index = selectedChambres.indexOf(chambre.chambreId);
  //     if (index > -1) {
  //       selectedChambres.splice(index, 1);
  //     }
  //   }

  // Update the form value
  //   this.packForm.patchValue({ items: selectedChambres });
  // }
  onChambreSelect(): void {
    const selectedId = this.packForm.get('selectedChambre')?.value;
    // console.log('Chambre sélectionnée:', selectedId);
    // Add the selected chambre ID to the items
    if (selectedId) {
      const currentItems = this.packForm.get('items')?.value || [];
      if (!currentItems.includes(selectedId)) {
        currentItems.push(selectedId);
        this.packForm.patchValue({ items: currentItems });
      }
    }
  }
  onSalleSelect(): void {
    const selectedId = this.packForm.get('selectedSalle')?.value;
    if (selectedId) {
      const currentItems = this.packForm.get('items')?.value || [];
      if (!currentItems.includes(selectedId)) {
        currentItems.push(selectedId);
        this.packForm.patchValue({ items: currentItems });
      }
    }
  }

  onSalonSelect(): void {
    const selectedId = this.packForm.get('selectedSalon')?.value;
    if (selectedId) {
      const currentItems = this.packForm.get('items')?.value || [];
      if (!currentItems.includes(selectedId)) {
        currentItems.push(selectedId);
        this.packForm.patchValue({ items: currentItems });
      }
    }
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
  removeChambre(chambreId: string) {
    const currentItems = this.packForm.get('items')?.value || [];

    // Filter out the chambre with the provided ID
    const updatedItems = currentItems.filter(
      (item: string) => item !== chambreId
    );

    // Update the form with the new list
    this.packForm.get('items')?.setValue(updatedItems);
  }

  openConfirmationModal(packId: string) {
    this.packToDeleteId = packId; // Stocke l'ID du pack à supprimer
    this.modalService.open(this.confirmationModal); // Ouvre le modal
  }

  confirmDelete() {
    if (this.packToDeleteId) {
      this.deletePack(this.packToDeleteId);
      this.packToDeleteId = null; // Réinitialise l'ID après la suppression
    }
  }
}
