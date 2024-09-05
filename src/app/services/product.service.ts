import { Injectable } from '@angular/core';
import { ProductData } from '../product-data';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private storageKey = 'products';
  private categoryKey = 'categories';

  constructor() {}

  saveProduct(product: ProductData): void {
    const products = this.getProducts();
    const existingProductIndex = products.findIndex((p) => p.id === product.id);

    if (existingProductIndex !== -1) {
      products[existingProductIndex] = product;
    } else {
      products.push(product);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  getProducts(): ProductData[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  deleteProduct(productId: number): void {
    const products = this.getProducts().filter(
      (product) => product.id !== productId
    );
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  clearStorage(): void {
    localStorage.removeItem(this.storageKey);
  }
  saveCategory(category: string) {
    const categories = this.getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      localStorage.setItem(this.categoryKey, JSON.stringify(categories));
    }
  }

  // Retrieve categories from local storage
  getCategories(): string[] {
    const categories = localStorage.getItem(this.categoryKey);
    return categories
      ? JSON.parse(categories)
      : ['Electronics', 'Apparel', 'Beauty Products', 'Home Decor', 'Others'];
  }
}
