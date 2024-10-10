import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackService } from '../services/pack.service';
import { Pack } from '../models/pack.model';
import { CommonModule } from '@angular/common';

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
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder, private packService: PackService) {
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
      this.packService.updatePack(packId, this.packForm.value).then(() => {
        this.packForm.reset();
        this.isEdit = false;
        this.loadPacks();
      });
    }
  }

  deletePack(packId: string) {
    this.packService.deletePack(packId).then(() => {
      this.loadPacks();
    });
  }

  onFileChange(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
      const imageUrls = this.selectedFiles.map((file) => URL.createObjectURL(file));
      this.packForm.patchValue({ images: imageUrls });
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
    const input = event.target;
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
}
