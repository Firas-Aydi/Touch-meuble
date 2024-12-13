import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chambre-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chambre-management.component.html',
  styleUrl: './chambre-management.component.css',
})
export class ChambreManagementComponent implements OnInit {
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any> | null =
    null;
    
  chambreForm: FormGroup;
  chambres: Chambre[] = [];
  images: string[] = [];
  details: string[] = [];
  isEdit: boolean = false;
  chambreToDeleteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private firestore: AngularFirestore,
    private chambreservice: ChambreService 
  ) {
    this.chambreForm = this.fb.group({
      chambreId: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      // description: ['', Validators.required],
      stock: ['', Validators.required],
      dimensions: ['', Validators.required],
      material: ['', Validators.required],
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
  openConfirmationModal(chambreId: string) {
    this.chambreToDeleteId = chambreId; // Stocke l'ID du pack à supprimer
    this.modalService.open(this.confirmationModal); // Ouvre le modal
  }

  confirmDelete() {
    if (this.chambreToDeleteId) {
      this.deleteChambre(this.chambreToDeleteId);
      this.chambreToDeleteId = null;
    }
  }

  editChambre(chambre: Chambre) {
    this.isEdit = true;
    this.chambreForm.patchValue(chambre);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    const chambreId = this.chambreForm.value.chambreId || this.generateUniqueId(); // Utiliser un ID unique

    const imagesArray: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Téléchargement de l'image dans Firebase Storage
      this.chambreservice.uploadImage(file, chambreId).subscribe((imageUrl: string) => {
        console.log('Image téléchargée : ', imageUrl); // Log de l'URL
        imagesArray.push(imageUrl); // Ajoute l'URL de l'image après le téléchargement

        // Log de l'état du tableau images
        console.log('Array d\'images après ajout : ', imagesArray);

        // Met à jour le formulaire avec les URLs
        this.chambreForm.patchValue({ images: imagesArray });
        this.chambreForm.get('images')?.updateValueAndValidity(); // Met à jour la validation du champ
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
}
