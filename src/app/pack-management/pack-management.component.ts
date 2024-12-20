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
// import { CategoryService } from '../services/category.service';
import { ChambreService } from '../services/chambre.service';
import { Chambre } from '../models/chambre.model';
import { SalleAMangeService } from '../services/salle-amange.service';
import { SalleAManger } from '../models/salleAManger.model';
import { SalonService } from '../services/salon.service';
import { Salon } from '../models/salon.model';
import { catchError, forkJoin, of, take, tap } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Importer FormsModule ici
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
  details: string[] = [];

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
    private firestore: AngularFirestore,
    private chambreservice: ChambreService,
    private salleAMangeService: SalleAMangeService,
    private salonService: SalonService
  ) {
    this.packForm = this.fb.group({
      packId: [''],
      name: ['', Validators.required],
      // description: ['', Validators.required],
      price: ['', Validators.required],
      images: [[], Validators.required],
      details: [[]],
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

  getItemById(itemId: string): { name: string; price: number } | undefined {
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
    const packId = this.packForm.value.packId || this.generateUniqueId(); // Utiliser un ID unique

    const imagesArray: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Téléchargement de l'image dans Firebase Storage
      this.packService
        .uploadImage(file, packId)
        .subscribe((imageUrl: string) => {
          imagesArray.push(imageUrl); // Ajoute l'URL de l'image après le téléchargement
          this.packForm.patchValue({ images: imagesArray }); // Met à jour le formulaire avec les URLs
        });
    }
  }
  onFileDetailsChange(event: any) {
    const files: FileList = event.target.files;
    const packId = this.packForm.value.packId || this.generateUniqueId();
    
    const detailsArray: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      this.packService
      .uploadImage(file, packId)
      .subscribe((imageUrl: string) => {
        detailsArray.push(imageUrl);
        // console.log('detailsArray: ',detailsArray)
          this.packForm.patchValue({ details: detailsArray });
        });
    }
  }
  removeDetails(image: string) {
    const imagesArray = this.packForm.get('details')?.value || [];
    const index = imagesArray.indexOf(image);
    if (index > -1) {
      imagesArray.splice(index, 1); // Supprime l'image du tableau
      this.packForm.patchValue({ details: imagesArray }); // Met à jour le FormGroup
    }
  }
  // Méthode pour générer un ID unique pour les chambres
  generateUniqueId(): string {
    return this.firestore.createId();
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
  removeChambre(packId: string) {
    const currentItems = this.packForm.get('items')?.value || [];

    // Filter out the chambre with the provided ID
    const updatedItems = currentItems.filter((item: string) => item !== packId);

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
      this.packToDeleteId = null;
    }
  }
}
