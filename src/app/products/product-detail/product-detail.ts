import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly productId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly product = signal<Product | undefined>(undefined);

  ngOnInit(): void {
    this.productService
      .fetchProductById(this.productId)
      .pipe(map((result) => result?.[0]))
      .subscribe({
        next: (product) => {
          this.product.set(product);
        },
        error: (err) => console.error('Failed to load product', err),
      });
  }
}
