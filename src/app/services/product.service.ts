import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

export type ProductInput = Omit<Product, 'productId'>;

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

  getProductById(productId: string): Product | undefined {
    return this.productState().find((product) => product.productId === productId);
  }

  fetchProductById(productId: string): Observable<Product[] | undefined> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/${productId}`).pipe(
      catchError((err) => {
        console.error(`Failed to load product ${productId}`, err);
        return of(undefined);
      }),
    );
  }

  createProduct(input: ProductInput): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, input).pipe(
      tap((newProduct) => {
        this.productState.update((products) => [...products, newProduct]);
      }),
    );
  }

  updateProduct(productId: string, input: ProductInput): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${productId}`, input).pipe(
      tap((updatedProduct) => {
        this.productState.update((products) =>
          products.map((product) => (product.productId === productId ? updatedProduct : product)),
        );
      }),
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`).pipe(
      tap(() => {
        this.productState.update((products) =>
          products.filter((product) => product.productId !== productId),
        );
      }),
    );
  }
}
