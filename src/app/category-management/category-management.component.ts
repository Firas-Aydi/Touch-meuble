// category-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[] = [];
  
  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = this.fb.group({
      categoryId: [''],
      name: ['', Validators.required],
      items: [[]] // Initialisation avec une liste vide
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
  }

  addCategory() {
    if (this.categoryForm.valid) {
      this.categoryService.addCategory(this.categoryForm.value).then(() => {
        this.categoryForm.reset();
        this.loadCategories();
      });
    }
  }

  updateCategory() {
    if (this.categoryForm.valid) {
      this.categoryService.updateCategory(this.categoryForm.value.categoryId, this.categoryForm.value).then(() => {
        this.categoryForm.reset();
        this.loadCategories();
      });
    }
  }

  deleteCategory(categoryId: string) {
    this.categoryService.deleteCategory(categoryId).then(() => {
      this.loadCategories();
    });
  }

  editCategory(category: Category) {
    this.categoryForm.setValue({ ...category });
  }
}
