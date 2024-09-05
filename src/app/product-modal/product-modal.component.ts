import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductData } from '../product-data';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css'],
})
export class ProductModalComponent implements OnInit {
  showModal = false;
  productName = '';
  selectedCategory = '';
  newCategory = '';
  quantity = 0;
  unitPrice = 0;
  description = '';
  createDate: string | null = null;

  categories: string[] = [];

  showAddCategoryInput = false;
  @Input() product: ProductData | null = null;
  @Output() productAdded = new EventEmitter<ProductData>();

  modalTitle: string = 'Add New Product';
  showAlert = false;
  alertMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.categories = this.productService.getCategories();
  }

  openModal() {
    this.showModal = true;
    this.resetForm();
    this.modalTitle = 'Add New Product';
  }

  openModalWithProduct(product: ProductData) {
    this.product = product;
    this.productName = product.name;
    this.selectedCategory = product.category;
    this.quantity = product.quantity;
    this.unitPrice = product.unitPrice;
    this.description = product.description;
    this.createDate = product.createDate;
    this.showModal = true;
    this.modalTitle = 'Edit Product';
  }

  closeModal() {
    this.resetForm();
    this.showModal = false;
  }

  onCategoryChange(event: any) {
    if (event.target.value === 'add-new') {
      this.showAddCategoryInput = true;
      this.selectedCategory = '';
    } else {
      this.selectedCategory = event.target.value;
      this.showAddCategoryInput = false;
    }
  }

  addCategory() {
    if (this.newCategory.trim()) {
      this.productService.saveCategory(this.newCategory.trim());
      this.categories = this.productService.getCategories();
      this.selectedCategory = this.newCategory.trim();
      this.newCategory = '';
      this.showAddCategoryInput = false;
    }
  }

  onSubmit() {
    if (this.showAddCategoryInput && this.newCategory.trim()) {
      this.addCategory();
    }

    if (!this.productName.trim()) {
      this.alertMessage = 'Product name is required.';
      this.showAlert = true;
      this.autoHideAlert();
      return;
    }

    if (this.quantity < 0) {
      this.alertMessage = 'Quantity cannot be negative.';
      this.showAlert = true;
      this.autoHideAlert();
      return;
    }

    if (this.unitPrice < 0) {
      this.alertMessage = 'Unit price cannot be negative.';
      this.showAlert = true;
      this.autoHideAlert();
      return;
    }

    if (!this.description) {
      this.alertMessage = 'Description is required.';
      this.showAlert = true;
      this.autoHideAlert();
      return;
    } else if (this.description.length > 100) {
      this.alertMessage = 'Description cannot be longer than 100 characters.';
      this.showAlert = true;
      this.autoHideAlert();
      return;
    }

    const productsInCategory = this.productService
      .getProducts()
      .filter(
        (product) =>
          product.category === this.selectedCategory &&
          product.id !== (this.product ? this.product.id : -1)
      );

    if (productsInCategory.length >= 10) {
      this.alertMessage =
        'You cannot add more than 10 products in the same category.';
      this.showAlert = true;
      this.autoHideAlert();
      return;
    }

    const newProduct: ProductData = {
      id: this.product ? this.product.id : Date.now(),
      name: this.productName,
      category: this.selectedCategory,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      description: this.description,
      createDate: this.createDate,
      total: this.quantity * this.unitPrice,
    };

    this.productService.saveProduct(newProduct);
    this.productAdded.emit(newProduct);
    this.closeModal();
  }

  autoHideAlert() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  resetForm() {
    this.productName = '';
    this.selectedCategory = '';
    this.newCategory = '';
    this.quantity = 0;
    this.unitPrice = 0;
    this.description = '';
    this.createDate = null;
    this.showAddCategoryInput = false;
    this.product = null;
    this.showAlert = false;
  }
}
