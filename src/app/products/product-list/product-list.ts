import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  protected readonly productService = inject(ProductService);
  protected readonly products = this.productService.products;

  protected deleteProduct(id: number, name: string): void {
    const shouldDelete = confirm(`Delete ${name}?`);

    if (shouldDelete) {
      this.productService.deleteProduct(id).subscribe();
    }
  }
}
