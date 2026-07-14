import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductInput, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly routeId = this.route.snapshot.paramMap.get('id');

  protected readonly isEditMode = this.routeId !== null;
  protected readonly productId = this.routeId;
  protected readonly existingProduct = computed(() =>
    this.productId ? this.productService.getProductById(this.productId) : undefined,
  );

  protected readonly productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    description: ['', [Validators.required, Validators.maxLength(240)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required, Validators.maxLength(60)]],
  });

  constructor() {
    const product = this.existingProduct();

    if (product) {
      this.productForm.setValue({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
      });
    }
  }

  protected saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const input: ProductInput = this.productForm.getRawValue();

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, input).subscribe({
        next: (updatedProduct) => {
          void this.router.navigate(['/products', updatedProduct.productId]);
        },
        error: (err) => console.error('Failed to update product', err),
      });
      return;
    }

    this.productService.createProduct(input).subscribe({
      next: (product) => {
        void this.router.navigate(['/products', product.productId]);
      },
      error: (err) => console.error('Failed to create product', err),
    });
  }

  protected fieldHasError(field: keyof typeof this.productForm.controls): boolean {
    const control = this.productForm.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
