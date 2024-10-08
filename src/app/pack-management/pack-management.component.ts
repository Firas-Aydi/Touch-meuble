// pack-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackService } from '../services/pack.service';
import { Pack } from '../models/pack.model';
import { Category } from '../models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pack-management',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './pack-management.component.html',
  styleUrls: ['./pack-management.component.css']
})
export class PackManagementComponent implements OnInit {
  packForm: FormGroup;
  packs: Pack[] = [];
  
  constructor(private fb: FormBuilder, private packService: PackService) {
    this.packForm = this.fb.group({
      packId: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      items: [[]] // Initialisation avec une liste vide
    });
  }

  ngOnInit(): void {
    this.loadPacks();
  }

  loadPacks() {
    this.packService.getAllPacks().subscribe(data => {
      this.packs = data;
    });
  }

  addPack() {
    if (this.packForm.valid) {
      this.packService.addPack(this.packForm.value).then(() => {
        this.packForm.reset();
        this.loadPacks();
      });
    }
  }

  updatePack() {
    if (this.packForm.valid) {
      this.packService.updatePack(this.packForm.value.packId, this.packForm.value).then(() => {
        this.packForm.reset();
        this.loadPacks();
      });
    }
  }

  deletePack(packId: string) {
    this.packService.deletePack(packId).then(() => {
      this.loadPacks();
    });
  }

  editPack(pack: Pack) {
    this.packForm.setValue({ ...pack });
  }
}
