import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductData } from '../product-data';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements AfterViewInit {
  products: ProductData[] = [];
  filteredProducts: ProductData[] = [];
  searchTerm: string = '';
  selectedProduct: ProductData | null = null;
  isGridView = false;

  @ViewChild(ProductModalComponent) productModal!: ProductModalComponent;

  constructor(private productService: ProductService) {}

  ngAfterViewInit(): void {
    this.loadProducts();

    // Subscribe to the productAdded event from ProductModalComponent
    this.productModal.productAdded.subscribe((newProduct: ProductData) => {
      this.addProduct(newProduct);
    });
  }

  loadProducts() {
    this.products = this.productService.getProducts();
    this.sortProducts();
    this.filteredProducts = [...this.products];
  }

  addProduct(product: ProductData) {
    const existingProductIndex = this.products.findIndex(
      (p) => p.id === product.id
    );
    if (existingProductIndex !== -1) {
      this.products[existingProductIndex] = product;
    } else {
      this.products.push(product);
    }
    this.sortProducts();
    this.filterProducts();
  }

  sortProducts() {
    this.products.sort((a, b) => b.id - a.id);
  }
  toggleView() {
    this.isGridView = !this.isGridView;
  }

  searchProducts() {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editProduct(product: ProductData) {
    this.selectedProduct = { ...product };
    this.productModal.openModalWithProduct(this.selectedProduct);
  }

  deleteProduct(productId: number) {
    this.products = this.products.filter((product) => product.id !== productId);
    this.productService.deleteProduct(productId);
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openProductModal() {
    this.selectedProduct = null;
    this.productModal.openModal();
  }
}
