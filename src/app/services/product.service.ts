import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Keyboard',
    description: 'Compact Bluetooth keyboard with quiet keys and long battery life.',
    price: 49.99,
    stock: 34,
    category: 'Accessories',
  },
  {
    id: 2,
    name: 'USB-C Hub',
    description: 'Seven-port hub with HDMI, USB-A, SD card, and power delivery support.',
    price: 79.5,
    stock: 18,
    category: 'Connectivity',
  },
  {
    id: 3,
    name: 'Noise Cancelling Headphones',
    description: 'Over-ear headphones with active noise cancellation and fast charging.',
    price: 129,
    stock: 12,
    category: 'Audio',
  },
];

export type ProductInput = Omit<Product, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productState = signal<Product[]>(INITIAL_PRODUCTS);

  readonly products = computed(() => this.productState());

  getProductById(id: number): Product | undefined {
    return this.productState().find((product) => product.id === id);
  }

  createProduct(input: ProductInput): Product {
    const product: Product = {
      ...input,
      id: this.getNextId(),
    };

    this.productState.update((products) => [...products, product]);
    return product;
  }

  updateProduct(id: number, input: ProductInput): Product | undefined {
    const updatedProduct: Product = { ...input, id };

    if (!this.getProductById(id)) {
      return undefined;
    }

    this.productState.update((products) =>
      products.map((product) => (product.id === id ? updatedProduct : product)),
    );

    return updatedProduct;
  }

  deleteProduct(id: number): void {
    this.productState.update((products) => products.filter((product) => product.id !== id));
  }

  private getNextId(): number {
    const ids = this.productState().map((product) => product.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}
