import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

export type ProductInput = Omit<Product, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.API_URL;

  private readonly productState = signal<Product[]>([]);

  readonly products = computed(() => this.productState());

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
      next: (products) => this.productState.set(products),
      error: (err) => console.error('Failed to load products', err),
    });
  }

  getProductById(id: number): Product | undefined {
    return this.productState().find((product) => product.id === id);
  }

  createProduct(input: ProductInput): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, input).pipe(
      tap((newProduct) => {
        this.productState.update((products) => [...products, newProduct]);
      }),
    );
  }

  updateProduct(id: number, input: ProductInput): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, input).pipe(
      tap((updatedProduct) => {
        this.productState.update((products) =>
          products.map((product) => (product.id === id ? updatedProduct : product)),
        );
      }),
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`).pipe(
      tap(() => {
        this.productState.update((products) => products.filter((product) => product.id !== id));
      }),
    );
  }
}
